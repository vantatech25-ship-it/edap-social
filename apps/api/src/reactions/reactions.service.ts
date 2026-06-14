import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ReactionEntityType, NotificationType, NotificationEntityType } from '@prisma/client';

@Injectable()
export class ReactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(userId: string, createReactionDto: CreateReactionDto) {
    // Check if the entity exists
    let authorId: string | null = null;
    if (createReactionDto.entityType === ReactionEntityType.POST) {
      const post = await this.prisma.post.findUnique({ where: { id: createReactionDto.entityId } });
      if (!post) throw new NotFoundException('Post not found');
      authorId = post.authorId;
    } else if (createReactionDto.entityType === ReactionEntityType.COMMENT) {
      const comment = await this.prisma.comment.findUnique({ where: { id: createReactionDto.entityId } });
      if (!comment) throw new NotFoundException('Comment not found');
      authorId = comment.authorId;
    }

    // Upsert the reaction to avoid duplicates and handle changing reaction types
    const reaction = await this.prisma.reaction.upsert({
      where: {
        userId_entityType_entityId: {
          userId,
          entityType: createReactionDto.entityType,
          entityId: createReactionDto.entityId,
        },
      },
      update: {
        reactionType: createReactionDto.reactionType,
      },
      create: {
        userId,
        entityType: createReactionDto.entityType,
        entityId: createReactionDto.entityId,
        reactionType: createReactionDto.reactionType,
      },
    });

    // Notify the author if it's not their own content
    if (authorId && authorId !== userId) {
      const entityTypeForNotification = 
        createReactionDto.entityType === ReactionEntityType.POST 
          ? NotificationEntityType.POST 
          : NotificationEntityType.COMMENT;

      await this.notificationsService.createNotification({
        userId: authorId,
        actorId: userId,
        type: NotificationType.REACTION,
        entityType: entityTypeForNotification,
        entityId: createReactionDto.entityId,
        message: `reacted to your ${createReactionDto.entityType.toLowerCase()}`,
      });
    }

    return reaction;
  }

  async getReactions(entityType: ReactionEntityType, entityId: string) {
    const reactions = await this.prisma.reaction.findMany({
      where: { entityType, entityId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Group by reaction type for easier consumption
    const summary = reactions.reduce((acc, curr) => {
      acc[curr.reactionType] = (acc[curr.reactionType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: reactions.length,
      summary,
      reactions,
    };
  }

  async remove(userId: string, entityType: ReactionEntityType, entityId: string) {
    try {
      await this.prisma.reaction.delete({
        where: {
          userId_entityType_entityId: {
            userId,
            entityType,
            entityId,
          },
        },
      });
      return { success: true };
    } catch (error) {
      // If the record does not exist, Prisma throws an error, but we can just ignore it or throw NotFoundException
      throw new NotFoundException('Reaction not found');
    }
  }
}
