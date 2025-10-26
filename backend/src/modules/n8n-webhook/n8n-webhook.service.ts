import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateN8nWebhookDto } from './dto/create-n8n-webhook.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class N8nWebhookService {
  constructor(private readonly configService: ConfigService) {}

  async create(createN8nWebhookDto: CreateN8nWebhookDto) {
    const WEBHOOK_URL = this.configService.get<string>('DATABASE_N8N') || '';

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createN8nWebhookDto),
    });

    if (!response.ok) {
      throw new BadRequestException('No se pudo enviar el reporte');
    }

    return {
      success: true,
    };
  }
}
