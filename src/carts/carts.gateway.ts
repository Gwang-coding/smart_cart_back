// src/carts/carts.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { CartsService } from './carts.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*', // 개발용. 프로덕션에서는 제한 필요
  },
})
export class CartsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients = new Map<string, Set<string>>();

  constructor(private readonly cartsService: CartsService) {}

  // 클라이언트 연결 처리
  handleConnection(client: Socket) {
    console.log(`클라이언트 연결됨: ${client.id}`);

    // 카트 ID를 쿼리 파라미터로 받음
    const cartId = client.handshake.query.cartId as string;

    if (cartId) {
      // 카트 ID에 대한 Set이 없으면 새로 생성
      if (!this.connectedClients.has(cartId)) {
        this.connectedClients.set(cartId, new Set<string>());
      }

      // 이미 존재하는 Set에 클라이언트 ID 추가
      const clientsSet = this.connectedClients.get(cartId);
      if (clientsSet) {
        // null 체크 추가
        clientsSet.add(client.id);
      }

      console.log(`클라이언트 ${client.id}가 카트 ${cartId}에 연결됨`);
    }
  }

  // 클라이언트 연결 해제 처리
  handleDisconnect(client: Socket) {
    console.log(`클라이언트 연결 해제됨: ${client.id}`);

    // 모든 카트 ID를 순회하면서 해당 클라이언트 제거
    for (const [cartId, clients] of this.connectedClients.entries()) {
      if (clients.has(client.id)) {
        clients.delete(client.id);
        console.log(`클라이언트 ${client.id}가 카트 ${cartId}에서 연결 해제됨`);

        // 클라이언트가 없으면 카트 항목 제거
        if (clients.size === 0) {
          this.connectedClients.delete(cartId);
          console.log(`카트 ${cartId}에 연결된 클라이언트 없음, 항목 제거`);
        }
      }
    }
  }

  // QR 스캔 이벤트 처리 (REST API에서 호출됨)
  async handleScanEvent(scanEvent: any) {
    console.log(`QR 스캔 이벤트: ${JSON.stringify(scanEvent)}`);

    // 토큰 검증 (선택 사항)
    const isValid = await this.cartsService.validateCartToken(
      scanEvent.cartId,
      scanEvent.qrToken,
    );

    if (isValid) {
      // 모든 클라이언트에게 이벤트 브로드캐스트
      this.server.emit('message', scanEvent);

      // 특정 카트 ID에 대한 클라이언트들에게만 전송 (선택 사항)
      const cartId = scanEvent.cartId;
      if (this.connectedClients.has(cartId)) {
        const clients = this.connectedClients.get(cartId);
        if (clients && clients.size > 0) {
          console.log(
            `카트 ${cartId}에 연결된 ${clients.size}개의 클라이언트에게 메시지 전송`,
          );

          for (const clientId of clients) {
            this.server.to(clientId).emit('message', scanEvent);
          }
        }
      }

      return true;
    }

    return false;
  }
}
