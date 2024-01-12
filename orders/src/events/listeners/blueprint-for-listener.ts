import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@acetickets/common";
import { Ticket } from "../../models/ticket";

// extends listener class with the coresponding event
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "orders-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message) {}
}
