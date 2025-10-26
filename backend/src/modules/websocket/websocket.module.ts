import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { WebsocketGateway } from './websocket.gateway';
import { PrismaService } from 'src/database/prisma.service';
import { CardService } from '../card/card.service';
import { CardModule } from '../card/card.module';

@Module({
  imports: [CardModule],
  providers: [WebsocketGateway, WebsocketService, PrismaService, CardService],
  exports: [WebsocketService],
})
export class WebsocketModule {}
