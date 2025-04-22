import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TokenService } from '../services/security/token.service';
import { Types } from 'mongoose';

@WebSocketGateway({
  cors: {
    origin: 'http://127.0.0.1:5500', // frontend
  },
})
export class RealTimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly tokenService: TokenService) {}

  private clients: Map<string, string> = new Map();

  @WebSocketServer()
  io: Server;

  async handleConnection(client: Socket) {
    const { accessToken } = client.handshake.auth;
    const user = await this.tokenService.verify(accessToken);
    this.clients.set(user._id.toString(), client.id);
    console.log(this.clients);
  }

  async handleDisconnect(client: Socket) {
    const { accessToken } = client.handshake.auth;
    const user = await this.tokenService.verify(accessToken);
    this.clients.delete(user._id.toString());
  }

  async emitProductStockUpdate(productId: Types.ObjectId, newStock: number) {
    this.io.emit('product-stock-updated', { productId, newStock });
  }
}
