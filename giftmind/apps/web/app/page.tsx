"use client";

import type { Category, Product } from "@giftmind/db";
import { Button, formatMnt } from "@giftmind/ui";
import { motion } from "framer-motion";
import { ArrowDown, Bot, Gift, Mic, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import FloatingLines from "../components/FloatingLines";
import { getCategories, getProducts } from "../lib/api";
import { sampleCategories, sampleProducts } from "../lib/sample-data";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [products, setProducts] = useState<Product[]>(sampleProducts);

  useEffect(() => {
    getCategories().then((data) => setCategories(data.categories)).catch(() => undefined);
    getProducts("?maxPrice=150000").then((data) => setProducts(data.products.slice(0, 8))).catch(() => undefined);
  }, []);

  return (
    <main className="bg-white text-zinc-950 dark:bg-[#050914] dark:text-slate-50">
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#f7f8fb] dark:bg-[#050914]">
        <div className="absolute inset-0 opacity-35 dark:opacity-32">
          <FloatingLines
            linesGradient={["#2563eb", "#06b6d4", "#8b5cf6"]}
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(6,182,212,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(247,248,251,0.92)_48%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_20%_10%,rgba(30,64,175,0.18),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(14,116,144,0.12),transparent_30%),linear-gradient(180deg,rgba(5,9,20,0.82),rgba(8,17,31,0.96)_52%,#050914_100%)]" />
        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-4 py-12 lg:grid-cols-[1.02fr_0.98fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-3 py-1.5 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur dark:border-blue-500/25 dark:bg-[#08111f]/85 dark:text-blue-200">
              <Sparkles className="size-4" />
              ҮНЭГҮЙ ЭХЛЭХ — AI бэлгийн зөвлөх
            </p>
            <h1 className="text-5xl font-black leading-[1.03] tracking-tight text-zinc-950 dark:text-white sm:text-7xl">
              Хайртай хүндээ төгс бэлэг ол
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              Хэнд зориулж, хэдэн төгрөгийн төсөвтэйгээ хэлэхэд Luxentia AI тохирох бэлгийг шууд санал болгоно.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/chat">
                <Button size="lg" className="bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700">
                  <Bot className="size-5" />
                  Үнэгүй эхлэх
                </Button>
              </Link>
              <a href="#featured">
                <Button size="lg" variant="outline" className="border-zinc-300 bg-white text-zinc-950 hover:bg-zinc-50 dark:border-blue-500/25 dark:bg-[#08111f] dark:text-slate-50 dark:hover:bg-[#0d1a2e]">
                  <ArrowDown className="size-5" />
                  Бэлгүүд үзэх
                </Button>
              </a>
            </div>
            <p className="mt-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">Бүртгүүлэхэд 30 секунд л хангалттай</p>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 pt-6">
              {[
                ["50+", "Бэлгийн санаа"],
                ["7", "Ангилал"],
                ["AI", "Зөвлөх"]
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="text-2xl font-black text-zinc-950 dark:text-white">{value}</p>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.08 }}
            className="relative block"
          >
            <div className="absolute -inset-6 rounded-[2rem] bg-blue-600/10 blur-3xl dark:bg-blue-900/18" />
            <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10 dark:border-[#17233a] dark:bg-[#08111f] dark:shadow-blue-950/20">
              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-[#17233a]">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-2xl bg-blue-600 text-white">
                    <Gift className="size-5" />
                  </span>
                  <div>
                    <p className="font-black text-zinc-950 dark:text-slate-50">Luxentia AI</p>
                    <p className="text-sm text-zinc-500 dark:text-slate-400">Бэлэг хайж байна...</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">online</span>
              </div>

              <div className="space-y-4 p-5">
                <div className="ml-auto max-w-xs rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-3 text-sm font-medium text-white">
                  Ээждээ 50,000₮ дотор дулаахан бэлэг авмаар байна.
                </div>
                <div className="max-w-sm rounded-2xl rounded-tl-sm bg-zinc-100 px-4 py-3 text-sm text-zinc-700 dark:bg-[#0c1628] dark:text-slate-200">
                  Ээж тань гэртээ тухтай байх дуртай бол эдгээр сонголт яг тохирно.
                </div>

                <div className="grid gap-3">
                  {[
                    ["Soy Candle Amber", "39,000₮", "home"],
                    ["Premium Tea Ceremony Set", "68,000₮", "tea"],
                    ["Mongolian Poetry Collection", "37,000₮", "book"]
                  ].map(([name, price, type]) => (
                    <div key={name} className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-white p-3 shadow-sm dark:border-[#17233a] dark:bg-[#0c1628]">
                      <span className="grid size-12 place-items-center rounded-2xl bg-zinc-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                        {type === "tea" ? <Mic className="size-5" /> : type === "book" ? <Wand2 className="size-5" /> : <Gift className="size-5" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-zinc-950 dark:text-slate-50">{name}</p>
                        <p className="text-sm text-zinc-500 dark:text-slate-400">{price}</p>
                      </div>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">Санал</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white py-12 dark:border-[#17233a] dark:bg-[#08111f]">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-zinc-950 dark:text-slate-50">Ангилал</h2>
            {/* <Link className="text-sm font-bold text-blue-600 dark:text-blue-300" href="/shop">Бүгдийг харах</Link> */}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {categories.map((category, index) => (
              <motion.div key={category.slug} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} viewport={{ once: true }}>
                <Link href={`/shop?category=${category.slug}`} className="group block overflow-hidden rounded-lg">
                  <img src={category.image_url ?? ""} alt={category.name} className="h-36 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-44" />
                  <div className="-mt-16 p-4">
                    <span className="relative rounded-lg bg-white/90 px-3 py-2 font-bold text-zinc-950 shadow-sm backdrop-blur dark:bg-[#08111f]/90 dark:text-slate-50">
                      {category.name}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="featured" className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-zinc-950 dark:text-slate-50">Онцлох бэлгүүд</h2>
          <Link className="text-sm font-bold text-blue-600 dark:text-blue-300" href="/shop">Бүгдийг үзэх</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <motion.div key={product.id} whileHover={{ y: -6 }} className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-[#17233a] dark:bg-[#08111f]">
              <img src={product.images[0]} alt={product.name} className="h-40 w-full object-cover sm:h-56" />
              <div className="p-3 sm:p-4">
                <p className="text-sm font-bold text-zinc-950 dark:text-slate-50 sm:text-base">{product.name}</p>
                <p className="mt-1 text-sm font-black text-blue-600 dark:text-blue-300">{formatMnt(product.price)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
