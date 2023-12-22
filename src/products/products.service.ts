import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import prisma from '../utils/database';

@Injectable()
export class ProductsService {
  async create(createProductDto: CreateProductDto) {
    const { name, price, availableQty } = createProductDto;

    const createdProduct = await prisma.product.create({
      data: {
        name,
        price,
        availableQty,
      },
    });

    return createdProduct;
  }

  async findAll() {
    const products = await prisma.product.findMany();
    return products;
  }

  async findOne(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateProductDto,
    });

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return updatedProduct;
  }

  async remove(id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { orderItems: { include: { order: true } } },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const ordersToDelete = product.orderItems.map(
      (orderItem) => orderItem.order,
    );

    // Delete associated orders
    for (const order of ordersToDelete) {
      await prisma.orderItem.deleteMany({
        where: { orderId: order.id },
      });

      await prisma.order.delete({
        where: { id: order.id },
      });
    }

    // Delete the product
    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    return deletedProduct;
  }
}
