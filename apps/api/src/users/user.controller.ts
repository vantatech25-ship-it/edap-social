import { Controller, Get, Put, Param, Body, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getProfile(@Req() req) {
    return this.userService.findById(req.user.id);
  }

  @Put('me')
  async updateProfile(@Req() req, @Body() body: any) {
    return this.userService.updateProfile(req.user.id, body);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}
