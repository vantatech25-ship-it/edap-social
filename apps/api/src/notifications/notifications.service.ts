import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationType, NotificationEntityType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private gateway: NotificationsGateway,
  ) {}

  async createNotification(
    userId: string,
    actorId: string,
    type: NotificationType,
    entityType: NotificationEntityType,
    entityId?: string,
    message?: string,
  ) {
    if (userId === actorId) return; // Do not notify yourself

    // Enforce block boundary
    const isBlocked = await this.prisma.connection.findFirst({
      where: {
        OR: [
          { followerId: userId, followingId: actorId, status: 'BLOCKED' },
          { followerId: actorId, followingId: userId, status: 'BLOCKED' },
        ],
      },
    });
    if (isBlocked) return;

    if (
      type === NotificationType.REACTION ||
      type === NotificationType.FOLLOW
    ) {
      const existing = await this.prisma.notification.findFirst({
        where: {
          userId,
          actorId,
          type,
          entityId,
          createdAt: {
            gte: new Date(Date.now() - 5 * 60 * 1000),
          },
        },
      });
      if (existing) return;
    }

    const notification = await this.prisma.notification.create({
      data: {
        userId,
        actorId,
        type,
        entityType,
        entityId,
        message,
      },
      include: {
        actor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    const unreadCount = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    this.gateway.sendNotification(userId, notification, unreadCount);
    return notification;
  }

  async getNotifications(userId: string, limit = 20, cursor?: string) {
    const take = limit + 1;
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: {
        actor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    const hasNextPage = notifications.length > limit;
    const items = hasNextPage ? notifications.slice(0, -1) : notifications;
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;

    return { items, nextCursor };
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
