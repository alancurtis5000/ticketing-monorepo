import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@acetickets/common";

import { createChargeRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true); // express by default does not trust proxy
app.use(json());
app.use(
  cookieSession({
    signed: false, // don't encrypt cookie
    secure: process.env.NODE_ENV !== "test", // this is boolean: must be on https
  })
);

app.use(currentUser);

// routers start //
app.use(createChargeRouter);
// routers end //

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
