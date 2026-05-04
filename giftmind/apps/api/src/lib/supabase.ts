import { createClient } from "@supabase/supabase-js";
import type { Database } from "@giftmind/db";

export const hasSupabaseConfig = Boolean(
  (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
);

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321";
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "dev-anon-key";

export const supabase = createClient<Database>(url, key, {
  auth: { persistSession: false }
});
