import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMnt(value: number) {
  return new Intl.NumberFormat("mn-MN").format(value) + "₮";
}
