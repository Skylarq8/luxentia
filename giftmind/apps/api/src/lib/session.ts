import type { Context, Next } from "hono";
import type { User } from "@giftmind/db";
import { supabase } from "./supabase";

type UserContext = Context<{ Variables: { user: User } }>;

const encoder = new TextEncoder();

function base64url(input: string | ArrayBuffer) {
  const bytes = typeof input === "string" ? encoder.encode(input) : new Uint8Array(input);
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

async function sign(value: string) {
  const secret = process.env.ADMIN_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY ?? "dev-secret";
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign"
  ]);
  return base64url(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

export async function createSession(userId: string) {
  const payload = base64url(
    JSON.stringify({
      sub: userId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30
    })
  );
  const signature = await sign(payload);
  return {
    access_token: `${payload}.${signature}`,
    token_type: "bearer",
    expires_in: 60 * 60 * 24 * 30
  };
}

export async function readSession(token?: string) {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature || (await sign(payload)) !== signature) return null;

  const data = JSON.parse(atob(payload.replaceAll("-", "+").replaceAll("_", "/"))) as {
    sub: string;
    exp: number;
  };
  if (data.exp < Math.floor(Date.now() / 1000)) return null;

  const { data: user } = await supabase.from("users").select("*").eq("id", data.sub).single();
  return user ?? null;
}

export async function requireUser(c: UserContext, next: Next) {
  const token = c.req.header("authorization")?.replace(/^Bearer\s+/i, "");
  const user = await readSession(token);
  if (!user) return c.json({ error: "Нэвтрэх шаардлагатай" }, 401);
  c.set("user", user as User);
  await next();
}

export async function requireAdmin(c: UserContext, next: Next) {
  const token = c.req.header("authorization")?.replace(/^Bearer\s+/i, "");
  const user = await readSession(token);
  if (!user || user.role !== "admin") return c.json({ error: "Админ эрх шаардлагатай" }, 403);
  c.set("user", user as User);
  await next();
}
