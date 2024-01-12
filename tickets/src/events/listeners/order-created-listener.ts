import { Listener, OrderCreatedEvent, Subjects } from "@acetickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

// this is a good example of a listerner that also publishes events
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    // using order id to lock ticket // if null its not locked

    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // if not ticket throw error
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Make the ticket as being reserved by sttings its order id Property
    ticket.set({ orderId: data.id });

    // save the ticket
    await ticket.save();

    // any time we update a record we want to publish event.
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    // ack the message
    msg.ack();
  }
}
