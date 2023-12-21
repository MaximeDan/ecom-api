import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import prisma from 'src/utils/database';

@Injectable()
export class OrdersService {
  async create(createOrderDto: CreateOrderDto) {
    try {
      const order = await prisma.order.create({
        data: createOrderDto,
      });
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async findAll() {
    try {
      const orders = await prisma.order.findMany();
      return orders;
    } catch (error) {
      console.error('Error finding all orders:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: id },
      });
      return order;
    } catch (error) {
      console.error(`Error finding order with id ${id}:`, error);
      throw error;
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await prisma.order.update({
        where: { id: id },
        data: updateOrderDto,
      });
      return order;
    } catch (error) {
      console.error(`Error updating order with id ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const order = await prisma.order.delete({
        where: { id: id },
      });
      return order;
    } catch (error) {
      console.error(`Error deleting order with id ${id}:`, error);
      throw error;
    }
  }
}
