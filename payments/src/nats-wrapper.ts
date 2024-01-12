import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan; // the question make tells typescript it could be undefined

  // get is a typescript getter that allows you to do something if its undefined
  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before its connected");
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to NATS!!!!");
        resolve();
      });
      this.client.on("error", (err) => {
        console.log(err);
      });
    });
  }
}

// only exporting an single instace of wrapper for all app to use
export const natsWrapper = new NatsWrapper();
