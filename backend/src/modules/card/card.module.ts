import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { WebsocketModule } from '../websocket/websocket.module';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [CardController],
  providers: [CardService, PrismaService],
  exports: [CardService],
})
export class CardModule {}
