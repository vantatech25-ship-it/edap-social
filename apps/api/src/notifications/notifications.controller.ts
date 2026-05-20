import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(
    @Req() req: Request & { user?: { id: string } },
    @Query('cursor') cursor?: string,
    @Query('limit') limit = '20',
  ) {
    const parsedLimit = parseInt(limit, 10);
    return this.notificationsService.getNotifications(
      req.user!.id,
      parsedLimit,
      cursor,
    );
  }

  @Post('read-all')
  async markAllAsRead(@Req() req: Request & { user?: { id: string } }) {
    await this.notificationsService.markAllAsRead(req.user!.id);
    return { success: true };
  }

  @Post(':id/read')
  async markAsRead(
    @Req() req: Request & { user?: { id: string } },
    @Param('id') id: string,
  ) {
    await this.notificationsService.markAsRead(req.user!.id, id);
    return { success: true };
  }
}
