export enum OrderStatus {
  // When the order has been created, but the ticket
  // it is trying to order has not been reserved
  Created = "created",

  // The ticket the order is trying to reserve has already been
  // reserved , or when the user has cancelled the order.
  // Or The order expires before payment.
  // NOTE: this could be broken out into more status as to why the order was cancelled for analytics purposes
  Cancelled = "cancelled",

  // The order has successfully reseved the ticket
  AwaitingPayment = "awaiting:payment",

  // The order has reserved the ticket and the user has
  // provided payment successfully
  Complete = "complete",
}
