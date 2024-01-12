import { Publisher, OrderCreatedEvent, Subjects } from "@acetickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
