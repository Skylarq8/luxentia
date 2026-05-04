import * as React from "react";
import { cn } from "./utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-[#3a2a0c] dark:bg-[#0f0a03]",
        className
      )}
      {...props}
    />
  );
}
