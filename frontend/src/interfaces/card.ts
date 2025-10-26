export enum Status {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  autor: string;
  created_at: string;
  update_at: string;
}
