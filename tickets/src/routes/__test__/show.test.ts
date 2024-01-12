import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { getAuthCookie } from "../../test/helpers";

it("returns 404 if the ticket is not found", async () => {
  // mongo has a specific way of formating ids.
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .get(`/api/tickets/${id}`)
    .set("Cookie", getAuthCookie())
    .send();
  expect(response.status).toEqual(404);
});

it("returns the ticket with matching id", async () => {
  const title = "ticketTitle";
  const price = 20;
  // this creates a ticket
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", getAuthCookie())
    .send({ title, price })
    .expect(201);

  // now we can look up that ticket by the id
  const ticketResopnse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResopnse.body.title).toEqual(title);
  expect(ticketResopnse.body.price).toEqual(price);
});
