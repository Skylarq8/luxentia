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
    <motion.div layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="h-full">
      <Card className="flex h-full overflow-hidden dark:border-[#3a2a0c] dark:bg-[#1a1205]">
        <div className="flex min-w-0 flex-1 flex-col">
        <Link href={`/shop/${product.id}`} className="block overflow-hidden bg-amber-100 dark:bg-[#241807]">
          <img
            src={product.images[0] ?? "https://images.unsplash.com/photo-1513201099705-a9746e1e201f"}
            alt={product.name}
            className="h-36 w-full object-cover transition duration-500 hover:scale-105 sm:h-48 lg:h-52"
          />
        </Link>
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link href={`/shop/${product.id}`} className="line-clamp-2 text-sm font-bold text-zinc-950 hover:text-amber-600 dark:text-slate-50 dark:hover:text-amber-300 sm:text-base">
                {product.name}
              </Link>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-slate-400">{product.description}</p>
            </div>
            <button
              className="grid size-9 shrink-0 place-items-center rounded-lg hover:bg-amber-100 dark:text-slate-200 dark:hover:bg-[#241807]"
              onClick={() => setLiked((value) => !value)}
              aria-label="Wishlist"
            >
              <Heart className={liked ? "size-5 fill-amber-500 text-amber-500" : "size-5"} />
            </button>
          </div>
          <div className="mt-auto flex items-center justify-between gap-2 pt-4">
            <span className="text-sm font-black text-amber-600 dark:text-amber-300 sm:text-base">{formatMnt(product.price)}</span>
            <Button size="sm" className="px-2 sm:px-3" onClick={() => addItem(product)}>
              <ShoppingCart className="size-4" />
              <span className="hidden sm:inline">Сагсанд</span>
            </Button>
          </div>
        </div>
        </div>
      </Card>
    </motion.div>
  );
}
