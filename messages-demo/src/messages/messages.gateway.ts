import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { AppService } from '../app.service';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
  cors: '*',
})
@Injectable()
export class MessageGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  constructor(private readonly appService: AppService) {}

  @WebSocketServer()
  server;

  afterInit(server: any) {
    server.use((socket, next) => {
      try {
        const auth =
          socket.handshake.auth?.token || socket.handshake.query?.token;
        const decoded = jwt.verify(auth, 'banana');
        socket.id = decoded.sub;
        socket.join(decoded.sub);
        this.appService.addContact(socket.id);
      } catch (error) {
        console.error(error);
      }
      next();
    });
  }

  handleDisconnect(client: Socket) {
    this.appService.removeContact(client.id);
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
    client.to(data.to).emit('typing', { from: client.id });
    return 'Event received';
  }
}
