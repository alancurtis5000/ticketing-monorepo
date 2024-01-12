import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

// replaced word stan with client
// second argument is the client id has to be unique
const client = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

client.on("connect", () => {
  console.log("Listener connected to NATS");

  client.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  new TicketCreatedListener(client).listen();
});

// this is a way of stoping the subsciption client if it shuts down
process.on("SIGINT", () => client.close());
process.on("SIGTERM", () => client.close());
