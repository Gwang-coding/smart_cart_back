import { Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //모든 유저 조회 API
  @Get()
  async getAllUsers(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Post(':barcode')
  async getProductById(
    @Param('barcode') barcode: string,
  ): Promise<Product | null> {
    return this.productService.getProductById(barcode);
  }
}
