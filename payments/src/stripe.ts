// this file makes an instance for our project to use stripe.

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: "2023-08-16",
});
