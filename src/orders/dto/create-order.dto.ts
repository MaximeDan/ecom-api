import { IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  userId: number;

  @IsArray()
  @ArrayMinSize(1)
  productQuantities: { productId: number; quantity: number }[];
}
