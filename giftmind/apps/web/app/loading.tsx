export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-amber-200 dark:bg-[#241807]" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-72 animate-pulse rounded-lg bg-amber-200 dark:bg-[#241807]" />
        ))}
      </div>
    </main>
  );
}
