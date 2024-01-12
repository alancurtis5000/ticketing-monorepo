import { Publisher, Subjects, TicketCreatedEvent } from "@acetickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
