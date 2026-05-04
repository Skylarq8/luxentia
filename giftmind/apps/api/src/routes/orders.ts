import { Hono } from "hono";
import type { User } from "@giftmind/db";
import { z } from "zod";
import { requireUser } from "../lib/session";
import { hasSupabaseConfig, supabase } from "../lib/supabase";

export const orderRoute = new Hono<{ Variables: { user: User } }>();
orderRoute.use("*", requireUser);
orderRoute.use("*", async (c, next) => {
  if (!hasSupabaseConfig) return c.json({ error: "Supabase тохиргоо хийгдээгүй байна" }, 503);
  await next();
});

orderRoute.post("/", async (c) => {
  const user = c.get("user");
  const parsed = z
    .object({
      items: z.array(z.any()).min(1),
      total: z.number().nonnegative(),
      shipping_address: z.record(z.any())
    })
    .safeParse(await c.req.json());

  if (!parsed.success) return c.json({ error: "Захиалгын мэдээлэл буруу байна" }, 400);

  const { data, error } = await supabase
    .from("orders")
    .insert({ user_id: user.id, ...parsed.data })
    .select("*")
    .single();

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ order: data }, 201);
});

orderRoute.get("/", async (c) => {
  const user = c.get("user");
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return c.json({ error: error.message }, 500);
  return c.json({ orders: data ?? [] });
});

orderRoute.get("/:id", async (c) => {
  const user = c.get("user");
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", c.req.param("id"))
    .eq("user_id", user.id)
    .single();

  if (error) return c.json({ error: "Захиалга олдсонгүй" }, 404);
  return c.json({ order: data });
});
