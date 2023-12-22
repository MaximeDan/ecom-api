import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  HttpCode,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Response } from 'express';
import { AuthenticationGuard } from 'src/authentication/authentication.guard';
import { Role } from 'src/authentication/role.decorator';
import { RoleGuard } from 'src/authentication/roles.guard';

@Controller('orders')
@UseGuards(AuthenticationGuard)
@UseGuards(RoleGuard)
@Role(['admin'])
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @Role(['user'])
  async create(@Body() createOrderDto: CreateOrderDto, @Res() res: Response) {
    try {
      const createdOrder = await this.ordersService.create(createOrderDto);
      res.status(HttpStatus.CREATED).json(createdOrder);
    } catch (error) {
      res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const orders = await this.ordersService.findAll();
      res.status(HttpStatus.OK).json(orders);
    } catch (error) {
      res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const order = await this.ordersService.findOne(+id);
      res.status(HttpStatus.OK).json(order);
    } catch (error) {
      res
        .status(error.status || HttpStatus.NOT_FOUND)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Res() res: Response,
  ) {
    try {
      const updatedOrder = await this.ordersService.update(+id, updateOrderDto);
      res.status(HttpStatus.OK).json(updatedOrder);
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
      await this.ordersService.remove(+id);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      res
        .status(error.status || HttpStatus.NOT_FOUND)
        .json({ message: error.message });
    }
  }
}
