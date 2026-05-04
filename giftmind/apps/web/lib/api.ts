import type { Category, Product } from "@giftmind/db";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json() as Promise<T>;
}

export async function getProducts(query = "") {
  return apiFetch<{ products: Product[] }>(`/api/products${query}`);
}

export async function getCategories() {
  return apiFetch<{ categories: Category[] }>("/api/categories");
}
