import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConnectionsModule } from '../connections/connections.module';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConnectionsModule, PrismaModule, JwtModule.register({})],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
