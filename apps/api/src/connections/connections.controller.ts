  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { ConnectionsService } from './connections.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/connections')
@UseGuards(JwtAuthGuard)
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Post('follow/:id')
  async follow(
    @Req() req: Request & { user?: { id: string } },
    @Param('id') id: string,
  ) {
    return this.connectionsService.follow(req.user!.id, id);
  }

  @Delete('unfollow/:id')
  async unfollow(
    @Req() req: Request & { user?: { id: string } },
    @Param('id') id: string,
  ) {
    return this.connectionsService.unfollow(req.user!.id, id);
  }

  @Post('block/:id')
  async block(
    @Req() req: Request & { user?: { id: string } },
    @Param('id') id: string,
  ) {
    return this.connectionsService.block(req.user!.id, id);
  }

  @Get('followers/:userId')
  async getFollowers(
    @Param('userId') userId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit = '10',
  ) {
    return this.connectionsService.getConnections(
      userId,
      'followers',
      parseInt(limit, 10),
      cursor,
    );
  }

  @Get('following/:userId')
  async getFollowing(
    @Param('userId') userId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit = '10',
  ) {
    return this.connectionsService.getConnections(
      userId,
      'following',
      parseInt(limit, 10),
      cursor,
    );
  }

  @Get('pending')
  async getPendingRequests(@Req() req: Request & { user?: { id: string } }) {
    return this.connectionsService.getPendingRequests(req.user!.id);
  }

  @Put(':id/accept')
  async acceptRequest(
    @Req() req: Request & { user?: { id: string } },
    @Param('id') id: string, // the id of the user who sent the request (follower)
  ) {
    return this.connectionsService.acceptRequest(id, req.user!.id);
  }

  @Delete(':id/reject')
  async rejectRequest(
    @Req() req: Request & { user?: { id: string } },
    @Param('id') id: string, // the id of the user who sent the request (follower)
  ) {
    return this.connectionsService.rejectRequest(id, req.user!.id);
  }
}
