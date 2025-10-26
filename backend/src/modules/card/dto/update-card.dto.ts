import { Status } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateCardDto {
  @IsEnum(Status)
  status: Status;
}
