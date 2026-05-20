import {
  Injectable,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import {
  ConnectionStatus,
  NotificationType,
  NotificationEntityType,
} from '@prisma/client';

@Injectable()
export class ConnectionsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    // Check if target user exists
    const targetUser = await this.prisma.user.findUnique({
      where: { id: followingId },
    });
    if (!targetUser) {
      throw new NotFoundException('User to follow not found');
    }

    // Check if blocked relation exists between A and B in either direction
    const blockRelation = await this.prisma.connection.findFirst({
      where: {
        OR: [
          { followerId, followingId, status: ConnectionStatus.BLOCKED },
          {
            followerId: followingId,
            followingId: followerId,
            status: ConnectionStatus.BLOCKED,
          },
        ],
      },
    });

    if (blockRelation) {
      throw new ForbiddenException('Cannot follow this user due to a block');
    }

    // Check existing follow relationship
    const existing = await this.prisma.connection.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });

    if (existing) {
      if (existing.status === ConnectionStatus.ACCEPTED) {
        throw new ConflictException('You are already following this user');
      }
      if (existing.status === ConnectionStatus.PENDING) {
        throw new ConflictException('Follow request is already pending');
      }
    }

    // Create follow relationship (ACCEPTED for simple follow model MVP)
    const connection = await this.prisma.connection.create({
      data: {
        followerId,
        followingId,
        status: ConnectionStatus.ACCEPTED,
      },
    });

    await this.notificationsService.createNotification(
      followingId,
      followerId,
      NotificationType.FOLLOW,
      NotificationEntityType.USER,
      followerId,
    );

    return connection;
  }

  async unfollow(followerId: string, followingId: string) {
    // Check if follow relation exists and is not blocked
    const existing = await this.prisma.connection.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });

    if (!existing || existing.status === ConnectionStatus.BLOCKED) {
      throw new BadRequestException('You are not following this user');
    }

    return this.prisma.connection.delete({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });
  }

  async block(blockerId: string, blockedId: string) {
    if (blockerId === blockedId) {
      throw new BadRequestException('You cannot block yourself');
    }

    // Check if target user exists
    const targetUser = await this.prisma.user.findUnique({
      where: { id: blockedId },
    });
    if (!targetUser) {
      throw new NotFoundException('User to block not found');
    }

    // 1. Delete any inverse follow relationship (where blockedId follows blockerId)
    await this.prisma.connection.deleteMany({
      where: {
        followerId: blockedId,
        followingId: blockerId,
      },
    });

    // 2. Upsert block relationship (where blockerId is follower/subject, blockedId is following/target)
    return this.prisma.connection.upsert({
      where: {
        followerId_followingId: {
          followerId: blockerId,
          followingId: blockedId,
        },
      },
      update: {
        status: ConnectionStatus.BLOCKED,
      },
      create: {
        followerId: blockerId,
        followingId: blockedId,
        status: ConnectionStatus.BLOCKED,
      },
    });
  }

  async getConnections(
    userId: string,
    type: 'followers' | 'following',
    limit = 10,
    cursor?: string,
  ) {
    const take = limit + 1;

    if (type === 'following') {
      const connections = await this.prisma.connection.findMany({
        where: {
          followerId: userId,
          status: ConnectionStatus.ACCEPTED,
        },
        take,
        cursor: cursor
          ? {
              followerId_followingId: {
                followerId: userId,
                followingId: cursor,
              },
            }
          : undefined,
        orderBy: {
          followingId: 'asc',
        },
        include: {
          following: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
              bio: true,
            },
          },
        },
      });

      const hasNextPage = connections.length > limit;
      const items = hasNextPage ? connections.slice(0, -1) : connections;
      const nextCursor = hasNextPage
        ? items[items.length - 1].followingId
        : null;

      return {
        connections: items.map((c) => c.following),
        nextCursor,
      };
    } else {
      // type === 'followers'
      const connections = await this.prisma.connection.findMany({
        where: {
          followingId: userId,
          status: ConnectionStatus.ACCEPTED,
        },
        take,
        cursor: cursor
          ? {
              followerId_followingId: {
                followerId: cursor,
                followingId: userId,
              },
            }
          : undefined,
        orderBy: {
          followerId: 'asc',
        },
        include: {
          follower: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
              bio: true,
            },
          },
        },
      });

      const hasNextPage = connections.length > limit;
      const items = hasNextPage ? connections.slice(0, -1) : connections;
      const nextCursor = hasNextPage
        ? items[items.length - 1].followerId
        : null;

      return {
        connections: items.map((c) => c.follower),
        nextCursor,
      };
    }
  }

  async isBlocked(userA: string, userB: string): Promise<boolean> {
    const relation = await this.prisma.connection.findFirst({
      where: {
        OR: [
          {
            followerId: userA,
            followingId: userB,
            status: ConnectionStatus.BLOCKED,
          },
          {
            followerId: userB,
            followingId: userA,
            status: ConnectionStatus.BLOCKED,
          },
        ],
      },
    });
    return !!relation;
  }
}
