import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateN8nWebhookDto } from './dto/create-n8n-webhook.dto';

@Injectable()
export class N8nWebhookService {
  async create(createN8nWebhookDto: CreateN8nWebhookDto) {
    console.log(createN8nWebhookDto);

    const WEBHOOK_URL = 'http://localhost:5678/webhook-test/kanban-export';

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
