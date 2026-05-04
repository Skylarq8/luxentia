import { Hono } from "hono";
import { z } from "zod";
import { hasSupabaseConfig, supabase } from "../lib/supabase";

export const productRoute = new Hono();

productRoute.get("/", async (c) => {
  if (!hasSupabaseConfig) return c.json({ products: [] });

  const { category, minPrice, maxPrice, search, tags } = c.req.query();
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });

  if (category) query = query.eq("category", category);
  if (minPrice) query = query.gte("price", Number(minPrice));
  if (maxPrice) query = query.lte("price", Number(maxPrice));
  if (tags) query = query.contains("tags", tags.split(","));
  if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);

  const { data, error } = await query.limit(80);
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ products: data ?? [] });
});

productRoute.get("/categories/all", async (c) => {
  if (!hasSupabaseConfig) return c.json({ categories: [] });

  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ categories: data ?? [] });
});

productRoute.post("/search", async (c) => {
  if (!hasSupabaseConfig) return c.json({ products: [] });

  const parsed = z.object({ query: z.string(), maxPrice: z.number().optional(), category: z.string().optional() }).safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: "Хайлтын утга буруу байна" }, 400);

  let query = supabase.rpc("search_products", { search_term: parsed.data.query, max_results: 24 });
  const { data, error } = await query;
  if (error) return c.json({ error: error.message }, 500);

  const products = (data ?? []).filter((product) => {
    if (parsed.data.maxPrice && product.price > parsed.data.maxPrice) return false;
    if (parsed.data.category && product.category !== parsed.data.category) return false;
    return true;
  });

  return c.json({ products });
});

productRoute.get("/:id", async (c) => {
  if (!hasSupabaseConfig) return c.json({ error: "Supabase тохиргоо хийгдээгүй байна" }, 503);

  const { data, error } = await supabase.from("products").select("*").eq("id", c.req.param("id")).single();
  if (error) return c.json({ error: "Бараа олдсонгүй" }, 404);
  return c.json({ product: data });
});

export const categoriesRoute = new Hono();

categoriesRoute.get("/", async (c) => {
  if (!hasSupabaseConfig) return c.json({ categories: [] });

  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ categories: data ?? [] });
});
