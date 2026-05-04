"use client";

import type { ChatMessage, Product } from "@giftmind/db";
import { Button, Input } from "@giftmind/ui";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { ProductRecommendationCard } from "../../components/product-recommendation-card";
import { apiFetch } from "../../lib/api";

const suggestions = [
  {
    label: "Ээждээ гэрт нь дулаан мэдрэмж өгөх бэлэг",
    query: "mom home candle vase mug decor",
    category: "home-decor",
    maxPrice: 70000,
    answer: "Ээждээ гэрийг нь улам тухтай, тайван болгох бэлэг сонгоё. Үнэрт лаа, аяганы хос, ваар зэрэг өдөр бүр харагдаж, хэрэглэгдэх зүйлс хамгийн дулаахан мэдрэмж төрүүлдэг."
  },
  {
    label: "Аавдаа хэрэгтэй tech бэлэг 100,000₮ дотор",
    query: "dad practical tech earbuds power bank",
    category: "electronics",
    maxPrice: 100000,
    answer: "Аавдаа өдөр тутамдаа хэрэглэхэд амар, практик tech бэлэг сонгоё. Чихэвч, power bank зэрэг зүйлс гоё харагдахаас гадна үнэхээр хэрэг болдог."
  },
  {
    label: "Найздаа төрсөн өдрийн хөгжилтэй бэлэг",
    query: "friend birthday fun board game craft puzzle",
    category: "toys",
    maxPrice: 80000,
    answer: "Найзын төрсөн өдөрт хэт албаны биш, хамтдаа тоглож инээх эсвэл дурсамж үлдээх бэлэг илүү гоё таардаг. Эдгээр нь fun vibe-тай, үнэ нь ч боломжийн сонголтууд."
  },
  {
    label: "Найз охиндоо романтик гоо сайхны бэлэг",
    query: "girlfriend romantic perfume lipstick makeup",
    category: "cosmetics",
    maxPrice: 150000,
    answer: "Найз охиндоо сонгох бэлэг хувийн, гоёмсог, бага зэрэг романтик мэдрэмжтэй байвал хамгийн эвтэйхэн. Үнэртэн, уруулын сет, makeup хэрэгсэл зэрэг нь илүү thoughtful харагдана."
  },
];

type UiMessage = ChatMessage & { id: string };
type Phase = "empty" | "searching" | "results" | "chat";

function SearchingAnimation({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-end gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="size-4 rounded-full bg-amber-500"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
          />
        ))}
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-zinc-950 dark:text-slate-50">Хайж байна...</p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-slate-400">"{label}"</p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [phase, setPhase] = useState<Phase>("empty");
  const [activeLabel, setActiveLabel] = useState("");
  const [activeAnswer, setActiveAnswer] = useState("");
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  async function handleSuggestion(s: typeof suggestions[0]) {
    setActiveLabel(s.label);
    setActiveAnswer(s.answer);
    setMessages([]);
    setInput("");
    setPhase("searching");

    const [data] = await Promise.all([
      getSuggestionProducts(s),
      new Promise((r) => setTimeout(r, 3000))
    ]);

    const uniqueProducts = Array.from(
      new Map((data as { products: Product[] }).products.map((product) => [product.id, product])).values()
    );
    setSuggestedProducts(uniqueProducts.slice(0, 6));
    setPhase("results");
  }

  async function getSuggestionProducts(s: typeof suggestions[0]) {
    const searchResult = await apiFetch<{ products: Product[] }>("/api/products/search", {
      method: "POST",
      body: JSON.stringify({ query: s.query, category: s.category, maxPrice: s.maxPrice })
    }).catch(() => ({ products: [] as Product[] }));

    if (searchResult.products.length > 0) return searchResult;

    const params = new URLSearchParams({
      category: s.category,
      maxPrice: String(s.maxPrice)
    });

    return apiFetch<{ products: Product[] }>(`/api/products?${params.toString()}`)
      .catch(() => ({ products: [] as Product[] }));
  }

  function resetToEmpty() {
    setPhase("empty");
    setSuggestedProducts([]);
    setActiveLabel("");
    setActiveAnswer("");
    setMessages([]);
    setInput("");
  }

  function submitChat(value = input) {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return;

    const matched = suggestions.find((s) => s.label.toLowerCase() === normalized);
    if (matched) {
      void handleSuggestion(matched);
      return;
    }

    const userMsg: UiMessage = { id: crypto.randomUUID(), role: "user", content: value, createdAt: new Date().toISOString() };
    const assistantId = crypto.randomUUID();
    setSuggestedProducts([]);
    setActiveLabel("");
    setActiveAnswer("");
    setPhase("chat");
    setMessages([
      userMsg,
      {
        id: assistantId,
        role: "assistant",
        content: `Одоогоор Luxentia AI зөвхөн доорх ${suggestions.length} бэлгийн асуултад хариулна. Яг аль нэгийг нь сонгох эсвэл бүтнээр нь бичээрэй: ${suggestions.map((s) => `“${s.label}”`).join(", ")}.`,
        createdAt: new Date().toISOString()
      }
    ]);
    setInput("");
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);
  }

  return (
    <main className="flex h-[calc(100dvh-9rem)] min-h-0 flex-col bg-amber-50 text-zinc-950 dark:bg-[#0f0a03] dark:text-slate-50 sm:h-[calc(100vh-4rem)]">
      {/* Header */}
      <section className="shrink-0 border-b border-zinc-200 bg-white px-4 py-3 dark:border-[#3a2a0c] dark:bg-[#1a1205] sm:py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-lg bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-600 text-amber-950 shadow-sm shadow-amber-500/30">
              <Bot className="size-6" />
            </span>
            <div>
              <h1 className="font-black">Luxentia AI</h1>
              <p className="text-xs text-zinc-600 dark:text-slate-400 sm:text-sm">Төсөв, хүн, шалтгаанаа хэлээрэй.</p>
            </div>
          </div>
          {phase !== "empty" && (
            <button onClick={resetToEmpty} className="text-sm font-semibold text-amber-600 hover:underline dark:text-amber-400">
              Шинэ хайлт
            </button>
          )}
        </div>
      </section>

      {/* Body */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-5 sm:py-6">

          {/* EMPTY: suggestion cards */}
          <AnimatePresence>
            {phase === "empty" && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex min-h-[48dvh] flex-col items-center justify-center text-center sm:min-h-[60vh]">
                <Sparkles className="size-10 text-amber-600 dark:text-amber-300" />
                <h2 className="mt-3 text-2xl font-black sm:text-3xl">Ямар бэлэг хайж байна?</h2>
                <p className="mt-2 text-sm text-zinc-500 dark:text-slate-400">Одоогоор доорх бэлгийн санаануудаас сонгоно уу.</p>
                <div className="mt-8 grid w-full max-w-lg gap-3">
                  {suggestions.map((s, i) => (
                    <motion.button
                      key={s.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => handleSuggestion(s)}
                      className="rounded-xl border border-zinc-200 bg-white p-4 text-left font-semibold shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md dark:border-[#3a2a0c] dark:bg-[#1a1205] dark:hover:border-amber-500/40"
                    >
                      {s.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SEARCHING: bounce animation */}
          <AnimatePresence>
            {phase === "searching" && (
              <motion.div key="searching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex min-h-[48dvh] items-center justify-center sm:min-h-[60vh]">
                <SearchingAnimation label={activeLabel} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* RESULTS: staggered product cards */}
          <AnimatePresence>
            {phase === "results" && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="mb-6 font-bold text-zinc-950 dark:text-slate-50">
                  "{activeLabel}" — {suggestedProducts.length} бараа олдлоо
                </p>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-6 text-zinc-700 shadow-sm dark:border-[#3a2a0c] dark:bg-[#1a1205] dark:text-slate-200"
                >
                  {activeAnswer}
                </motion.div>
                <div className="grid gap-4">
                  {suggestedProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15, duration: 0.4, ease: "easeOut" }}
                    >
                      <ProductRecommendationCard product={product} />
                    </motion.div>
                  ))}
                </div>
                {suggestedProducts.length === 0 && (
                  <p className="text-center text-zinc-500 dark:text-slate-400">Тохирох бараа олдсонгүй.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* CHAT: messages */}
          {phase === "chat" && (
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={message.role === "user" ? "ml-auto max-w-[85%]" : "mr-auto max-w-[92%]"}
                  >
                    <div className={message.role === "user" ? "rounded-xl bg-amber-500 px-4 py-3 text-white" : "rounded-xl bg-white px-4 py-3 shadow-sm dark:bg-[#1a1205]"}>
                      {message.content}
                    </div>
                    {message.recommendedProducts?.length ? (
                      <div className="mt-3 grid gap-3">
                        {message.recommendedProducts.map((product, i) => (
                          <motion.div key={product.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}>
                            <ProductRecommendationCard product={product} />
                          </motion.div>
                        ))}
                      </div>
                    ) : null}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-zinc-200 bg-amber-50 px-4 py-3 dark:border-[#3a2a0c] dark:bg-[#0f0a03] sm:py-4">
        <form
            className="mx-auto flex max-w-4xl gap-2"
            onSubmit={(e) => { e.preventDefault(); submitChat(); }}
        >
          <Input
            className="dark:border-[#3a2a0c] dark:bg-[#241807] dark:text-slate-50"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Дээрх асуултуудаас яг нэгийг бичнэ үү..."
          />
          <Button size="icon" aria-label="Send">
            <Send className="size-5" />
          </Button>
        </form>
      </div>
    </main>
  );
}
