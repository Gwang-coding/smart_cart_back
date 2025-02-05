import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { WebSocketGatewayService } from 'src/gateway/websocket.gateway';
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly websocketService: WebSocketGatewayService,
  ) {}

  @Post('scan')
  async handleBarcode(
    @Body('barcode') barcode: string,
  ): Promise<Product | { message: string }> {
    const product = await this.productService.getProductById(barcode);
    if (!product) {
      return { message: '상품을 찾을 수 없습니다.' };
    }
    this.websocketService.sendBarcodeData(product);
    return product;
  }
}
