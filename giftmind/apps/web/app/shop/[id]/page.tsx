"use client";

import type { Product } from "@giftmind/db";
import { Button, formatMnt } from "@giftmind/ui";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../../../components/cart-provider";
import { ProductCard } from "../../../components/product-card";
import { apiFetch, getProducts } from "../../../lib/api";
import { sampleProducts } from "../../../lib/sample-data";

function ProductDetailSkeleton() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image skeleton */}
        <div className="grid gap-3">
          <div className="aspect-square w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-2">
            <div className="h-8 w-3/4 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-8 w-1/2 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-full animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="h-10 w-32 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800 pt-2" />
          <div className="flex gap-3 pt-2">
            <div className="h-11 w-11 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-11 w-11 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-11 flex-1 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="h-24 w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>

      {/* Similar products skeleton */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="aspect-square w-full animate-pulse bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-1/3 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    apiFetch<{ product: Product }>(`/api/products/${params.id}`)
      .then((data) => {
        setProduct(data.product);
        getProducts(`?category=${data.product.category}`)
          .then((items) => setSimilar(items.products.filter((item) => item.id !== data.product.id).slice(0, 3)))
          .catch(() => setSimilar(sampleProducts.slice(0, 3)));
      })
      .catch(() => {
        const fallback = sampleProducts.find((item) => item.id === params.id) ?? sampleProducts[0];
        setProduct(fallback);
        setSimilar(sampleProducts.filter((item) => item.id !== fallback.id).slice(0, 3));
      });
  }, [params.id]);

  if (!product) return <ProductDetailSkeleton />;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} className="grid gap-3">
          <img src={product.images[0]} alt={product.name} className="aspect-square w-full rounded-2xl object-cover" />
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((image, index) => (
              <img key={`${image}-${index}`} src={image} alt="" className="aspect-square rounded-xl object-cover" />
            ))}
          </div>
        </motion.div>

        <motion.section initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-sm font-bold uppercase tracking-wider text-amber-500">{product.category}</p>
          <h1 className="mt-3 text-4xl font-black">{product.name}</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">{product.description}</p>
          <p className="mt-6 text-3xl font-black text-amber-500">{formatMnt(product.price)}</p>
          <div className="mt-6 flex items-center gap-3">
            <button
              className="grid size-11 place-items-center rounded-xl bg-zinc-100 dark:bg-zinc-800"
              onClick={() => setQuantity((v) => Math.max(1, v - 1))}
              aria-label="Decrease"
            >
              <Minus className="size-5" />
            </button>
            <span className="w-10 text-center text-xl font-black">{quantity}</span>
            <button
              className="grid size-11 place-items-center rounded-xl bg-zinc-100 dark:bg-zinc-800"
              onClick={() => setQuantity((v) => v + 1)}
              aria-label="Increase"
            >
              <Plus className="size-5" />
            </button>
            <Button size="lg" onClick={() => addItem(product, quantity)}>
              <ShoppingCart className="size-5" />
              Сагсанд нэмэх
            </Button>
          </div>
          <div className="mt-8 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex items-center gap-2 font-black">
              <Sparkles className="size-5 text-amber-400" />
              Ойролцоо бэлгүүд
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">AI болон ангилалд тулгуурласан санал.</p>
          </div>
          <section className="mt-8">
            <h2 className="text-xl font-black">Сэтгэгдэл</h2>
            <div className="mt-3 rounded-xl bg-zinc-100 p-4 text-sm dark:bg-zinc-900">★★★★★ Маш гоё савлагаатай, хурдан ирсэн.</div>
          </section>
        </motion.section>
      </div>

      {similar.length > 0 && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((item) => <ProductCard key={item.id} product={item} />)}
        </div>
      )}
    </main>
  );
}
