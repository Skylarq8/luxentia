import type { Category, Product } from "@giftmind/db";

const getApiUrl = () => {
  const env = process.env.NEXT_PUBLIC_API_URL;
  if (env) return env;
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost:3000";
};

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiUrl()}${path}`, {
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
