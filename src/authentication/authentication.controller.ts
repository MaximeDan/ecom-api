import {
  Controller,
  Body,
  Res,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SignInDto } from './dto/authentication.dto';
import { AuthService } from './authentication.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const createdUser = await this.authService.signUp(createUserDto);
      res.status(HttpStatus.CREATED).json(createdUser);
    } catch (error) {
      res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Post('signin')
  @UsePipes(new ValidationPipe())
  async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    try {
      const token = await this.authService.signIn(signInDto);
      res.status(HttpStatus.OK).json({ token });
    } catch (error) {
      res
        .status(error.status || HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid credentials' });
    }
  }
}
