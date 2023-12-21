import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import prisma from '../utils/database';

@Injectable()
export class ProductsService {
  async create(createProductDto: CreateProductDto) {
    const { name, price } = createProductDto;

    // Use Prisma to create a new product in the database
    const createdProduct = await prisma.product.create({
      data: {
        name,
        price,
      },
    });

    return createdProduct;
  }

  async findAll() {
    // Use Prisma to retrieve all products from the database
    const products = await prisma.product.findMany();
    return products;
  }

  async findOne(id: number) {
    // Use Prisma to retrieve a product by ID from the database
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // Use Prisma to update a product in the database
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
    // Use Prisma to delete a product from the database
    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return deletedProduct;
  }
}
