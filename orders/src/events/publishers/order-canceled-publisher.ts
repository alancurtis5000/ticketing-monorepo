import { Publisher, OrderCancelledEvent, Subjects } from "@acetickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
