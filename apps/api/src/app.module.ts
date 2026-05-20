import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { ConnectionsModule } from './connections/connections.module';
import { PrismaModule } from './prisma/prisma.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PostsModule } from './posts/posts.module';
import { FeedModule } from './feed/feed.module';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    ConnectionsModule,
    PostsModule,
    FeedModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
