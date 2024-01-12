import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

// replaced word stan with client
const client = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

client.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const publisher = new TicketCreatedPublisher(client);

  try {
    // wait for the event to get published
    await publisher.publish({
      id: "123",
      title: "concert",
      price: 20333,
    });
  } catch (error) {
    console.log(error);
  }
});
