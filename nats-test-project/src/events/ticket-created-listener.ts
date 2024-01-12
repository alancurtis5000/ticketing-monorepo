import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated; // readonly in typescript means the subject will not change
  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("event data!@@!", data);

    console.log(data.id);
    console.log(data.title);
    console.log(data.price);

    msg.ack(); // this responds back to the publisher that the data has been processed
  }
}
