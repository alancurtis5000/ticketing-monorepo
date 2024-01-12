import { Subjects } from "./subjects";

// each event will have its own event that handles type validation
export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
