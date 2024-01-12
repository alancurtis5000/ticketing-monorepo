"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    // When the order has been created, but the ticket
    // it is trying to order has not been reserved
    OrderStatus["Created"] = "created";
    // The ticket the order is trying to reserve has already been
    // reserved , or when the user has cancelled the order.
    // Or The order expires before payment.
    // NOTE: this could be broken out into more status as to why the order was cancelled for analytics purposes
    OrderStatus["Cancelled"] = "cancelled";
    // The order has successfully reseved the ticket
    OrderStatus["AwaitingPayment"] = "awaiting:payment";
    // The order has reserved the ticket and the user has
    // provided payment successfully
    OrderStatus["Complete"] = "complete";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
