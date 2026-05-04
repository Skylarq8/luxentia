"use client";

import type { Category, Product } from "@giftmind/db";
import { Button, formatMnt } from "@giftmind/ui";
import { motion } from "framer-motion";
import { ArrowDown, Bot, Gift, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import FloatingLines from "../components/FloatingLines";
import { getCategories, getProducts } from "../lib/api";
import { sampleCategories, sampleProducts } from "../lib/sample-data";

const categoryLabels: Record<string, string> = {
  electronics: "Технологи",
  clothing: "Хувцас, аксессуар",
  cosmetics: "Гоо сайхан",
  food: "Амттан, хүнс",
  "home-decor": "Гэрийн декор",
  books: "Ном, бичиг хэрэг",
  toys: "Тоглоом",
  jewelry: "Үнэт эдлэл"
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    getCategories().then((data) => setCategories(data.categories)).catch(() => undefined);
    getProducts("?maxPrice=150000")
      .then((data) => setProducts(data.products.slice(0, 8)))
      .catch(() => setProducts(sampleProducts.slice(0, 8)))
      .finally(() => setProductsLoading(false));
  }, []);

  return (
    <main className="overflow-x-hidden bg-white text-zinc-950 dark:bg-[#0f0a03] dark:text-slate-50">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#fffbeb] dark:bg-[#0f0a03]">
        <div className="absolute inset-0 opacity-35 dark:opacity-32">
          <FloatingLines
            linesGradient={["#f59e0b", "#facc15", "#d97706"]}
            enabledWaves={["top", "middle", "bottom"]}
            lineCount={[5, 8, 5]}
            lineDistance={[9, 7, 9]}
            topWavePosition={{ x: 7, y: 0.85, rotate: -0.35 }}
            middleWavePosition={{ x: 3, y: 0.15, rotate: 0.15 }}
            bottomWavePosition={{ x: 1.8, y: -0.75, rotate: 0.3 }}
            animationSpeed={0.55}
            interactive
            parallax
            mixBlendMode="screen"
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(245,158,11,0.18),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(250,204,21,0.16),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,251,235,0.9)_48%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_20%_10%,rgba(180,83,9,0.26),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(202,138,4,0.16),transparent_30%),linear-gradient(180deg,rgba(18,12,4,0.86),rgba(28,20,8,0.96)_52%,#0f0a03_100%)]" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-6 px-4 py-8 sm:gap-10 sm:py-12 lg:min-h-[calc(100vh-4rem)] lg:grid-cols-[1.02fr_0.98fr] lg:py-16">

          {/* Left: text */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-amber-800 shadow-sm backdrop-blur dark:border-amber-500/25 dark:bg-[#1a1205]/85 dark:text-amber-200 sm:mb-5 sm:text-sm">
              <Sparkles className="size-3.5 sm:size-4" />
              Luxentia AI бэлгийн зөвлөх
            </p>
            <h1 className="text-[1.75rem] font-black leading-[1.12] tracking-tight text-zinc-950 dark:text-white sm:text-5xl lg:text-7xl lg:leading-[1.03]">
              Өөртөө болон хайртай хүмүүстээ зөв сонголт хий
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300 sm:mt-5 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
              Хэнд өгөх, ямар мэдрэмж төрүүлэх, хэдэн төгрөгийн төсөвтэйгээ хэлэхэд Luxentia танд тохирох санаа, барааг цэгцтэй санал болгоно.
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-7 sm:gap-3">
              <Link href="/chat">
                <Button size="lg" className="h-10 bg-amber-500 px-4 text-sm text-white shadow-lg shadow-amber-500/25 hover:bg-amber-600 sm:h-11 sm:px-5 sm:text-base">
                  <Bot className="size-4 sm:size-5" />
                  AI-аар бэлэг сонгох
                </Button>
              </Link>
              <a href="#featured">
                <Button size="lg" variant="outline" className="h-10 border-zinc-300 bg-white px-4 text-sm text-zinc-950 hover:bg-amber-50 dark:border-amber-500/25 dark:bg-[#1a1205] dark:text-slate-50 dark:hover:bg-[#2f2109] sm:h-11 sm:px-5 sm:text-base">
                  <ArrowDown className="size-4 sm:size-5" />
                  Онцлох бэлэг үзэх
                </Button>
              </a>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-zinc-100 pt-5 dark:border-[#3a2a0c] sm:mt-8 sm:gap-4 sm:pt-6">
              {[
                ["50+", "Сонголт"],
                ["7", "Бэлгийн төрөл"],
                ["AI", "Туслах зөвлөх"]
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="text-xl font-black text-zinc-950 dark:text-white sm:text-2xl">{value}</p>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 sm:mt-1 sm:text-sm">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: AI chat preview */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.08 }}
            className="relative w-full"
          >
            <div className="absolute -inset-3 rounded-[2rem] bg-amber-500/10 blur-3xl dark:bg-amber-900/18 lg:-inset-6" />
            <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-zinc-900/10 dark:border-[#3a2a0c] dark:bg-[#1a1205] dark:shadow-amber-950/20 sm:rounded-3xl sm:shadow-2xl">

              {/* Card header */}
              <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-[#3a2a0c] sm:px-5 sm:py-4">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-600 text-amber-950 shadow-sm shadow-amber-500/30 sm:size-10 sm:rounded-2xl">
                    <Gift className="size-4 sm:size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-black text-zinc-950 dark:text-slate-50 sm:text-base">Luxentia AI</p>
                    <p className="text-xs text-zinc-500 dark:text-slate-400">Танд тохирох санаа хайж байна</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">online</span>
              </div>

              {/* Chat messages */}
              <div className="space-y-3 p-4 sm:space-y-4 sm:p-5">
                <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-amber-500 px-3 py-2.5 text-xs font-medium text-white sm:px-4 sm:py-3 sm:text-sm">
                  Ээждээ гэрт нь дулаан мэдрэмж өгөх бэлэг хайж байна.
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-amber-100 px-3 py-2.5 text-xs text-zinc-700 dark:bg-[#241807] dark:text-slate-200 sm:px-4 sm:py-3 sm:text-sm">
                  Тэгвэл тухтай орчин, тайван үнэр, өдөр бүр хэрэглэгдэх жижиг зүйлс хамгийн сайхан тохирно.
                </div>

                {/* Product suggestions */}
                <div className="grid gap-2 sm:gap-3">
                  {[
                    ["Амбер үнэрт лаа", "39,000₮"],
                    ["Дээд зэрэглэлийн цайны багц", "68,000₮"],
                    ["Монгол яруу найргийн түүвэр", "37,000₮"]
                  ].map(([name, price]) => (
                    <div key={name} className="flex items-center gap-2.5 rounded-xl border border-zinc-100 bg-white p-2.5 shadow-sm dark:border-[#3a2a0c] dark:bg-[#241807] sm:gap-3 sm:rounded-2xl sm:p-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300 sm:size-12 sm:rounded-2xl">
                        <Gift className="size-4 sm:size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-zinc-950 dark:text-slate-50 sm:text-sm">{name}</p>
                        <p className="text-xs text-zinc-500 dark:text-slate-400">{price}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-amber-50 px-2 py-1 text-xs font-bold text-amber-800 dark:bg-amber-400/10 dark:text-amber-300 sm:px-3">Тохирно</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="border-y border-zinc-200 bg-white py-8 dark:border-[#3a2a0c] dark:bg-[#1a1205] sm:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-lg font-black text-zinc-950 dark:text-slate-50 sm:text-2xl">Бэлгээ төрлөөр нь сонгох</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4 lg:grid-cols-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Link href={`/shop?category=${category.slug}`} className="group block overflow-hidden rounded-xl sm:rounded-2xl">
                  <div className="relative">
                    <img
                      src={category.image_url ?? ""}
                      alt={category.name}
                      className="h-32 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-44"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 sm:p-4">
                      <span className="text-xs font-bold text-white sm:text-sm">
                        {categoryLabels[category.slug] ?? category.name}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured products ── */}
      <section id="featured" className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-zinc-950 dark:text-slate-50 sm:text-2xl">Өнөөдөр санал болгох бэлгүүд</h2>
          <Link className="text-xs font-bold text-amber-600 dark:text-amber-300 sm:text-sm" href="/shop">Бүгдийг үзэх</Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {productsLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-[#3a2a0c] dark:bg-[#1a1205] sm:rounded-2xl">
                  <div className="h-36 w-full animate-pulse bg-zinc-200 dark:bg-zinc-800 sm:h-52" />
                  <div className="p-2.5 sm:p-4">
                    <div className="h-3 w-full animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    <div className="mt-1.5 h-3 w-2/3 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    <div className="mt-2.5 h-3 w-1/3 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                </div>
              ))
            : products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-[#3a2a0c] dark:bg-[#1a1205] sm:rounded-2xl"
                >
                  <Link href={`/shop/${product.id}`}>
                    <img src={product.images[0]} alt={product.name} className="h-36 w-full object-cover transition duration-300 hover:scale-105 sm:h-52" />
                  </Link>
                  <div className="p-2.5 sm:p-4">
                    <Link href={`/shop/${product.id}`}>
                      <p className="line-clamp-2 text-xs font-bold leading-snug text-zinc-950 hover:text-amber-600 dark:text-slate-50 dark:hover:text-amber-300 sm:text-sm">{product.name}</p>
                    </Link>
                    <p className="mt-1 text-xs font-black text-amber-600 dark:text-amber-300 sm:text-sm">{formatMnt(product.price)}</p>
                  </div>
                </motion.div>
              ))}
        </div>
      </section>
    </main>
  );
}
