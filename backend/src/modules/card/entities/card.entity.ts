import { Priority, Status } from '@prisma/client';

export class Card {
  id: string;
  title: string;
  description: string;
  status: Status;
  created_at: Date;
  updated_at: Date;
  priority: Priority;
  autor: string;
}
