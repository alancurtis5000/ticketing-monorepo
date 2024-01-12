import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@acetickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
