import { Module } from '@nestjs/common';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConnectionsModule } from '../connections/connections.module';

@Module({
  imports: [PrismaModule, ConnectionsModule],
  controllers: [StoriesController],
  providers: [StoriesService],
})
export class StoriesModule {}
