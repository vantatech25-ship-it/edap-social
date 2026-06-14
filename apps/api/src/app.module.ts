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
import { ChatModule } from './chat/chat.module';
import { ReactionsModule } from './reactions/reactions.module';
import { GroupsModule } from './groups/groups.module';
import { StoriesModule } from './stories/stories.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    ConnectionsModule,
    PostsModule,
    FeedModule,
    NotificationsModule,
    ReactionsModule,
    ChatModule,
    GroupsModule,
    StoriesModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
