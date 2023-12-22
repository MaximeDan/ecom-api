import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthenticationController } from 'src/authentication/authentication.controller';
import { AuthService } from 'src/authentication/authentication.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UsersController, AuthenticationController],
  providers: [UsersService, AuthService, JwtService],
})
export class UsersModule {}
