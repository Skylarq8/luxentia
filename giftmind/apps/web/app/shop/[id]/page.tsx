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

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(sampleProducts.find((item) => item.id === params.id) ?? sampleProducts[0]);
  const [similar, setSimilar] = useState<Product[]>(sampleProducts);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    apiFetch<{ product: Product }>(`/api/products/${params.id}`).then((data) => {
      setProduct(data.product);
      getProducts(`?category=${data.product.category}`).then((items) => setSimilar(items.products.filter((item) => item.id !== data.product.id).slice(0, 3))).catch(() => undefined);
    }).catch(() => undefined);
  }, [params.id]);

  if (!product) return null;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} className="grid gap-3">
          <img src={product.images[0]} alt={product.name} className="aspect-square w-full rounded-lg object-cover" />
          <div className="grid grid-cols-4 gap-3">
            {(product.images.length ? product.images : [product.images[0]]).map((image, index) => (
              <img key={`${image}-${index}`} src={image} alt="" className="aspect-square rounded-lg object-cover" />
            ))}
          </div>
        </motion.div>
        <motion.section initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-sm font-bold uppercase tracking-wider text-rose-500">{product.category}</p>
          <h1 className="mt-3 text-4xl font-black">{product.name}</h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">{product.description}</p>
          <p className="mt-6 text-3xl font-black text-rose-500">{formatMnt(product.price)}</p>
          <div className="mt-6 flex items-center gap-3">
            <button className="grid size-11 place-items-center rounded-lg bg-zinc-100 dark:bg-zinc-800" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Decrease">
              <Minus className="size-5" />
            </button>
            <span className="w-10 text-center text-xl font-black">{quantity}</span>
            <button className="grid size-11 place-items-center rounded-lg bg-zinc-100 dark:bg-zinc-800" onClick={() => setQuantity((value) => value + 1)} aria-label="Increase">
              <Plus className="size-5" />
            </button>
            <Button size="lg" onClick={() => addItem(product, quantity)}>
              <ShoppingCart className="size-5" />
              Сагсанд нэмэх
            </Button>
          </div>
          <div className="mt-8 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex items-center gap-2 font-black">
              <Sparkles className="size-5 text-cyan-500" />
              Similar gifts
            </div>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">AI context болон ангилалд тулгуурласан ойролцоо сонголтууд.</p>
          </div>
          <section className="mt-8">
            <h2 className="text-xl font-black">Reviews</h2>
            <div className="mt-3 rounded-lg bg-zinc-100 p-4 text-sm dark:bg-zinc-900">★★★★★ Маш гоё савлагаатай, хурдан ирсэн.</div>
          </section>
        </motion.section>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {similar.map((item) => <ProductCard key={item.id} product={item} />)}
      </div>
    </main>
  );
}
