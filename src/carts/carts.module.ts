import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { CartsGateway } from './carts.gateway';

@Module({
  controllers: [CartsController],
  providers: [CartsService, CartsGateway],
})
export class CartsModule {}
