"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subjects = void 0;
// subjects are the names of channels
// this will allow typescript to help us validate data
var Subjects;
(function (Subjects) {
    Subjects["TicketCreated"] = "ticket:created";
    Subjects["TicketUpdated"] = "ticket:updated";
    Subjects["OrderCreated"] = "order:created";
    Subjects["OrderCancelled"] = "order:cancelled";
    Subjects["ExpirationComplete"] = "expiration:complete";
    Subjects["PaymentCreated"] = "payment:created";
})(Subjects = exports.Subjects || (exports.Subjects = {}));
