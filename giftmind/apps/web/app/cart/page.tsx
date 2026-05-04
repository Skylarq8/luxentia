"use client";

import { Button, formatMnt } from "@giftmind/ui";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "../../components/cart-provider";

export default function CartPage() {
  const { items, removeItem, total } = useCart();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-black">Сагс</h1>
      <div className="mt-6 grid gap-4">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div key={item.productId} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80 }} className="flex gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <img src={item.image} alt={item.name} className="size-24 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-bold">{item.name}</p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">x{item.quantity}</p>
                <p className="mt-2 font-black text-rose-500">{formatMnt(item.price * item.quantity)}</p>
              </div>
              <button className="grid size-10 place-items-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={() => removeItem(item.productId)} aria-label="Remove">
                <Trash2 className="size-5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <section className="mt-8 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex justify-between text-lg font-black">
          <span>Нийт</span>
          <motion.span key={total} initial={{ scale: 0.9 }} animate={{ scale: 1 }}>{formatMnt(total)}</motion.span>
        </div>
        <Link href="/checkout">
          <Button className="mt-5 w-full" disabled={!items.length}>Checkout</Button>
        </Link>
      </section>
    </main>
  );
}
