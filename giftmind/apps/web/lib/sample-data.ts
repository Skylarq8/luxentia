import type { Category, Product } from "@giftmind/db";

export const sampleCategories: Category[] = [
  { id: "electronics", name: "Electronics", slug: "electronics", parent_id: null, image_url: "https://images.unsplash.com/photo-1498049794561-7780e7231661" },
  { id: "cosmetics", name: "Cosmetics", slug: "cosmetics", parent_id: null, image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9" },
  { id: "home-decor", name: "Home Decor", slug: "home-decor", parent_id: null, image_url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38" },
  { id: "food", name: "Food", slug: "food", parent_id: null, image_url: "https://images.unsplash.com/photo-1542838132-92c53300491e" }
];

export const sampleProducts: Product[] = [
  {
    id: "sample-case",
    name: "Crystal Clear Phone Case",
    description: "Durable transparent case with raised edges for daily protection.",
    price: 29000,
    category: "electronics",
    tags: ["clear case", "phone", "gift"],
    images: ["https://images.unsplash.com/photo-1603313011101-320f26a4f6f6"],
    stock: 42,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "sample-perfume",
    name: "Signature Perfume 30ml",
    description: "Elegant floral musk perfume for a memorable personal gift.",
    price: 145000,
    category: "cosmetics",
    tags: ["perfume", "girlfriend", "romantic"],
    images: ["https://images.unsplash.com/photo-1541643600914-78b084683601"],
    stock: 16,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "sample-candle",
    name: "Soy Candle Amber",
    description: "Long-burning amber candle with a warm evening scent.",
    price: 39000,
    category: "home-decor",
    tags: ["candle", "home", "romantic"],
    images: ["https://images.unsplash.com/photo-1602874801006-e26c6694b1d6"],
    stock: 52,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
