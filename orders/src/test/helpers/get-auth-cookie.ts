import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// tut he uses global variable global.signin, I made specific helper.
// this function makes a authcookie for testing faking if user is lagit
export const getAuthCookie = () => {
  // build a jwt payload {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };
  // create jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build a session object {jwt: my-jwt}
  const session = { jwt: token };

  // turn that session into JSON
  const sessionToJSON = JSON.stringify(session);

  // take JSON encode it as base 64
  const base64 = Buffer.from(sessionToJSON).toString("base64");

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
