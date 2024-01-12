import { Publisher, Subjects, TicketUpdatedEvent } from "@acetickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
