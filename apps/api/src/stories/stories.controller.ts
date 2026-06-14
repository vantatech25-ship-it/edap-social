import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { StoriesService } from './stories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/stories')
@UseGuards(JwtAuthGuard)
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post()
  async create(
    @Req() req: Request & { user: { id: string } },
    @Body('mediaUrl') mediaUrl: string,
  ) {
    return this.storiesService.createStory(req.user.id, mediaUrl);
  }

  @Get()
  async getActiveStories(@Req() req: Request & { user: { id: string } }) {
    return this.storiesService.getActiveStories(req.user.id);
  }
}
