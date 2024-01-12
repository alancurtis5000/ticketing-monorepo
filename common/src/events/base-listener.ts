import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

// T['key'] you can use this when you extend and interface
export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;
  protected client: Stan; // changed to protect so subclasses can access it
  protected ackWait = 5 * 1000; // 5 seconds default can be overwriten

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable() // use together : when service reboots it gets all events and delivers them
      .setManualAckMode(true) // setManualAckMode makes it so we have to run msg.ack() to conclude event processed
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName); // use together : gives a name for when a service goes down and comes back up
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName, //  use together : (channel subsribed to, queue group(to prevent multiple events ))
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message recieved: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }
  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}
