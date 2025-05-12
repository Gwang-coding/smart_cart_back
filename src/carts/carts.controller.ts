// src/carts/carts.controller.ts
import { Controller, Post, Body, Param } from '@nestjs/common';
import { CartsGateway } from './carts.gateway';
import { CartsService } from './carts.service';
import { ScanCartDto } from './dto/scan-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(
    private readonly cartsGateway: CartsGateway,
    private readonly cartsService: CartsService,
  ) {}

  @Post(':cartId/scan')
  async simulateScan(
    @Param('cartId') cartId: string,
    @Body() body: ScanCartDto,
  ) {
    console.log('카트 스캔 요청:', cartId, body);

    try {
      // QR 토큰 (요청에서 받거나 기본값 사용)
      const qrToken = body?.token || `cart_${cartId}_${Date.now()}`;

      // 인증 세션 토큰 생성
      const sessionToken = this.cartsService.createAuthSession(cartId);

      // QR 스캔 이벤트
      const scanEvent = {
        type: 'scan',
        cartId,
        timestamp: Date.now(),
        qrToken,
        sessionToken, // 새로 생성한 세션 토큰
      };

      // 웹소켓을 통해 이벤트 브로드캐스트
      await this.cartsGateway.handleScanEvent(scanEvent);

      return {
        success: true,
        message: `카트 ${cartId}에 대한 스캔 이벤트가 성공적으로 전송되었습니다.`,
        sessionToken,
        qrToken,
      };
    } catch (error) {
      console.error('오류 발생:', error);
      return {
        success: false,
        message: `오류가 발생했습니다: ${error.message}`,
      };
    }
  }

  // 세션 토큰 검증 엔드포인트 (선택적)
  @Post(':cartId/validate-session')
  validateSession(
    @Param('cartId') cartId: string,
    @Body() body: { sessionToken: string },
  ) {
    const isValid = this.cartsService.validateSessionToken(
      body.sessionToken,
      cartId,
    );

    return {
      valid: isValid,
      cartId: isValid ? cartId : null,
    };
  }
}
