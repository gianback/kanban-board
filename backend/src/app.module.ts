import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { PrismaService } from './database/prisma.service';
import { CardModule } from './modules/card/card.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { N8nWebhookModule } from './modules/n8n-webhook/n8n-webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    CardModule,
    WebsocketModule,
    N8nWebhookModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
