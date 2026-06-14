import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { Request } from 'express';
import { ReactionsService } from './reactions.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReactionEntityType } from '@prisma/client';

@Controller('api/reactions')
@UseGuards(JwtAuthGuard)
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post()
  async create(
    @Req() req: Request & { user?: { id: string } },
    @Body() createReactionDto: CreateReactionDto,
  ) {
    return this.reactionsService.create(req.user!.id, createReactionDto);
  }

  @Get()
  async findAll(
    @Query('entityType') entityType: ReactionEntityType,
    @Query('entityId') entityId: string,
  ) {
    return this.reactionsService.getReactions(entityType, entityId);
  }

  @Delete()
  async remove(
    @Req() req: Request & { user?: { id: string } },
    @Query('entityType') entityType: ReactionEntityType,
    @Query('entityId') entityId: string,
  ) {
    return this.reactionsService.remove(req.user!.id, entityType, entityId);
  }
}
