import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-amber-500 text-white shadow-lg shadow-amber-500/25 hover:bg-amber-600 focus-visible:outline-amber-500",
        secondary: "bg-amber-100 text-zinc-950 hover:bg-amber-200 dark:bg-[#241807] dark:text-zinc-50 dark:hover:bg-[#2f2109]",
        ghost: "text-zinc-700 hover:bg-amber-100 dark:text-zinc-200 dark:hover:bg-[#241807]",
        outline: "border border-zinc-200 bg-white text-zinc-900 hover:bg-amber-50 dark:border-[#3a2a0c] dark:bg-[#0f0a03] dark:text-zinc-50"
      },
      size: {
        sm: "min-h-9 px-3",
        md: "min-h-11 px-4",
        lg: "min-h-12 px-5 text-base",
        icon: "size-11 p-0"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
);
Button.displayName = "Button";
