// src/carts/carts.service.ts
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface SessionData {
  cartId: string;
  timestamp: number;
  expiresAt: number;
}

@Injectable()
export class CartsService {
  private authorizedSessions = new Map<string, SessionData>();

  // QR 토큰 검증 메서드 추가
  validateCartToken(cartId: string, token: string): boolean {
    console.log(`검증 시도: cartId=${cartId}, token=${token}`);
    // 간단한 검증 로직 (실제 환경에서는 더 강력한 검증 필요)
    if (!token) {
      return false;
    }

    // 토큰이 해당 카트에 대한 것인지 확인
    if (token.includes(`cart_${cartId}`) || token.includes(`qr_${cartId}`)) {
      return true;
    }

    return false;
  }

  // QR 코드용 토큰 생성
  generateQRToken(cartId: string): string {
    const token = `cart_${cartId}_${Date.now()}`;
    return token;
  }

  // 인증 세션 생성 (QR 스캔 후)
  createAuthSession(cartId: string): string {
    // UUID 기반 세션 토큰 생성
    const sessionToken = uuidv4();

    // 토큰 정보 저장 (30분 후 만료)
    const expiresAt = Date.now() + 30 * 60 * 1000;
    this.authorizedSessions.set(sessionToken, {
      cartId,
      timestamp: Date.now(),
      expiresAt,
    });

    // 세션 청소 작업 (만료된 세션 제거)
    this.cleanExpiredSessions();

    return sessionToken;
  }

  // 세션 토큰 유효성 검증
  validateSessionToken(sessionToken: string, cartId: string): boolean {
    const session = this.authorizedSessions.get(sessionToken);

    if (!session) {
      return false;
    }

    if (Date.now() > session.expiresAt || session.cartId !== cartId) {
      this.authorizedSessions.delete(sessionToken);
      return false;
    }

    return true;
  }

  // 만료된 세션 제거
  private cleanExpiredSessions(): void {
    const now = Date.now();
    for (const [token, session] of this.authorizedSessions.entries()) {
      if (now > session.expiresAt) {
        this.authorizedSessions.delete(token);
      }
    }
  }
}
