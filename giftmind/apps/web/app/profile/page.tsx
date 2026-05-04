"use client";

import { Button } from "@giftmind/ui";
import { CalendarDays, Heart, LogOut, Package, Phone, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../../components/auth-provider";

function Avatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  if (avatarUrl) {
    return <img src={avatarUrl} alt={name} className="size-24 rounded-full object-cover ring-4 ring-amber-500/20 sm:size-28" />;
  }
  return (
    <div className="grid size-24 place-items-center rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 text-3xl font-black text-white ring-4 ring-amber-500/20 sm:size-28 sm:text-4xl">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/auth");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-white dark:bg-[#0f0a03]">
        <div className="size-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </main>
    );
  }

  const joinedDate = new Intl.DateTimeFormat("mn-MN", { year: "numeric", month: "long", day: "numeric" }).format(new Date(user.created_at));

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-white px-4 py-8 text-zinc-950 dark:bg-[#0f0a03] dark:text-slate-50 sm:py-12">
      <div className="mx-auto max-w-lg">

        {/* Avatar + name */}
        <div className="flex flex-col items-center gap-4 text-center">
          <Avatar name={user.name} avatarUrl={user.avatar_url} />
          <div>
            <h1 className="text-2xl font-black sm:text-3xl">{user.name}</h1>
            {user.role === "admin" && (
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-400/10 dark:text-amber-300">
                <ShieldCheck className="size-3" /> Админ
              </span>
            )}
          </div>
        </div>

        {/* Info cards */}
        <div className="mt-8 grid gap-3">
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-amber-50 px-5 py-4 dark:border-[#3a2a0c] dark:bg-[#1a1205]">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
              <Phone className="size-5" />
            </span>
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-slate-400">Утас</p>
              <p className="font-bold">{user.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-amber-50 px-5 py-4 dark:border-[#3a2a0c] dark:bg-[#1a1205]">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
              <CalendarDays className="size-5" />
            </span>
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-slate-400">Бүртгүүлсэн огноо</p>
              <p className="font-bold">{joinedDate}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-amber-50 px-5 py-4 dark:border-[#3a2a0c] dark:bg-[#1a1205]">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
              <Package className="size-5" />
            </span>
            <div>
              <p className="text-xl font-black">0</p>
              <p className="text-xs font-medium text-zinc-500 dark:text-slate-400">Захиалга</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-amber-50 px-5 py-4 dark:border-[#3a2a0c] dark:bg-[#1a1205]">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
              <Heart className="size-5" />
            </span>
            <div>
              <p className="text-xl font-black">0</p>
              <p className="text-xs font-medium text-zinc-500 dark:text-slate-400">Wishlist</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <Button
          onClick={logout}
          variant="outline"
          className="mt-8 w-full gap-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <LogOut className="size-4" />
          Гарах
        </Button>
      </div>
    </main>
  );
}
