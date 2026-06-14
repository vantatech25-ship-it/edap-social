import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ReactDto } from './dto/react.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(
    @Req() req: Request & { user?: { id: string } },
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(req.user!.id, createPostDto);
  }

  @Get(':id')
  async findOne(
    @Req() req: Request & { user?: { id: string } },
    @Param('id') id: string,
  ) {
    return this.postsService.findOne(req.user!.id, id);
  }

  @Delete(':id')
  async remove(
    @Req() req: Request & { user?: { id: string } },
    @Param('id') id: string,
  ) {
    return this.postsService.remove(req.user!.id, id);
  }

  @Put(':id')
  async update(
    @Req() req: Request & { user?: { id: string } },
    @Param('id') id: string,
    @Body() updateData: Partial<CreatePostDto>,
  ) {
    return this.postsService.update(req.user!.id, id, updateData);
  }

  @Post(':id/comments')
  async createComment(
    @Req() req: Request & { user?: { id: string } },
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.postsService.createComment(req.user!.id, id, createCommentDto);
  }

  @Get(':id/comments')
  async getComments(
    @Req() req: Request & { user?: { id: string } },
    @Param('id') id: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit = '10',
  ) {
    const parsedLimit = parseInt(limit, 10);
    return this.postsService.getComments(req.user!.id, id, parsedLimit, cursor);
  }

  @Post(':id/react')
  async react(
    @Req() req: Request & { user?: { id: string } },
    @Param('id') id: string,
    @Body() reactDto: ReactDto,
  ) {
    return this.postsService.react(req.user!.id, id, reactDto);
  }

  @Delete(':id/react')
  async removeReaction(
    @Req() req: Request & { user?: { id: string } },
    @Param('id') id: string,
  ) {
    return this.postsService.removeReaction(req.user!.id, id);
  }
}
