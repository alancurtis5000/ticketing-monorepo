import { Subjects } from "./subjects";

// each event will have its own event that handles type validation
export interface ExpirationCompleteEvent {
  subject: Subjects.ExpirationComplete;
  data: {
    orderId: string;
  };
}
