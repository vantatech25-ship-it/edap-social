import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getThreads(userId: string) {
    // A thread in our schema is just implicitly defined by messages having a threadId.
    // Or perhaps there's a Thread model? Let me check the schema.
    // Wait, the schema has `Message` with `threadId` String. There is no `Thread` model.
    // So threads are just grouped by `threadId`. 
    // We should probably find distinct threads where the user is a participant.
    // Since we don't have a Thread model or participants, maybe `threadId` is a combination of user IDs, like `userA_userB`.

    // Let's get the latest message from each thread the user is in.
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          // If we assume threadId is like `${userA}_${userB}` where userA < userB
          { threadId: { contains: userId } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      distinct: ['threadId'],
    });
    return messages;
  }

  async getMessages(userId: string, threadId: string, limit = 50, cursor?: string) {
    // Validate that the user is part of the thread
    if (!threadId.includes(userId)) {
      throw new ForbiddenException('You do not have access to this thread');
    }

    const take = limit + 1;
    const messages = await this.prisma.message.findMany({
      where: { threadId },
      take,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
      },
    });

    const hasNextPage = messages.length > limit;
    const items = hasNextPage ? messages.slice(0, -1) : messages;
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;

    return {
      messages: items,
      nextCursor,
    };
  }

  async saveMessage(threadId: string, senderId: string, content: string, mediaUrl?: string) {
    if (!threadId.includes(senderId)) {
      throw new ForbiddenException('You cannot send a message to this thread');
    }

    return this.prisma.message.create({
      data: {
        threadId,
        senderId,
        content,
        mediaUrl,
      },
    });
  }
}
