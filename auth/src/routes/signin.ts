import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { User } from "../models/user";
import { PasswordManager } from "../services/password-manager";
import { validateRequest, BadRequestError } from "@acetickets/common";
const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email") // running validation on body of request
      .isEmail()
      .withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }
    const passwordsMatch = await PasswordManager.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid credentials");
    }
    // generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY! // exclamation in typescript ignore warning
    );

    // store jwt on session cookie
    req.session = {
      jwt: userJwt,
    };

    // response
    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
