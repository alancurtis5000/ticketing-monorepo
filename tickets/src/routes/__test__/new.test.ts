import request from "supertest";
import { app } from "../../app";
import { getAuthCookie } from "../../test/helpers";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).toEqual(401);
});

it("returns status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", getAuthCookie())
    .send({});
  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  const response1 = await request(app)
    .post("/api/tickets")
    .set("Cookie", getAuthCookie())
    .send({
      title: "",
      price: 10,
    });
  expect(response1.status).toEqual(400);

  const response2 = await request(app)
    .post("/api/tickets")
    .set("Cookie", getAuthCookie())
    .send({
      price: 10,
    });
  expect(response2.status).toEqual(400);
});

it("returns an error if an invalid price is provided", async () => {
  const response1 = await request(app)
    .post("/api/tickets")
    .set("Cookie", getAuthCookie())
    .send({
      title: "testTitle",
      price: -10,
    });
  expect(response1.status).toEqual(400);

  const response2 = await request(app)
    .post("/api/tickets")
    .set("Cookie", getAuthCookie())
    .send({
      title: "testTitle",
    });
  expect(response2.status).toEqual(400);
});

it("creates ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", getAuthCookie())
    .send({
      title: "testTitle",
      price: 10,
    });
  expect(response.status).toEqual(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
});

it("publishes an event", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", getAuthCookie())
    .send({
      title: "testTitle",
      price: 10,
    });
  expect(response.status).toEqual(201);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
