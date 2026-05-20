import { Controller, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly postsService: PostsService) {}

  @Delete(':id')
  async removeComment(
    @Req() req: Request & { user?: { id: string } },
    @Param('id') id: string,
  ) {
    return this.postsService.deleteComment(req.user!.id, id);
  }
}
