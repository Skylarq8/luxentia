import Anthropic from "@anthropic-ai/sdk";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { z } from "zod";
import { hasSupabaseConfig, supabase } from "../lib/supabase";

const SYSTEM_PROMPT = `You are Luxentia's AI shopping assistant for a Mongolian online gift shop.
Rules:
1. Always respond in Mongolian unless user writes in English
2. Detect two modes:
   A) GIFT mode: user buying for someone else (ээжд, найздаа, etc.) → ask who + budget → recommend
   B) DIRECT mode: user buying for themselves (өөртөө, надад) or asking about specific product (байгаа юу, хайж байна) → search that product directly, do NOT ask gift questions
3. Extract budget in ₮. If none mentioned in direct mode, search without price limit
4. When recommending products output:
   <products>{"query": "search term in Mongolian or English", "maxPrice": 50000}</products>
5. In GIFT mode: ask recipient then budget if not provided, then recommend
6. In DIRECT mode: immediately search the product, skip gift Q&A
7. Be warm, concise, helpful`;

const bodySchema = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })),
  sessionId: z.string().optional(),
  userId: z.string().optional()
});

type ProductQuery = { query?: string; maxPrice?: number; category?: string };

function parseProductQueries(text: string): ProductQuery[] {
  return [...text.matchAll(/<products>(.*?)<\/products>/gs)]
    .map((match) => { try { return JSON.parse(match[1]) as ProductQuery; } catch { return null; } })
    .filter(Boolean) as ProductQuery[];
}

async function findProducts(queries: ProductQuery[]) {
  if (!hasSupabaseConfig) return [];
  const seen = new Set<string>();
  const results = [];
  for (const q of queries.slice(0, 3)) {
    const search = q.query ?? q.category ?? "gift";
    const { data } = await supabase.rpc("search_products", { search_term: search, max_results: 8 });
    for (const product of data ?? []) {
      if (q.maxPrice && product.price > q.maxPrice) continue;
      if (seen.has(product.id)) continue;
      seen.add(product.id);
      results.push(product);
    }
  }
  return results.slice(0, 6);
}

async function findProductsByPrice(maxPrice: number) {
  if (!hasSupabaseConfig) return [];
  const { data } = await supabase
    .from("products")
    .select("*")
    .lte("price", maxPrice)
    .order("created_at", { ascending: false })
    .limit(6);
  return data ?? [];
}

// --- Simple fallback when no ANTHROPIC_API_KEY ---

function parseBudget(text: string): number | null {
  const m =
    text.match(/(\d[\d,]+)\s*(?:₮|төгрөг)/i) ||
    text.match(/(\d+)к\b/i) ||
    text.match(/(\d+)\s*мянга/i);
  if (!m) return null;
  let n = parseInt(m[1].replace(/,/g, ""));
  if (/к\b/i.test(text.slice(m.index ?? 0, (m.index ?? 0) + 10))) n *= 1000;
  if (/мянга/i.test(text.slice(m.index ?? 0, (m.index ?? 0) + 15))) n *= 1000;
  return n > 0 ? n : null;
}

function parseRecipient(text: string): string | null {
  const t = text.toLowerCase();
  // Self-purchase
  if (/өөртөө|өөрт|надад|өөрийн|миний/.test(t)) return "өөртөө";
  if (/ээж|эжд|эжид|эждээ/.test(t)) return "ээжд";
  if (/аав|авдаа|аавдаа/.test(t)) return "аавд";
  if (/найз охин|girlfriend/.test(t)) return "найз охинд";
  if (/найз залуу|boyfriend/.test(t)) return "найз залуудаа";
  if (/найзд|найздаа/.test(t)) return "найздаа";
  if (/дүүд|дүүдээ/.test(t)) return "дүүд";
  if (/ахдаа|ахад/.test(t)) return "ахад";
  if (/багшид|багшдаа/.test(t)) return "багшид";
  if (/хүүхэд/.test(t)) return "хүүхэдд";
  return null;
}

// Extract specific product name from query
function parseDirectProduct(text: string): string | null {
  const t = text.toLowerCase();
  const terms: [RegExp, string][] = [
    [/гарийн тос|hand cream|handcream/, "гарийн тос"],
    [/нүүрний тос|face cream|нүүрний/, "нүүрний тос"],
    [/шампунь|shampoo/, "шампунь"],
    [/үнэртэн|perfume|atir/, "үнэртэн"],
    [/lip|уруулын/, "lip"],
    [/нойтон алчуур|wet wipe/, "нойтон алчуур"],
    [/маск|mask/, "маск"],
    [/serum|сэрум/, "serum"],
    [/ном|book/, "ном"],
    [/цай|tea/, "цай"],
    [/свич|switch|тоглоом|game/, "тоглоом"],
    [/утас|phone|smartphone/, "утас"],
    [/чихэвч|earphone|headphone/, "чихэвч"],
    [/цүнх|bag|purse/, "цүнх"],
    [/хувцас|clothes|shirt/, "хувцас"],
  ];
  for (const [re, label] of terms) {
    if (re.test(t)) return label;
  }
  return null;
}

function isDirectSearch(text: string): boolean {
  return /байгаа юу|байна уу|авах боломж|хайж байна|looking for|дэлгүүр/i.test(text);
}

function parseKeyword(text: string): string {
  const direct = parseDirectProduct(text);
  if (direct) return direct;
  const t = text.toLowerCase();
  if (/ном|уншдаг|book/.test(t)) return "book";
  if (/хувцас|fashion/.test(t)) return "clothing";
  if (/гоо сайхан|cosmet|makeup/.test(t)) return "cosmetics";
  if (/технологи|утас|phone|gadget/.test(t)) return "electronics";
  if (/цай|хоол|гал тогоо|candle/.test(t)) return "home";
  return "gift";
}

async function simpleFallback(
  messages: Array<{ role: string; content: string }>,
  stream: { writeSSE: (arg: { event: string; data: string }) => Promise<void> }
) {
  const userMsgs = messages.filter((m) => m.role === "user");
  const allText = userMsgs.map((m) => m.content).join(" ");
  const firstMsg = userMsgs[0]?.content ?? "";

  const budget = parseBudget(allText);
  const recipient = parseRecipient(allText);
  const directProduct = parseDirectProduct(allText);
  const keyword = parseKeyword(allText);
  const step = userMsgs.length;

  // Direct product search: user asking about specific item or buying for themselves
  const isSelf = recipient === "өөртөө";
  const isDirect = isDirectSearch(firstMsg) || (directProduct !== null && step === 1);

  let text = "";
  let products: unknown[] = [];

  if (isDirect || (isSelf && directProduct)) {
    // Direct search mode — no gift Q&A, just find the product
    const maxPrice = budget ?? 500000;
    products = await findProducts([{ query: directProduct ?? keyword, maxPrice }]);
    if (!products.length) products = await findProductsByPrice(maxPrice);
    text = products.length
      ? `"${directProduct ?? keyword}" хайлтад эдгээр бараанууд олдлоо:`
      : `Уучлаарай, "${directProduct ?? keyword}" одоогоор манай дэлгүүрт байхгүй байна.`;
  } else if (!recipient && step <= 2) {
    text = step === 1
      ? "Сайна уу! 🎁 Хэнд бэлэг авах гэж байна вэ?\n(Жишээ: ээждээ, найздаа, найз охинд, өөртөө...)"
      : "Хэнд зориулсан бэлэг вэ? Хүнийг мэдвэл илүү сайн санал болгоно.";
  } else if (!budget && step <= 2) {
    text = `${recipient ?? "Тэдэнд"} хэдэн ₮-н бэлэг авах гэж байна вэ?`;
  } else {
    const maxPrice = budget ?? 100000;
    const who = isSelf ? "Танд" : `${recipient ?? "танд"} зориулсан`;
    products = await findProducts([{ query: keyword, maxPrice }]);
    if (!products.length) products = await findProductsByPrice(maxPrice);
    text = products.length
      ? `${who} ${maxPrice.toLocaleString()}₮ дотор эдгээр бэлгүүдийг санал болгож байна:`
      : `Уучлаарай, ${maxPrice.toLocaleString()}₮ дотор одоогоор бараа бүртгэгдээгүй байна.`;
  }

  for (const char of text) {
    await stream.writeSSE({ event: "token", data: char });
    await new Promise((r) => setTimeout(r, 8));
  }
  await stream.writeSSE({ event: "done", data: JSON.stringify({ response: text, recommendedProducts: products }) });
}

// -------------------------------------------------

export const chatRoute = new Hono();

chatRoute.post("/", async (c) => {
  const parsed = bodySchema.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: "Чатын хүсэлт буруу байна" }, 400);

  const hasApiKey = !!process.env.ANTHROPIC_API_KEY;

  return streamSSE(c, async (stream) => {
    if (!hasApiKey) {
      await simpleFallback(parsed.data.messages, stream);
      return;
    }

    let response = "";
    try {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const aiStream = client.messages.stream({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: parsed.data.messages
      });

      for await (const event of aiStream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          response += event.delta.text;
          await stream.writeSSE({ event: "token", data: event.delta.text });
        }
      }

      const cleanResponse = response.replace(/<products>.*?<\/products>/gs, "").trim();
      const recommendedProducts = await findProducts(parseProductQueries(response));

      if (hasSupabaseConfig) {
        const assistantMsg = { role: "assistant" as const, content: cleanResponse, recommendedProducts, createdAt: new Date().toISOString() };
        const allMessages = [...parsed.data.messages, assistantMsg];
        if (parsed.data.sessionId) {
          await supabase.from("chat_sessions").update({ user_id: parsed.data.userId ?? null, messages: allMessages, context: { updatedAt: new Date().toISOString() } }).eq("id", parsed.data.sessionId);
        } else {
          await supabase.from("chat_sessions").insert({ user_id: parsed.data.userId ?? null, messages: allMessages, context: {} });
        }
      }

      await stream.writeSSE({ event: "done", data: JSON.stringify({ response: cleanResponse, recommendedProducts }) });
    } catch (error) {
      await stream.writeSSE({ event: "error", data: error instanceof Error ? error.message : "AI chat алдаа гарлаа" });
    }
  });
});
