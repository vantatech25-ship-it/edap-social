import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConnectionStatus, PostPrivacy } from '@prisma/client';

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {}

  async getChronologicalFeed(userId: string, cursor?: string, limit = 20) {
    const take = limit + 1;

    const following = await this.prisma.connection.findMany({
      where: {
        followerId: userId,
        status: ConnectionStatus.ACCEPTED,
      },
      select: { followingId: true },
    });

    const followingIds = following.map((c) => c.followingId);

    const blocks = await this.prisma.connection.findMany({
      where: {
        OR: [
          { followerId: userId, status: ConnectionStatus.BLOCKED },
          { followingId: userId, status: ConnectionStatus.BLOCKED },
        ],
      },
      select: { followerId: true, followingId: true },
    });

    const blockedUserIds = new Set<string>();
    blocks.forEach((b) => {
      if (b.followerId !== userId) blockedUserIds.add(b.followerId);
      if (b.followingId !== userId) blockedUserIds.add(b.followingId);
    });

    const candidateAuthorIds = [userId, ...followingIds].filter(
      (id) => !blockedUserIds.has(id),
    );

    const posts = await this.prisma.post.findMany({
      where: {
        authorId: { in: candidateAuthorIds },
        OR: [
          { authorId: userId },
          { privacy: { in: [PostPrivacy.PUBLIC, PostPrivacy.FRIENDS] } },
        ],
      },
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
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

    const hasNextPage = posts.length > limit;
    const items = hasNextPage ? posts.slice(0, -1) : posts;
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;

    return { items, nextCursor };
  }
}
