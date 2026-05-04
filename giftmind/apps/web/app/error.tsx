"use client";

import { Button } from "@giftmind/ui";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md rounded-lg border border-zinc-200 bg-white p-6 text-center shadow-sm dark:border-[#3a2a0c] dark:bg-[#0f0a03]">
        <h1 className="text-2xl font-bold">Уучлаарай, алдаа гарлаа</h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-300">Дахин оролдоход бэлэн боллоо.</p>
        <Button className="mt-6" onClick={reset}>Дахин оролдох</Button>
      </div>
    </main>
  );
}
