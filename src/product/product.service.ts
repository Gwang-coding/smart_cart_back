import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findByBarcode(barcode: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ barcode });

    if (!product) {
      throw new NotFoundException('해당 바코드의 제품을 찾을 수 없습니다.');
    }

    return product;
  }
}
