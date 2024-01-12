import request from "supertest";
import { app } from "../../app";

describe("signup route", () => {
  it("returns 201 on successful signup", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);
  });
  it("returns 400 on with invalid email", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        email: "testtest.com",
        password: "password",
      })
      .expect(400);
  });
  it("returns 400 on with invalid password", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "pa",
      })
      .expect(400);
  });
  it("returns 400 on with missing password", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
      })
      .expect(400);
  });
  it("returns 400 on with missing email", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        password: "password",
      })
      .expect(400);
  });
  it("returns 400 on with invalid password", async () => {
    return request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "pa",
      })
      .expect(400);
  });
  it("returns 400 on with missing", async () => {
    return request(app).post("/api/users/signup").send({}).expect(400);
  });
  it("disallows duplicate emails", async () => {
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);
    await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(400);
  });
  it("sets cookie after succesful sign up", async () => {
    const response = await request(app)
      .post("/api/users/signup")
      .send({
        email: "test@test.com",
        password: "password",
      })
      .expect(201);
    expect(response.get("Set-Cookie")).toBeDefined();
  });
});
