"use client";

import type { Category, Product } from "@giftmind/db";
import { Button, Input } from "@giftmind/ui";
import { Check, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "../../components/product-card";
import { getCategories, getProducts } from "../../lib/api";
import { sampleCategories, sampleProducts } from "../../lib/sample-data";

const categoryLabels: Record<string, string> = {
  electronics: "Технологи",
  clothing: "Хувцас",
  cosmetics: "Гоо сайхан",
  food: "Амттан",
  "home-decor": "Гэрийн декор",
  books: "Ном",
  toys: "Тоглоом",
  jewelry: "Үнэт эдлэл"
};

const pricePresets = [
  { label: "50k хүртэл", value: "50000" },
  { label: "100k хүртэл", value: "100000" },
  { label: "150k хүртэл", value: "150000" },
  { label: "Бүгд", value: "250000" }
];

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-[#3a2a0c] dark:bg-[#1a1205]">
      <div className="h-36 w-full animate-pulse bg-zinc-200 dark:bg-zinc-800 sm:h-48 lg:h-52" />
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="space-y-2">
          <div className="h-3.5 w-full animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="mt-2 space-y-1.5">
          <div className="h-3 w-full animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-4/5 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="h-4 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-8 w-16 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("250000");
  const [sort, setSort] = useState("recommended");
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const query = useMemo(() => {
    const next = new URLSearchParams();
    if (search) next.set("search", search);
    if (category) next.set("category", category);
    if (maxPrice) next.set("maxPrice", maxPrice);
    return `?${next.toString()}`;
  }, [search, category, maxPrice]);

  const visibleProducts = useMemo(() => {
    const next = [...products];
    if (sort === "price-asc") return next.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return next.sort((a, b) => b.price - a.price);
    if (sort === "name") return next.sort((a, b) => a.name.localeCompare(b.name));
    return next;
  }, [products, sort]);

  const activeFilterCount = [search, category, maxPrice !== "250000" ? maxPrice : ""].filter(Boolean).length;

  useEffect(() => {
    setCategory(new URLSearchParams(window.location.search).get("category") ?? "");
    getCategories().then((data) => setCategories(data.categories)).catch(() => undefined);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setLoading(true);
      getProducts(query)
        .then((data) => setProducts(data.products))
        .catch(() => setProducts(sampleProducts))
        .finally(() => {
          setLoading(false);
          setInitialLoading(false);
        });
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [query]);

  function clearFilters() {
    setSearch("");
    setCategory("");
    setMaxPrice("250000");
    setSort("recommended");
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-amber-50 px-4 py-6 text-zinc-950 dark:bg-[#0f0a03] dark:text-slate-50 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold text-amber-600 dark:text-amber-300">Luxentia shop</p>
            <h1 className="mt-1 text-3xl font-black sm:text-4xl">Бараанууд</h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-slate-400">
              Өөртөө болон бэлэгт тохирох сонголтоо шүүлтүүрээр хурдан олоорой.
            </p>
          </div>
          <Button
            variant="outline"
            className="justify-between border-zinc-200 bg-white text-zinc-950 dark:border-[#3a2a0c] dark:bg-[#1a1205] dark:text-slate-50 lg:hidden"
            onClick={() => setFilterOpen((value) => !value)}
          >
            <span className="inline-flex items-center gap-2">
              <SlidersHorizontal className="size-5" />
              Шүүлтүүр
            </span>
            {activeFilterCount > 0 ? (
              <span className="grid size-6 place-items-center rounded-full bg-amber-500 text-xs text-white">{activeFilterCount}</span>
            ) : null}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <aside className={`${filterOpen ? "block" : "hidden"} h-fit rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-[#3a2a0c] dark:bg-[#1a1205] lg:sticky lg:top-24 lg:block`}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-black">
                <SlidersHorizontal className="size-5 text-amber-600 dark:text-amber-300" />
                Шүүлтүүр
              </div>
              <button
                className="grid size-9 place-items-center rounded-lg text-zinc-500 hover:bg-amber-100 dark:text-slate-400 dark:hover:bg-[#241807] lg:hidden"
                onClick={() => setFilterOpen(false)}
                aria-label="Close filters"
              >
                <X className="size-5" />
              </button>
            </div>

            <label className="mt-5 block text-sm font-semibold">Хайх</label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-3 size-5 text-zinc-400" />
              <Input
                className="pl-10 dark:border-[#3a2a0c] dark:bg-[#241807] dark:text-slate-50"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="утасны гэр, үнэртэн..."
              />
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">Ангилал</label>
                {category ? (
                  <button className="text-xs font-bold text-amber-600 dark:text-amber-300" onClick={() => setCategory("")}>
                    Бүгд
                  </button>
                ) : null}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-1">
                {categories.map((item) => {
                  const active = category === item.slug;
                  return (
                    <button
                      key={item.slug}
                      className={`flex min-h-10 items-center justify-between rounded-lg border px-3 text-left text-sm font-semibold transition ${
                        active
                          ? "border-amber-500 bg-amber-50 text-amber-800 dark:border-amber-400 dark:bg-amber-500/10 dark:text-amber-200"
                          : "border-zinc-200 bg-white text-zinc-700 hover:border-amber-200 hover:bg-amber-50 dark:border-[#3a2a0c] dark:bg-[#241807] dark:text-slate-300 dark:hover:border-amber-500/30"
                      }`}
                      onClick={() => setCategory(active ? "" : item.slug)}
                    >
                      <span className="truncate">{categoryLabels[item.slug] ?? item.name}</span>
                      {active ? <Check className="size-4 shrink-0" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-sm font-semibold">Дээд үнэ</label>
              <p className="mt-1 text-2xl font-black text-zinc-950 dark:text-slate-50">
                {Number(maxPrice).toLocaleString("mn-MN")}₮
              </p>
              <input
                className="mt-3 w-full accent-amber-500"
                type="range"
                min="10000"
                max="250000"
                step="5000"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
              />
              <div className="mt-3 grid grid-cols-2 gap-2">
                {pricePresets.map((preset) => (
                  <button
                    key={preset.value}
                    className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                      maxPrice === preset.value
                        ? "border-amber-500 bg-amber-50 text-amber-800 dark:border-amber-400 dark:bg-amber-500/10 dark:text-amber-200"
                        : "border-zinc-200 bg-white text-zinc-600 hover:bg-amber-50 dark:border-[#3a2a0c] dark:bg-[#241807] dark:text-slate-300"
                    }`}
                    onClick={() => setMaxPrice(preset.value)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-sm font-semibold">Эрэмбэлэх</label>
              <select
                className="mt-2 min-h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm dark:border-[#3a2a0c] dark:bg-[#241807] dark:text-slate-50"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="recommended">Санал болгосноор</option>
                <option value="price-asc">Үнэ өсөхөөр</option>
                <option value="price-desc">Үнэ буурахаар</option>
                <option value="name">Нэрээр</option>
              </select>
            </div>

            <Button className="mt-5 w-full dark:bg-[#241807] dark:text-slate-50 dark:hover:bg-[#2f2109]" variant="secondary" onClick={clearFilters}>
              Цэвэрлэх
            </Button>
          </aside>

          <section className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm dark:border-[#3a2a0c] dark:bg-[#1a1205]">
              <p className="text-sm font-semibold text-zinc-700 dark:text-slate-300">
                {initialLoading ? (
                  <span className="inline-block h-4 w-28 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                ) : (
                  <><span className="font-black text-zinc-950 dark:text-slate-50">{visibleProducts.length}</span> бараа олдлоо</>
                )}
              </p>
              {loading && !initialLoading ? <span className="text-sm text-zinc-500 dark:text-slate-400">Уншиж байна...</span> : null}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {initialLoading
                ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>

            {!initialLoading && !loading && visibleProducts.length === 0 ? (
              <div className="mt-5 rounded-lg border border-dashed border-zinc-300 bg-white px-4 py-12 text-center dark:border-[#4a360f] dark:bg-[#1a1205]">
                <p className="font-black text-zinc-950 dark:text-slate-50">Тохирох бараа олдсонгүй</p>
                <p className="mt-2 text-sm text-zinc-500 dark:text-slate-400">Шүүлтүүрээ суллаад дахин хайгаарай.</p>
                <Button className="mt-5" variant="secondary" onClick={clearFilters}>
                  Шүүлтүүр цэвэрлэх
                </Button>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
