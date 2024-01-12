// subjects are the names of channels
// this will allow typescript to help us validate data
export enum Subjects {
  TicketCreated = "ticket:created",
  TicketUpdated = "ticket:updated",
  OrderCreated = "order:created",
  OrderCancelled = "order:cancelled",
  ExpirationComplete = "expiration:complete",
  PaymentCreated = "payment:created",
}
