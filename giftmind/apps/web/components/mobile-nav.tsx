"use client";

import { cn } from "@giftmind/ui";
import { Home, MessageCircle, ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./auth-provider";

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const items = [
    { href: "/", label: "Нүүр", icon: Home },
    { href: "/shop", label: "Бараанууд", icon: ShoppingBag },
    { href: "/chat", label: "AI Чат", icon: MessageCircle },
    user
      ? { href: "/profile", label: "Профайл", icon: UserRound }
      : { href: "/auth", label: "Нэвтрэх", icon: UserRound }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/90 backdrop-blur dark:border-[#17233a] dark:bg-[#050914]/90 sm:hidden">
      <div className="grid grid-cols-4">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                active
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              {href === "/profile" && user ? (
                user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.name} className="size-6 rounded-full object-cover" />
                ) : (
                  <span className={cn("grid size-6 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-[10px] font-black text-white", active && "ring-2 ring-blue-400 ring-offset-1")}>
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )
              ) : (
                <Icon className={cn("size-6", active && "stroke-[2.5]")} />
              )}
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
