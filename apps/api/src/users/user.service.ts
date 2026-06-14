import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async updateProfile(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async searchUsers(query: string) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
      },
      take: 10,
    });
  }

  async getBirthdays(userId: string) {
    // Basic MVP logic: get connections and filter by those who have dateOfBirth.
    // A robust system would query by month/day.
    const connections = await this.prisma.connection.findMany({
      where: {
        OR: [
          { followerId: userId, status: 'ACCEPTED' },
          { followingId: userId, status: 'ACCEPTED' },
        ],
      },
    });

    const connectionIds = connections.map((c) =>
      c.followerId === userId ? c.followingId : c.followerId,
    );

    return this.prisma.user.findMany({
      where: {
        id: { in: connectionIds },
        dateOfBirth: { not: null },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        dateOfBirth: true,
      },
    });
  }
}
