"use client";

import type { Product } from "@giftmind/db";
import { Button, Card, formatMnt } from "@giftmind/ui";
import { Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "./cart-provider";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [liked, setLiked] = useState(false);

  return (
    <motion.div layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}>
      <Card className="mb-4 overflow-hidden dark:border-[#17233a] dark:bg-[#08111f]">
        <Link href={`/shop/${product.id}`} className="block overflow-hidden bg-zinc-100 dark:bg-[#0c1628]">
          <img
            src={product.images[0] ?? "https://images.unsplash.com/photo-1513201099705-a9746e1e201f"}
            alt={product.name}
            className="h-56 w-full object-cover transition duration-500 hover:scale-105"
          />
        </Link>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Link href={`/shop/${product.id}`} className="font-bold text-zinc-950 hover:text-blue-600 dark:text-slate-50 dark:hover:text-blue-300">
                {product.name}
              </Link>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-slate-400">{product.description}</p>
            </div>
            <button
              className="grid size-9 shrink-0 place-items-center rounded-lg hover:bg-zinc-100 dark:text-slate-200 dark:hover:bg-[#0c1628]"
              onClick={() => setLiked((value) => !value)}
              aria-label="Wishlist"
            >
              <Heart className={liked ? "size-5 fill-blue-500 text-blue-500" : "size-5"} />
            </button>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="font-black text-blue-600 dark:text-blue-300">{formatMnt(product.price)}</span>
            <Button size="sm" onClick={() => addItem(product)}>
              <ShoppingCart className="size-4" />
              Сагсанд
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
