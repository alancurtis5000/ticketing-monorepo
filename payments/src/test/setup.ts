import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// use the mocked version of nats wrapper in the __mocks__ dir
jest.mock("../nats-wrapper.ts");

process.env.STRIPE_KEY = "sk_test_c7MVBsHhjJ1dgOTfNQkoeabk00G1i7V3wz";

let mongo: any;
// before test start boot up MongoMemoryServer.
beforeAll(async () => {
  jest.clearAllMocks(); // need this to clear all mocked functions ex:jest.mock("../nats-wrapper.ts");
  process.env.JWT_KEY = "1234abcd"; // this is not the best way to do this.
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

// before each test go into mongodb and delete all data.
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// after all test are done shut down mongo mem server
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});
