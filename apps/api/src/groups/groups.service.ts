import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { PrismaService } from '../prisma/prisma.service';
import { GroupRole } from '@prisma/client';

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createGroupDto: CreateGroupDto) {
    return this.prisma.group.create({
      data: {
        name: createGroupDto.name,
        description: createGroupDto.description,
        coverUrl: createGroupDto.coverUrl,
        privacy: createGroupDto.privacy,
        members: {
          create: {
            userId,
            role: GroupRole.OWNER,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.group.findMany({
      include: {
        _count: {
          select: { members: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        members: {
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
        },
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  async join(userId: string, groupId: string) {
    const group = await this.prisma.group.findUnique({ where: { id: groupId } });
    if (!group) throw new NotFoundException('Group not found');

    const existingMembership = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: { groupId, userId },
      },
    });

    if (existingMembership) {
      throw new ConflictException('You are already a member of this group');
    }

    return this.prisma.groupMember.create({
      data: {
        groupId,
        userId,
        role: GroupRole.MEMBER,
      },
    });
  }

  async leave(userId: string, groupId: string) {
    const membership = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: { groupId, userId },
      },
    });

    if (!membership) throw new NotFoundException('You are not a member of this group');
    if (membership.role === GroupRole.OWNER) {
      throw new ConflictException('The owner cannot leave the group. Transfer ownership or delete the group.');
    }

    return this.prisma.groupMember.delete({
      where: {
        groupId_userId: { groupId, userId },
      },
    });
  }
}
