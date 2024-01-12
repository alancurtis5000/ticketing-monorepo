import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { getAuthCookie } from "../../test/helpers";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

// todo: write test to see if user is logged in ex: tickets: test in ticket repo

it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post("/api/orders")
    .set("Cookie", getAuthCookie())
    .send({ ticketId })
    .expect(404);
});

it("returns and error if ticket is already reserved", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save(); //save ticket to database

  const order = Order.build({
    userId: "123testId",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket,
  });
  await order.save(); //save order to database * this means its reserved*

  await request(app)
    .post("/api/orders")
    .set("Cookie", getAuthCookie())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save(); //save ticket to database

  await request(app)
    .post("/api/orders")
    .set("Cookie", getAuthCookie())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it("emits an order created event", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save(); //save ticket to database

  await request(app)
    .post("/api/orders")
    .set("Cookie", getAuthCookie())
    .send({ ticketId: ticket.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
