import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConnectionsService } from '../connections/connections.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ReactDto } from './dto/react.dto';
import {
  PostPrivacy,
  ConnectionStatus,
  ReactionEntityType,
  NotificationType,
  NotificationEntityType,
} from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private connectionsService: ConnectionsService,
    private notificationsService: NotificationsService,
  ) {}

  async create(userId: string, data: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        content: data.content,
        mediaUrls: data.mediaUrls ? data.mediaUrls : [],
        privacy: data.privacy || PostPrivacy.PUBLIC,
        authorId: userId,
      },
    });
  }

  async findOne(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.authorId === userId) {
      return post;
    }

    const isBlocked = await this.connectionsService.isBlocked(
      userId,
      post.authorId,
    );
    if (isBlocked) {
      throw new ForbiddenException(
        'You do not have permission to view this post',
      );
    }

    if (post.privacy === PostPrivacy.PRIVATE) {
      throw new ForbiddenException('This post is private');
    }

    if (post.privacy === PostPrivacy.FRIENDS) {
      const connection = await this.prisma.connection.findFirst({
        where: {
          OR: [
            {
              followerId: userId,
              followingId: post.authorId,
              status: ConnectionStatus.ACCEPTED,
            },
            {
              followerId: post.authorId,
              followingId: userId,
              status: ConnectionStatus.ACCEPTED,
            },
          ],
        },
      });
      if (!connection) {
        throw new ForbiddenException(
          'You must be a connection to view this post',
        );
      }
    }

    return post;
  }

  async remove(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    return this.prisma.post.delete({ where: { id: postId } });
  }

  async update(userId: string, postId: string, data: Partial<CreatePostDto>) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own posts');
    }
    return this.prisma.post.update({
      where: { id: postId },
      data: {
        content: data.content,
        privacy: data.privacy,
      },
    });
  }

  async createComment(userId: string, postId: string, data: CreateCommentDto) {
    const post = await this.findOne(userId, postId); // Enforces post privacy and block logic

    const comment = await this.prisma.comment.create({
      data: {
        content: data.content,
        postId,
        authorId: userId,
        parentCommentId: data.parentCommentId,
      },
    });

    await this.notificationsService.createNotification(
      post.authorId,
      userId,
      NotificationType.COMMENT,
      NotificationEntityType.POST,
      postId,
    );

    return comment;
  }

  async getComments(
    userId: string,
    postId: string,
    limit = 10,
    cursor?: string,
  ) {
    await this.findOne(userId, postId); // Enforces post privacy and block logic

    const take = limit + 1;
    const comments = await this.prisma.comment.findMany({
      where: {
        postId,
        parentCommentId: null, // Basic level: only fetch top-level comments directly, or maybe all? Spec: "Include nested replies (basic level for MVP)". We can fetch top-level and include 3 replies.
      },
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        replies: {
          take: 3,
          orderBy: { createdAt: 'asc' },
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
        },
      },
    });

    const hasNextPage = comments.length > limit;
    const items = hasNextPage ? comments.slice(0, -1) : comments;
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;

    return { items, nextCursor };
  }

  async deleteComment(userId: string, commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }
    return this.prisma.comment.delete({ where: { id: commentId } });
  }

  async react(userId: string, postId: string, data: ReactDto) {
    const post = await this.findOne(userId, postId); // Enforces post privacy and block logic

    const reaction = await this.prisma.reaction.upsert({
      where: {
        userId_entityType_entityId: {
          userId,
          entityType: ReactionEntityType.POST,
          entityId: postId,
        },
      },
      update: {
        reactionType: data.reactionType,
      },
      create: {
        userId,
        entityType: ReactionEntityType.POST,
        entityId: postId,
        reactionType: data.reactionType,
      },
    });

    await this.notificationsService.createNotification(
      post.authorId,
      userId,
      NotificationType.REACTION,
      NotificationEntityType.POST,
      postId,
    );

    return reaction;
  }

  async removeReaction(userId: string, postId: string) {
    await this.findOne(userId, postId); // Check visibility

    const reaction = await this.prisma.reaction.findUnique({
      where: {
        userId_entityType_entityId: {
          userId,
          entityType: ReactionEntityType.POST,
          entityId: postId,
        },
      },
    });

    if (!reaction) {
      throw new NotFoundException('Reaction not found');
    }

    return this.prisma.reaction.delete({
      where: {
        userId_entityType_entityId: {
          userId,
          entityType: ReactionEntityType.POST,
          entityId: postId,
        },
      },
    });
  }
}
