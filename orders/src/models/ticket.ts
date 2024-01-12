import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, OrderStatus } from "./order";

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  version: number;
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByIdAndPreviousVersion(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      // how to override how our json response from mongo. "removing _id"
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByIdAndPreviousVersion = (event: {
  id: string;
  version: number;
}) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1, // -1 because we are looking for the previous version
  });
};
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id, // have to overide _id because mongo uses _id
    title: attrs.title, // need consitent Ids accross services
    price: attrs.price,
  });
};

// this has to be a function keyword. Not an arrow function . for mongo
ticketSchema.methods.isReserved = async function () {
  // NOTE: this === the ticket document that we just called 'isReserved' on
  // // run query to look at all orders. Find an order where the ticket
  // // is the ticket we just found *and* the orders status  is *not* cnacelled.
  // // if we find and order from that means the ticker *is* reserved
  const existingOrder = await Order.findOne({
    ticket: this, // mongo findOne order in the collection
    status: {
      // where the status equals
      $in: [
        // one of the items in this array. mongo $in: is
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
