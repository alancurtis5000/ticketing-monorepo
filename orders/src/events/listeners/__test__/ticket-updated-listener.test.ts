import { TicketUpdatedEvent } from "@acetickets/common";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create a ticket and save
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 25,
  });
  await ticket.save();

  // create a fake data object
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "updated concert",
    price: 333,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("finds, updates, and saves a ticket", async () => {
  const { listener, data, msg, ticket } = await setup();

  // call the onMessage function witht he data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was updated!
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks(acknowleges) the message", async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function witht he data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called!
  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event version is not the next version", async () => {
  const { listener, data, msg } = await setup();
  data.version = 23;

  try {
    await listener.onMessage(data, msg);
  } catch (error) {}
  expect(msg.ack).not.toHaveBeenCalled();
});
