import { Hono } from "hono";
import type { User } from "@giftmind/db";
import { z } from "zod";
import { requireAdmin } from "../lib/session";
import { hasSupabaseConfig, supabase } from "../lib/supabase";

export const adminRoute = new Hono<{ Variables: { user: User } }>();
adminRoute.use("*", requireAdmin);
adminRoute.use("*", async (c, next) => {
  if (!hasSupabaseConfig) return c.json({ error: "Supabase тохиргоо хийгдээгүй байна" }, 503);
  await next();
});

adminRoute.get("/stats", async (c) => {
  const [orders, users, products] = await Promise.all([
    supabase.from("orders").select("total,status", { count: "exact" }),
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true })
  ]);

  const revenue = (orders.data ?? []).reduce((sum, order) => (order.status === "cancelled" ? sum : sum + order.total), 0);

  return c.json({
    totalOrders: orders.count ?? 0,
    revenue,
    users: users.count ?? 0,
    products: products.count ?? 0
  });
});

adminRoute.get("/products", async (c) => {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ products: data ?? [] });
});

adminRoute.post("/products", async (c) => {
  const parsed = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    images: z.array(z.string()).default([]),
    stock: z.number().default(0),
    metadata: z.record(z.any()).default({})
  }).safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: "Барааны мэдээлэл буруу байна" }, 400);

  const { data, error } = await supabase.from("products").insert(parsed.data).select("*").single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ product: data }, 201);
});

adminRoute.get("/products/:id", async (c) => {
  const { data, error } = await supabase.from("products").select("*").eq("id", c.req.param("id")).single();
  if (error) return c.json({ error: "Бараа олдсонгүй" }, 404);
  return c.json({ product: data });
});

adminRoute.patch("/products/:id", async (c) => {
  const body = await c.req.json();
  const { data, error } = await supabase.from("products").update(body).eq("id", c.req.param("id")).select("*").single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ product: data });
});

adminRoute.delete("/products/:id", async (c) => {
  const { error } = await supabase.from("products").delete().eq("id", c.req.param("id"));
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ success: true });
});

adminRoute.get("/orders", async (c) => {
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ orders: data ?? [] });
});

adminRoute.patch("/orders/:id", async (c) => {
  const parsed = z.object({ status: z.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled"]) }).safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: "Төлөв буруу байна" }, 400);

  const { data, error } = await supabase.from("orders").update(parsed.data).eq("id", c.req.param("id")).select("*").single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ order: data });
});

adminRoute.delete("/orders/:id", async (c) => {
  const { error } = await supabase.from("orders").delete().eq("id", c.req.param("id"));
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ success: true });
});

adminRoute.get("/users", async (c) => {
  const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ users: data ?? [] });
});
