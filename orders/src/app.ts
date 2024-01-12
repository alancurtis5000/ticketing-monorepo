import express from "express";
import "express-async-errors";
import { json } from "body-parser";

import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@acetickets/common";

import { deleteOrderRouter } from "./routes/delete";
import { indexOrderRouter } from "./routes";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";

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
// routes //
app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
