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
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Response } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(
    @Body() createProductDto: CreateProductDto,
    @Res() res: Response,
  ) {
    try {
      const createdProduct =
        await this.productsService.create(createProductDto);
      res.status(HttpStatus.CREATED).json(createdProduct);
    } catch (error) {
      res
        .status(error.status || HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const products = await this.productsService.findAll();
      res.status(HttpStatus.OK).json(products);
    } catch (error) {
      res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const product = await this.productsService.findOne(+id);
      res.status(HttpStatus.OK).json(product);
    } catch (error) {
      res
        .status(error.status || HttpStatus.NOT_FOUND)
        .json({ message: error.message });
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Res() res: Response,
  ) {
    try {
      const updatedProduct = await this.productsService.update(
        +id,
        updateProductDto,
      );
      res.status(HttpStatus.OK).json(updatedProduct);
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
      await this.productsService.remove(+id);
      res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      res
        .status(error.status || HttpStatus.NOT_FOUND)
        .json({ message: error.message });
    }
  }
}
