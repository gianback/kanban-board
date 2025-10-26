import { Controller, Post, Body, Get } from '@nestjs/common';
import { N8nWebhookService } from './n8n-webhook.service';
import { CreateN8nWebhookDto } from './dto/create-n8n-webhook.dto';

@Controller('n8n-webhook')
export class N8nWebhookController {
  constructor(private readonly n8nWebhookService: N8nWebhookService) {}

  @Post()
  create(@Body() createN8nWebhookDto: CreateN8nWebhookDto) {
    return this.n8nWebhookService.create(createN8nWebhookDto);
  }
}
