import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { ForbiddenException } from '@nestjs/common';

@WebSocketGateway({
  cors: '*',
})
export class MessageGateway implements OnGatewayConnection, OnGatewayInit {
  @WebSocketServer()
  server;

  afterInit(server: any) {
    server.use((socket, next) => {
      const auth = socket.handshake.auth;
      const decoded = jwt.verify(auth.token, 'banana');
      socket.id = decoded.sub;
      socket.join(decoded.sub);
      next();
    });
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('Socket connected');
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() { to, message }: { to: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(to).emit('message', { message, from: client.id });
    return 'Message Send';
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { to: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(data.to);
    client.to(data.to).emit('typing', { from: client.id });
    return 'Event received';
  }
}
