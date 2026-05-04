import { Hono } from "hono";
import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import type { User } from "@giftmind/db";
import { createSession } from "../lib/session";
import { hasSupabaseConfig, supabase } from "../lib/supabase";

const phoneSchema = z.object({ phone: z.string().min(8) });
const loginSchema = phoneSchema.extend({ password: z.string().min(1) });
const registerSchema = phoneSchema.extend({
  name: z.string().min(2).max(80),
  password: z.string().min(8)
});

function normalizePhone(phone: string) {
  return phone.replace(/\s/g, "");
}

function isStrongPassword(password: string) {
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function hashPassword(password: string) {
  const iterations = 120000;
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("hex");
  return `pbkdf2$${iterations}$${salt}$${hash}`;
}

function verifyPassword(password: string, encoded: string | null) {
  if (!encoded) return false;

  const [method, iterationText, salt, expectedHash] = encoded.split("$");
  if (method !== "pbkdf2" || !iterationText || !salt || !expectedHash) return false;

  const iterations = Number(iterationText);
  const actual = pbkdf2Sync(password, salt, iterations, 32, "sha256");
  const expected = Buffer.from(expectedHash, "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function publicUser(user: User) {
  const { password_hash, ...rest } = user;
  return rest;
}

async function getAuthUser(phone: string) {
  const { data, error } = await supabase.rpc("get_user_by_phone_for_auth", {
    input_phone: phone
  });

  if (error) throw error;
  return data?.[0] ?? null;
}

export const authRoute = new Hono();

authRoute.get("/me", async (c) => {
  const token = c.req.header("authorization")?.replace(/^Bearer\s+/i, "");
  const { readSession } = await import("../lib/session");
  const user = await readSession(token);
  if (!user) return c.json({ error: "Нэвтрэх шаардлагатай" }, 401);
  return c.json({ user: publicUser(user as User) });
});

authRoute.post("/register", async (c) => {
  if (!hasSupabaseConfig) return c.json({ error: "Supabase тохиргоо хийгдээгүй байна" }, 503);

  const parsed = registerSchema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: "Бүртгэлийн мэдээлэл буруу байна" }, 400);

  const phone = normalizePhone(parsed.data.phone);
  if (!isStrongPassword(parsed.data.password)) {
    return c.json({ error: "Нууц үг хангалттай хүчтэй биш байна" }, 400);
  }

  const existing = await getAuthUser(phone);
  if (existing) return c.json({ error: "Энэ утасны дугаараар бүртгэлтэй байна" }, 409);

  const { data: user, error } = await supabase.rpc("create_password_user", {
    input_phone: phone,
    input_name: parsed.data.name.trim(),
    input_password_hash: hashPassword(parsed.data.password)
  });

  if (error || !user) return c.json({ error: error?.message ?? "Хэрэглэгч үүсгэж чадсангүй" }, 500);

  return c.json({
    user: publicUser(user),
    session: await createSession(user.id),
    isNewUser: true
  });
});

authRoute.post("/login", async (c) => {
  if (!hasSupabaseConfig) return c.json({ error: "Supabase тохиргоо хийгдээгүй байна" }, 503);

  const parsed = loginSchema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: "Нэвтрэх мэдээлэл буруу байна" }, 400);

  const user = await getAuthUser(normalizePhone(parsed.data.phone));
  if (!user || !verifyPassword(parsed.data.password, user.password_hash)) {
    return c.json({ error: "Утас эсвэл нууц үг буруу байна" }, 401);
  }

  return c.json({
    user: publicUser(user),
    session: await createSession(user.id),
    isNewUser: false
  });
});
