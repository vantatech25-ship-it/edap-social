import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { FeedService } from './feed.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/feed')
@UseGuards(JwtAuthGuard)
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  async getFeed(
    @Req() req: Request & { user?: { id: string } },
    @Query('cursor') cursor?: string,
    @Query('limit') limit = '20',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Query('sort') sort = 'chronological',
  ) {
    const parsedLimit = parseInt(limit, 10);
    const safeLimit = parsedLimit > 50 ? 50 : parsedLimit;

    // Stage 4 MVP: Only chronological
    return this.feedService.getChronologicalFeed(
      req.user!.id,
      cursor,
      safeLimit,
    );
  }
}
