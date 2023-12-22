import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Res,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { AuthenticationGuard } from 'src/authentication/authentication.guard';
import { Role } from 'src/authentication/role.decorator';
import { RoleGuard } from 'src/authentication/roles.guard';

@Controller('users')
@UseGuards(AuthenticationGuard, RoleGuard)
@Role(['admin'])
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const createdUser = await this.usersService.create(createUserDto);
      res.status(HttpStatus.CREATED).json(createdUser);
    } catch (error) {
      res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const users = await this.usersService.findAll();
      res.status(HttpStatus.OK).json(users);
    } catch (error) {
      res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.usersService.findOne(+id);
      res.status(HttpStatus.OK).json(user);
    } catch (error) {
      res
        .status(error.status || HttpStatus.NOT_FOUND)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      const updatedUser = await this.usersService.update(+id, updateUserDto);
      res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.usersService.remove(+id);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      res
        .status(error.status || HttpStatus.NOT_FOUND)
        .json({ message: error.message });
    }
  }
}
