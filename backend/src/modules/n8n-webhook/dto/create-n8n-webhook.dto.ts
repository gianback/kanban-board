import { IsEmail } from 'class-validator';

export class CreateN8nWebhookDto {
  @IsEmail()
  email: string;
}
