import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { Card } from '@prisma/client';
import { CardService } from '../card/card.service';
import { CreateCardDto } from '../card/dto/create-card.dto';

@WebSocketGateway({ cors: true })
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(private readonly cardService: CardService) {}

  async handleConnection() {
    console.log('Cliente conectado');
  }

  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado', client.id);
  }

  @SubscribeMessage('created-card')
  async handleCardCreated(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateCardDto,
  ) {
    try {
      const cardCreated = await this.cardService.create(data);

      this.wss.emit('on-created-card', cardCreated);
    } catch (error) {}
  }

  @SubscribeMessage('updated-card')
  async handleCardUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: Card,
  ) {
    await this.cardService.update(data.id, data);

    client.broadcast.emit('on-updated-card', data);

    return { success: true };
  }

  emitCardCreated(data: CreateCardDto) {
    this.wss.emit('created-card', data);
  }

  emitCardUpdated(data: Card) {
    this.wss.emit('updated-card', data);
  }

  emitCardDeleted(id: string) {
    this.wss.emit('deleted-card', id);
  }
}
