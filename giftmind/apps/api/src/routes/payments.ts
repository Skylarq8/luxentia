import { Hono } from "hono";
import type { User } from "@giftmind/db";
import Stripe from "stripe";
import { z } from "zod";
import { requireUser } from "../lib/session";

export const paymentRoute = new Hono<{ Variables: { user: User } }>();
paymentRoute.use("*", requireUser);

paymentRoute.post("/stripe-intent", async (c) => {
  const parsed = z.object({ amount: z.number().int().positive(), orderId: z.string().optional() }).safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: "Төлбөрийн дүн буруу байна" }, 400);

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return c.json({ error: "Stripe тохиргоо хийгдээгүй байна" }, 503);

  const stripe = new Stripe(secret);
  const intent = await stripe.paymentIntents.create({
    amount: parsed.data.amount,
    currency: "mnt",
    metadata: {
      orderId: parsed.data.orderId ?? ""
    },
    automatic_payment_methods: { enabled: true }
  });

  return c.json({ clientSecret: intent.client_secret });
});
