import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import prisma from '../utils/database';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    try {
      const { email, name, password, roles } = createUserDto;

      const hashedPassword = await bcrypt.hash(password, 10);

      const createdUser = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          roles: roles || ['user'],
        },
      });

      return createdUser;
    } catch (error) {
      console.error('Error creating user:', error);

      throw new Error('Error creating user');
    }
  }

  async findAll() {
    const users = await prisma.user.findMany();
    return users;
  }

  async findOne(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        roles: updateUserDto.roles || ['user'],
      },
    });

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  async remove(id: number) {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return deletedUser;
  }

  async validatePassword(user: any, password: string): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return isPasswordValid;
  }
}
