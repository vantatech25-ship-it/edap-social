import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  Query,
  ForbiddenException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { ConnectionsService } from '../connections/connections.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly connectionsService: ConnectionsService,
  ) {}

  @Get('me')
  async getProfile(@Req() req: Request & { user?: { id: string } }) {
    return this.userService.findById(req.user.id);
  }

  @Put('me')
  async updateProfile(
    @Req() req: Request & { user?: { id: string } },
    @Body() body: Record<string, unknown>,
  ) {
    return this.userService.updateProfile(req.user.id, body);
  }

  @Get(':id')
  async getUser(
    @Req() req: Request & { user?: { id: string } },
    @Param('id') id: string,
  ) {
    const isBlocked = await this.connectionsService.isBlocked(req.user.id, id);
    if (isBlocked) {
      throw new ForbiddenException(
        'You do not have permission to view this profile',
      );
    }
    return this.userService.findById(id);
  }

  @Post(':id/follow')
  async follow(
    @Req() req: Request & { user?: { id: string } },
    @Param('id') id: string,
  ) {
    return this.connectionsService.follow(req.user.id, id);
  }

  @Delete(':id/follow')
  async unfollow(
    @Req() req: Request & { user?: { id: string } },
    @Param('id') id: string,
  ) {
    return this.connectionsService.unfollow(req.user.id, id);
  }

  @Post(':id/block')
  @HttpCode(HttpStatus.OK)
  async block(
    @Req() req: Request & { user?: { id: string } },
    @Param('id') id: string,
  ) {
    return this.connectionsService.block(req.user.id, id);
  }

  @Get(':id/connections')
  async getConnections(
    @Param('id') id: string,
    @Query('type') type: 'followers' | 'following' = 'following',
    @Query('limit') limit = '10',
    @Query('cursor') cursor?: string,
  ) {
    const parsedLimit = parseInt(limit, 10);
    return this.connectionsService.getConnections(
      id,
      type,
      parsedLimit,
      cursor,
    );
  }
}
