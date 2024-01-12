import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@acetickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByIdAndPreviousVersion(data);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    const { title, price } = data; // note! here is where you would add version save if not using plugin
    ticket.set({ title, price }); // update the ticket you want to save to the database with set
    await ticket.save(); // save to database

    msg.ack(); // call ack() to comunicate message was proccessed successfully
  }
}
