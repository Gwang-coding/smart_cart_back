import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  //모든 상품가져오기
  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }

  //특정 상품 가져오기
  async getProductById(barcode: string): Promise<Product | null> {
    return this.productRepository.findOne({ where: { barcode } });
  }
}
