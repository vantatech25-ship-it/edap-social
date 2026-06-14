import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  async create(
    @Req() req: Request & { user?: { id: string } },
    @Body() createGroupDto: CreateGroupDto,
  ) {
    return this.groupsService.create(req.user!.id, createGroupDto);
  }

  @Get()
  async findAll() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Post(':id/join')
  async join(
    @Req() req: Request & { user?: { id: string } },
    @Param('id') id: string,
  ) {
    return this.groupsService.join(req.user!.id, id);
  }

  @Delete(':id/leave')
  async leave(
    @Req() req: Request & { user?: { id: string } },
    @Param('id') id: string,
  ) {
    return this.groupsService.leave(req.user!.id, id);
  }
}
