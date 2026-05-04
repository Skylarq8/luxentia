"use client";

import { Gift, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  ["Технологи", "/shop?category=electronics"],
  ["Гоо сайхан", "/shop?category=cosmetics"],
  ["Гэрийн декор", "/shop?category=home-decor"],
  ["Үнэт эдлэл", "/shop?category=jewelry"]
];

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/chat")) return null;

  return (
    <footer className="border-t border-zinc-200 bg-white pb-24 pt-12 text-zinc-700 dark:border-[#3a2a0c] dark:bg-[#0f0a03] dark:text-slate-300 sm:pb-10">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-[1.3fr_0.7fr_0.7fr_0.9fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-lg font-black tracking-tight text-zinc-950 dark:text-white">
            <span className="grid size-10 place-items-center rounded-lg bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-600 text-amber-950 shadow-sm shadow-amber-500/30">
              <Sparkles className="size-5" />
            </span>
            Luxentia
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-500 dark:text-slate-400">
            Өөртөө болон хайртай хүмүүстээ тохирох бэлэг, хэрэгтэй сонголтыг илүү амар олоход туслах онлайн дэлгүүр.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
            <Gift className="size-4" />
            AI-аар бэлэг сонгох боломжтой
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-wide text-zinc-950 dark:text-white">Дэлгүүр</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <Link href="/shop" className="hover:text-amber-600 dark:hover:text-amber-300">Бүх бараа</Link>
            <Link href="/chat" className="hover:text-amber-600 dark:hover:text-amber-300">AI Чат</Link>
            <Link href="/cart" className="hover:text-amber-600 dark:hover:text-amber-300">Сагс</Link>
            <Link href="/profile" className="hover:text-amber-600 dark:hover:text-amber-300">Профайл</Link>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-wide text-zinc-950 dark:text-white">Ангилал</h2>
          <div className="mt-4 grid gap-3 text-sm">
            {categories.map(([label, href]) => (
              <Link key={href} href={href} className="hover:text-amber-600 dark:hover:text-amber-300">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black uppercase tracking-wide text-zinc-950 dark:text-white">Холбоо барих</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <span className="inline-flex items-center gap-2">
              <Phone className="size-4 text-amber-600 dark:text-amber-300" />
              +976 9900 1234
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail className="size-4 text-amber-600 dark:text-amber-300" />
              hello@luxentia.mn
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-amber-600 dark:text-amber-300" />
              Улаанбаатар, Монгол
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-zinc-200 px-4 pt-6 text-xs text-zinc-500 dark:border-[#3a2a0c] dark:text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Luxentia. Бүх эрх хуулиар хамгаалагдсан.</p>
        <p>Зөв сонголтыг илүү амар болгоё.</p>
      </div>
    </footer>
  );
}
