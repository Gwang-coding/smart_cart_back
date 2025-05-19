import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository, Like, ILike } from 'typeorm';

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

  // 이름에 특정 텍스트가 포함된 상품 검색
  async searchByName(searchText: string): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        name: ILike(`%${searchText}%`), // 대소문자 구분 없이 검색
      },
    });
  }
}
