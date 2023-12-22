import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthService } from './authentication.service';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [],
  controllers: [AuthenticationController],
  providers: [AuthService, PrismaService],
})
export class AuthenticationModule {}
