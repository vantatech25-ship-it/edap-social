import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

class RegisterDto {
  password?: string;
  email?: string;
}

class LoginDto {
  password?: string;
  email?: string;
}

@Controller('api/auth')
export class AuthController {
  @Post('register')
  async register(@Body() body: RegisterDto) {
    const saltOrRounds = 10;
    const password = body.password || 'default_password';
    const passwordHash = await bcrypt.hash(password, saltOrRounds);

    // In a real app, save user with passwordHash to DB
    return {
      message: 'User registered successfully',
      userId: 'uuid-placeholder',
      passwordHash,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() body: LoginDto) {
    // const password = body.password || 'default_password';
    // Stub: in real app, fetch user from DB and compare
    // const isMatch = await bcrypt.compare(password, user.passwordHash);

    return {
      accessToken: 'jwt-access-token-placeholder',
      refreshToken: 'jwt-refresh-token-placeholder',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refresh() {
    return {
      accessToken: 'new-jwt-access-token-placeholder',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout() {
    return { message: 'Logged out successfully' };
  }
}
