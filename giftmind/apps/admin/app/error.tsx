"use client";

import { Button } from "@giftmind/ui";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <section className="rounded-lg bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-black">Админ самбар ачаалахад алдаа гарлаа</h1>
        <Button className="mt-5" onClick={reset}>Дахин оролдох</Button>
      </section>
    </main>
  );
}
