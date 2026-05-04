"use client";

import type { Product } from "@giftmind/db";
import { Button, formatMnt } from "@giftmind/ui";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "./cart-provider";

export function ProductRecommendationCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="flex gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-[#17233a] dark:bg-[#08111f]">
      <img src={product.images[0]} alt={product.name} className="size-24 rounded-lg object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-zinc-950 dark:text-slate-50">{product.name}</p>
        <p className="mt-1 font-black text-blue-600 dark:text-blue-300">{formatMnt(product.price)}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => addItem(product)}>
            <ShoppingCart className="size-4" />
            Сагсанд нэмэх
          </Button>
          <Link className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-zinc-100 dark:text-slate-200 dark:hover:bg-[#0c1628]" href={`/shop/${product.id}`}>
            Дэлгэрэнгүй
          </Link>
        </div>
      </div>
    </div>
  );
}
