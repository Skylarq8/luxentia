"use client";

import type { Product } from "@giftmind/db";
import { Button, formatMnt } from "@giftmind/ui";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "./cart-provider";

export function ProductRecommendationCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="flex gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-[#3a2a0c] dark:bg-[#1a1205]">
      <img src={product.images[0]} alt={product.name} className="size-24 rounded-lg object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-zinc-950 dark:text-slate-50">{product.name}</p>
        <p className="mt-1 font-black text-amber-600 dark:text-amber-300">{formatMnt(product.price)}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => addItem(product)}>
            <ShoppingCart className="size-4" />
            Сагсанд нэмэх
          </Button>
          <Link className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-amber-100 dark:text-slate-200 dark:hover:bg-[#241807]" href={`/shop/${product.id}`}>
            Дэлгэрэнгүй
          </Link>
        </div>
      </div>
    </div>
  );
}
