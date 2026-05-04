"use client";

import { Button, cn, formatMnt } from "@giftmind/ui";
import { Moon, ShoppingBag, Sparkles, Sun, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "./auth-provider";
import { useCart } from "./cart-provider";

export function Header() {
  const { items, total } = useCart();
  const { user } = useAuth();
  const [dark, setDark] = useState(false);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const stored = localStorage.getItem("luxentia_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldUseDark = stored ? stored === "dark" : prefersDark;
    setDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  function toggleTheme() {
    setDark((current) => {
      const next = !current;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("luxentia_theme", next ? "dark" : "light");
      return next;
    });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/85 text-zinc-950 backdrop-blur dark:border-[#3a2a0c] dark:bg-[#0f0a03] dark:text-slate-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-black tracking-tight">
          <span className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-600 text-amber-950 shadow-sm shadow-amber-500/30">
            <Sparkles className="size-5" />
          </span>
          Luxentia
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-medium text-zinc-600 dark:text-slate-300 sm:flex">
          <Link className="rounded-lg px-3 py-2 hover:bg-amber-100 dark:hover:bg-[#241807]" href="/shop">Бараанууд</Link>
          <Link className="rounded-lg px-3 py-2 hover:bg-amber-100 dark:hover:bg-[#241807]" href="/chat">AI Чат</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Theme"
            className="text-zinc-700 hover:bg-amber-100 dark:text-slate-200 dark:hover:bg-[#241807]"
            onClick={toggleTheme}
          >
            {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
          <Link
            href="/cart"
            className={cn(
              "relative inline-flex min-h-11 items-center gap-2 rounded-lg bg-amber-100 px-3 text-sm font-semibold text-zinc-950 hover:bg-amber-200 dark:bg-[#241807] dark:text-slate-50 dark:hover:bg-[#2f2109]",
              count > 0 && "animate-pulse"
            )}
          >
            <ShoppingBag className="size-5" />
            <span className="hidden sm:inline">{formatMnt(total)}</span>
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-amber-500 text-xs text-white">
                {count}
              </span>
            ) : null}
          </Link>
          {user ? (
            <Link
              href="/profile"
              className="hidden min-h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 text-sm font-semibold text-zinc-950 shadow-sm hover:bg-amber-50 dark:border-[#3a2a0c] dark:bg-[#1a1205] dark:text-slate-50 dark:hover:bg-[#241807] sm:inline-flex"
            >
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="size-8 rounded-full object-cover" />
              ) : (
                <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 text-xs font-black text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="max-w-[110px] truncate">{user.name}</span>
            </Link>
          ) : (
            <Link
              href="/auth"
              className="hidden min-h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-950 shadow-sm hover:bg-amber-50 dark:border-[#3a2a0c] dark:bg-[#1a1205] dark:text-slate-50 dark:hover:bg-[#241807] sm:inline-flex"
            >
              <UserRound className="size-4" />
              Нэвтрэх
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
