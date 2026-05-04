"use client";

import type { Category, Product } from "@giftmind/db";
import { Button, Input } from "@giftmind/ui";
import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "../../components/product-card";
import { getCategories, getProducts } from "../../lib/api";
import { sampleCategories, sampleProducts } from "../../lib/sample-data";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("150000");
  const [loading, setLoading] = useState(false);

  const query = useMemo(() => {
    const next = new URLSearchParams();
    if (search) next.set("search", search);
    if (category) next.set("category", category);
    if (maxPrice) next.set("maxPrice", maxPrice);
    return `?${next.toString()}`;
  }, [search, category, maxPrice]);

  useEffect(() => {
    setCategory(new URLSearchParams(window.location.search).get("category") ?? "");
    getCategories().then((data) => setCategories(data.categories)).catch(() => undefined);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setLoading(true);
      getProducts(query)
        .then((data) => setProducts(data.products))
        .catch(() => undefined)
        .finally(() => setLoading(false));
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [query]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white px-4 py-8 text-zinc-950 dark:bg-[#050914] dark:text-slate-50">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-[#17233a] dark:bg-[#08111f]">
        <div className="flex items-center gap-2 font-black">
          <SlidersHorizontal className="size-5 text-blue-600 dark:text-blue-300" />
          Шүүлтүүр
        </div>
        <label className="mt-5 block text-sm font-semibold">Хайх</label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-3 size-5 text-zinc-400" />
          <Input className="pl-10 dark:border-[#17233a] dark:bg-[#0c1628] dark:text-slate-50" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="clear case, perfume..." />
        </div>
        <label className="mt-5 block text-sm font-semibold">Ангилал</label>
        <select className="mt-2 min-h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 dark:border-[#17233a] dark:bg-[#0c1628] dark:text-slate-50" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">Бүгд</option>
          {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
        </select>
        <label className="mt-5 block text-sm font-semibold">Дээд үнэ: {Number(maxPrice).toLocaleString("mn-MN")}₮</label>
        <input className="mt-3 w-full accent-blue-600" type="range" min="10000" max="250000" step="5000" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
        <Button className="mt-5 w-full dark:bg-[#0c1628] dark:text-slate-50 dark:hover:bg-[#111d33]" variant="secondary" onClick={() => { setSearch(""); setCategory(""); setMaxPrice("250000"); }}>
          Цэвэрлэх
        </Button>
      </aside>
      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black">Shop</h1>
            <p className="mt-1 text-zinc-600 dark:text-slate-400">{products.length} бараа</p>
          </div>
          {loading ? <span className="text-sm text-zinc-500 dark:text-slate-400">Уншиж байна...</span> : null}
        </div>
        <div className="masonry mt-6">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
      </div>
    </main>
  );
}
