import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { getAuthCookie } from "../../test/helpers";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", getAuthCookie())
    .send({
      title: "asdfjkl",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "asdfjkl",
      price: 20,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  // to fake logging in as two users
  // save the response from first request getAuthCookie generates unique id
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", getAuthCookie())
    .send({
      title: "asdfjkl",
      price: 20,
    });

  // but when we run getAuthCookie again it is a new ID and won't match.
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", getAuthCookie())
    .send({
      title: "asdfjkldddd",
      price: 33,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  // create multiple request from same user. store cookie in variable
  const cookie = getAuthCookie();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asdfjkl",
      price: 20,
    });

  // test invalid title
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 33,
    })
    .expect(400);

  // test invalid price
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "asdfjkl",
      price: -11,
    })
    .expect(400);
});

it("updates the ticket if all values are valid", async () => {
  const cookie = getAuthCookie();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asdfjkl",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 100,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("new title");
  expect(ticketResponse.body.price).toEqual(100);
});

it("publishes an event", async () => {
  const cookie = getAuthCookie();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asdfjkl",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 100,
    })
    .expect(200);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("rejects updates if ticket is reserved", async () => {
  const cookie = getAuthCookie();
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "asdfjkl",
      price: 20,
    });

  const ticket = await Ticket.findById(response.body.id);
  ticket?.set({ orderId: new mongoose.Types.ObjectId().toHexString() });

  await ticket?.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "new title",
      price: 100,
    })
    .expect(400);
});
