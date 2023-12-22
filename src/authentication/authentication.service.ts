import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/authentication.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signIn(signInDto: SignInDto): Promise<string> {
    const { email, password } = signInDto;

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersService.validatePassword(user, password);

    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return token;
  }

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const { email } = createUserDto;

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email address is already registered');
    }

    try {
      const createdUser = await this.usersService.create({
        ...createUserDto,
      });

      return createdUser;
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }
}
