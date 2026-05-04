"use client";

import type { ChatMessage, Product } from "@giftmind/db";
import { Button, Input } from "@giftmind/ui";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { ProductRecommendationCard } from "../../components/product-recommendation-card";
import { API_URL, apiFetch } from "../../lib/api";

const suggestions = [
  { label: "Эжд бэлэг авья 50,000₮", query: "gift mom", maxPrice: 50000 },
  { label: "Найздаа төрсөн өдрийн бэлэг", query: "birthday gift friend", maxPrice: 100000 },
  { label: "Охин найздаа гайхамшигтай бэлэг", query: "gift girlfriend romantic", maxPrice: 150000 }
];

type UiMessage = ChatMessage & { id: string };
type Phase = "empty" | "searching" | "results" | "chat";

function parseSse(buffer: string) {
  return buffer
    .split("\n\n")
    .map((chunk) => {
      const event = chunk.match(/^event:\s*(.*)$/m)?.[1];
      const data = chunk.match(/^data:\s*([\s\S]*)$/m)?.[1];
      return event && data ? { event, data } : null;
    })
    .filter(Boolean) as Array<{ event: string; data: string }>;
}

function SearchingAnimation({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-end gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="size-4 rounded-full bg-blue-600"
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
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function handleSuggestion(s: typeof suggestions[0]) {
    setActiveLabel(s.label);
    setPhase("searching");

    const [data] = await Promise.all([
      apiFetch<{ products: Product[] }>("/api/products/search", {
        method: "POST",
        body: JSON.stringify({ query: s.query, maxPrice: s.maxPrice })
      }).catch(() => ({ products: [] as Product[] })),
      new Promise((r) => setTimeout(r, 3000))
    ]);

    setSuggestedProducts((data as { products: Product[] }).products.slice(0, 6));
    setPhase("results");
  }

  function resetToEmpty() {
    setPhase("empty");
    setSuggestedProducts([]);
    setActiveLabel("");
    setMessages([]);
  }

  async function submitChat(value = input) {
    if (!value.trim() || chatLoading) return;

    if (phase !== "chat") {
      setPhase("chat");
      setSuggestedProducts([]);
    }

    const userMsg: UiMessage = { id: crypto.randomUUID(), role: "user", content: value, createdAt: new Date().toISOString() };
    const assistantId = crypto.randomUUID();
    const nextMessages = [...messages, userMsg];

    setMessages([...nextMessages, { id: assistantId, role: "assistant", content: "", createdAt: new Date().toISOString() }]);
    setInput("");
    setChatLoading(true);

    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.map(({ role, content }) => ({ role, content })) })
      });

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let pending = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        pending += decoder.decode(value, { stream: true });

        for (const item of parseSse(pending)) {
          if (item.event === "token") {
            setMessages((cur) => cur.map((m) => (m.id === assistantId ? { ...m, content: m.content + item.data } : m)));
            scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
          }
          if (item.event === "done") {
            const done = JSON.parse(item.data) as { response: string; recommendedProducts: Product[] };
            setMessages((cur) => cur.map((m) => (m.id === assistantId ? { ...m, content: done.response, recommendedProducts: done.recommendedProducts } : m)));
          }
        }

        if (pending.includes("\n\n")) pending = pending.slice(pending.lastIndexOf("\n\n") + 2);
      }
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <main className="flex h-[calc(100vh-4rem)] flex-col bg-zinc-50 text-zinc-950 dark:bg-[#050914] dark:text-slate-50">
      {/* Header */}
      <section className="border-b border-zinc-200 bg-white px-4 py-4 dark:border-[#17233a] dark:bg-[#08111f]">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-lg bg-blue-600 text-white">
              <Bot className="size-6" />
            </span>
            <div>
              <h1 className="font-black">Luxentia AI</h1>
              <p className="text-sm text-zinc-600 dark:text-slate-400">Төсөв, хүн, шалтгаанаа хэлээрэй.</p>
            </div>
          </div>
          {phase !== "empty" && (
            <button onClick={resetToEmpty} className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">
              Шинэ хайлт
            </button>
          )}
        </div>
      </section>

      {/* Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-6">

          {/* EMPTY: suggestion cards */}
          <AnimatePresence>
            {phase === "empty" && (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <Sparkles className="size-10 text-blue-600 dark:text-blue-300" />
                <h2 className="mt-3 text-3xl font-black">Ямар бэлэг хайж байна?</h2>
                <p className="mt-2 text-sm text-zinc-500 dark:text-slate-400">Доорх саналаас сонгоно уу эсвэл өөрийн хүсэлтийг бичнэ үү</p>
                <div className="mt-8 grid w-full max-w-lg gap-3">
                  {suggestions.map((s, i) => (
                    <motion.button
                      key={s.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => handleSuggestion(s)}
                      className="rounded-xl border border-zinc-200 bg-white p-4 text-left font-semibold shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-[#17233a] dark:bg-[#08111f] dark:hover:border-blue-500/40"
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
              <motion.div key="searching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex min-h-[60vh] items-center justify-center">
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
                    <div className={message.role === "user" ? "rounded-xl bg-blue-600 px-4 py-3 text-white" : "rounded-xl bg-white px-4 py-3 shadow-sm dark:bg-[#08111f]"}>
                      {message.content || (chatLoading && message.role === "assistant" ? (
                        <div className="flex items-end gap-1 py-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div key={i} className="size-2 rounded-full bg-blue-400" animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                          ))}
                        </div>
                      ) : null)}
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
      <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-4 dark:border-[#17233a] dark:bg-[#050914]">
        <form
          className="mx-auto flex max-w-4xl gap-2"
          onSubmit={(e) => { e.preventDefault(); submitChat(); }}
        >
          <Input
            className="dark:border-[#17233a] dark:bg-[#0c1628] dark:text-slate-50"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="50,000₮ төсөвтэй, эждээ..."
          />
          <Button size="icon" aria-label="Send" disabled={chatLoading}>
            <Send className="size-5" />
          </Button>
        </form>
      </div>
    </main>
  );
}
