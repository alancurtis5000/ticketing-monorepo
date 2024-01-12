import { Subjects } from "./subjects";
import { OrderStatus } from "./types/order-status";

// each event will have its own event that handles type validation
export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    version: number;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    ticket: {
      id: string;
      price: number;
    };
  };
}
