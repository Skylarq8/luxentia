"use client";

import { Button, Input, formatMnt } from "@giftmind/ui";
import { CreditCard, MapPin } from "lucide-react";
import { useState } from "react";
import { useCart } from "../../components/cart-provider";
import { apiFetch } from "../../lib/api";

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const [address, setAddress] = useState({ name: "", phone: "", district: "", details: "" });
  const [message, setMessage] = useState("");

  async function order() {
    const token = localStorage.getItem("luxentia_session");
    await apiFetch("/api/orders", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify({ items, total, shipping_address: address })
    });
    clear();
    setMessage("Захиалга амжилттай үүслээ. Төлбөрийн холбоос удахгүй нэмэгдэнэ.");
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_360px]">
      <section className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2 text-xl font-black">
          <MapPin className="size-5 text-rose-500" />
          Хүргэлтийн хаяг
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Input placeholder="Нэр" value={address.name} onChange={(event) => setAddress({ ...address, name: event.target.value })} />
          <Input placeholder="Утас" value={address.phone} onChange={(event) => setAddress({ ...address, phone: event.target.value })} />
          <Input placeholder="Дүүрэг" value={address.district} onChange={(event) => setAddress({ ...address, district: event.target.value })} />
          <Input placeholder="Дэлгэрэнгүй хаяг" value={address.details} onChange={(event) => setAddress({ ...address, details: event.target.value })} />
        </div>
        {message ? <p className="mt-5 rounded-lg bg-cyan-50 p-3 text-sm text-cyan-800 dark:bg-cyan-500/10 dark:text-cyan-200">{message}</p> : null}
      </section>
      <aside className="h-fit rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2 text-xl font-black">
          <CreditCard className="size-5 text-cyan-500" />
          Төлбөр
        </div>
        <div className="mt-5 space-y-3">
          {items.map((item) => (
            <div key={item.productId} className="flex justify-between gap-3 text-sm">
              <span>{item.name} x{item.quantity}</span>
              <span className="font-bold">{formatMnt(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-between border-t border-zinc-200 pt-4 text-lg font-black dark:border-zinc-800">
          <span>Нийт</span>
          <span>{formatMnt(total)}</span>
        </div>
        <Button className="mt-5 w-full" onClick={order} disabled={!items.length}>Захиалах</Button>
        <p className="mt-3 text-xs text-zinc-500">Stripe болон QPay adapter-д зориулсан backend hook бэлэн нэмэгдэхээр үлдээсэн.</p>
      </aside>
    </main>
  );
}
