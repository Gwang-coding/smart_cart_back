import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } }) // CORS 설정
export class WebSocketGatewayService {
  @WebSocketServer()
  server: Server;

  sendBarcodeData(data: any) {
    this.server.emit('barcodeData', data); // Next.js에 데이터 푸시
  }
}
