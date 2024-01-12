import { Subjects, Publisher, PaymentCreatedEvent } from "@acetickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
