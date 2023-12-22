import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import prisma from 'src/utils/database';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  async create(createOrderDto: CreateOrderDto) {
    try {
      const { userId, productQuantities } = createOrderDto;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const order = await prisma.order.create({
        data: {
          userId,
          OrderItem: {
            create: productQuantities.map(({ productId, quantity }) => ({
              productId,
              quantity,
            })),
          },
        },
        include: {
          OrderItem: true,
        },
      });

      return order;
    } catch (error) {
      console.error('Error creating order:', error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          'Error creating order. Please check your input data.',
        );
      }

      throw new InternalServerErrorException('Error creating order');
    }
  }

  async findAll() {
    try {
      const orders = await prisma.order.findMany();

      if (!orders || orders.length === 0) {
        throw new NotFoundException('No orders found');
      }

      return orders;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const order = await prisma.order.findUnique({
        where: { id },
      });

      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      return order;
    } catch (error) {
      console.error(`Error finding order with ID ${id}:`, error);

      throw error;
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      const { userId, productQuantities } = updateOrderDto;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const existingOrder = await prisma.order.findUnique({
        where: { id },
        include: { OrderItem: true },
      });

      if (!existingOrder) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      await prisma.$transaction([
        prisma.order.update({
          where: { id },
          data: {},
          include: { OrderItem: true },
        }),
        ...productQuantities.map(({ productId, quantity }) =>
          prisma.orderItem.update({
            where: {
              orderId_productId: {
                orderId: id,
                productId: productId,
              },
            },
            data: { quantity: quantity },
          }),
        ),
      ]);

      const updatedOrder = await prisma.order.findUnique({
        where: { id },
        include: { OrderItem: true },
      });

      return updatedOrder;
    } catch (error) {
      console.error(`Error updating order with id ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      // Find the order along with its associated order items
      const orderWithItems = await prisma.order.findUnique({
        where: { id },
        include: { OrderItem: true },
      });

      if (!orderWithItems) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }

      // Delete associated order items
      await prisma.orderItem.deleteMany({
        where: { orderId: id },
      });

      // Delete the order
      const deletedOrder = await prisma.order.delete({
        where: { id },
      });

      return deletedOrder;
    } catch (error) {
      console.error(`Error deleting order with id ${id}:`, error);
      throw error;
    }
  }
}
