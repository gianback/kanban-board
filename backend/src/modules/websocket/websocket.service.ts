import { Injectable } from '@nestjs/common';
import { Card } from '@prisma/client';
import { WebsocketGateway } from './websocket.gateway';
import { CreateCardDto } from '../card/dto/create-card.dto';

@Injectable()
export class WebsocketService {
  constructor(private readonly websocketGateway: WebsocketGateway) {}

  async createCard(card: CreateCardDto) {
    this.websocketGateway.emitCardCreated(card);
  }

  async deleteCard(id: string) {
    this.websocketGateway.emitCardDeleted(id);
  }

  async updateCard(card: Card) {
    this.websocketGateway.emitCardUpdated(card);
  }
}
