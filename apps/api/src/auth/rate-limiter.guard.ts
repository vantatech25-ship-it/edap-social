import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class AuthRateLimiterGuard implements CanActivate {
  private ipCache = new Map<string, number[]>();
  private readonly LIMIT = 10; // Max requests
  private readonly WINDOW_MS = 60 * 1000; // 1 minute window

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<import('express').Request>();
    const ip = request.ip || request.headers['x-forwarded-for'] || 'unknown';
    const now = Date.now();

    let timestamps = this.ipCache.get(ip) || [];

    // Filter out expired timestamps
    timestamps = timestamps.filter(
      (timestamp) => now - timestamp < this.WINDOW_MS,
    );

    if (timestamps.length >= this.LIMIT) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message:
            'Too many authentication attempts. Please try again in a minute.',
          error: 'Too Many Requests',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    timestamps.push(now);
    this.ipCache.set(ip, timestamps);
    return true;
  }
}
