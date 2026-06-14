import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConnectionsService } from '../connections/connections.service';
import { ConnectionStatus } from '@prisma/client';

@Injectable()
export class StoriesService {
  constructor(
    private prisma: PrismaService,
    private connectionsService: ConnectionsService,
  ) {}

  async createStory(userId: string, mediaUrl: string) {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Expires in 24 hours

    return this.prisma.story.create({
      data: {
        authorId: userId,
        mediaUrl,
        expiresAt,
      },
    });
  }

  async getActiveStories(userId: string) {
    // Get connections
    const connections = await this.prisma.connection.findMany({
      where: {
        OR: [
          { followerId: userId, status: ConnectionStatus.ACCEPTED },
          { followingId: userId, status: ConnectionStatus.ACCEPTED },
        ],
      },
    });

    const connectionIds = connections.map((c) =>
      c.followerId === userId ? c.followingId : c.followerId,
    );

    // Include the user's own stories as well
    const authorIds = [userId, ...connectionIds];

    return this.prisma.story.findMany({
      where: {
        authorId: { in: authorIds },
        expiresAt: { gt: new Date() },
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
