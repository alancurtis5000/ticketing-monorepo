import { Listener, OrderCancelledEvent, Subjects } from "@acetickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    // Find the ticket
    const ticket = await Ticket.findById(data.ticket.id);

    // if not ticket throw error
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Remove orderId to change status to not reserved
    ticket.set({ orderId: undefined });

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
