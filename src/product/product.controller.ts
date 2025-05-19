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
    @Body() body: { isScan: boolean; barcode: string },
  ): Promise<{ isScan: boolean; getProduct?: Product; message?: string }> {
    const { barcode, isScan } = body;
    const getProduct = await this.productService.getProductById(barcode);
    if (!getProduct) {
      return { isScan: false, message: '상품을 찾을 수 없습니다.' };
    }
    this.websocketService.sendBarcodeData({ isScan, getProduct });
    return { isScan, getProduct };
  }

  @Get('barcode/:barcode')
  async getProductByBarcode(
    @Param('barcode') barcode: string,
  ): Promise<Product> {
    return this.productService.findByBarcode(barcode);
  }
}
