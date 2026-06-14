import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('threads')
  async getThreads(@Req() req: Request & { user?: { id: string } }) {
    return this.chatService.getThreads(req.user!.id);
  }

  @Get('threads/:threadId')
  async getMessages(
    @Req() req: Request & { user?: { id: string } },
    @Param('threadId') threadId: string,
    @Query('limit') limit = '50',
    @Query('cursor') cursor?: string,
  ) {
    return this.chatService.getMessages(
      req.user!.id,
      threadId,
      parseInt(limit, 10),
      cursor,
    );
  }
}
