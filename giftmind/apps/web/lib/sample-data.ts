import type { Category, Product } from "@giftmind/db";

export const sampleCategories: Category[] = [
  { id: "electronics", name: "Electronics", slug: "electronics", parent_id: null, image_url: "https://images.unsplash.com/photo-1498049794561-7780e7231661" },
  { id: "clothing", name: "Clothing", slug: "clothing", parent_id: null, image_url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f" },
  { id: "cosmetics", name: "Cosmetics", slug: "cosmetics", parent_id: null, image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9" },
  { id: "food", name: "Food", slug: "food", parent_id: null, image_url: "https://images.unsplash.com/photo-1542838132-92c53300491e" },
  { id: "home-decor", name: "Home Decor", slug: "home-decor", parent_id: null, image_url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38" },
  { id: "books", name: "Books", slug: "books", parent_id: null, image_url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f" },
  { id: "toys", name: "Toys", slug: "toys", parent_id: null, image_url: "https://images.unsplash.com/photo-1558060370-d644479cb6f7" },
  { id: "jewelry", name: "Jewelry", slug: "jewelry", parent_id: null, image_url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338" }
];

export const sampleProducts: Product[] = [
  {
    id: "sample-case",
    name: "Тунгалаг утасны гэр",
    description: "Өдөр тутмын хэрэглээнд тохиромжтой, ирмэг хамгаалалттай бат бөх тунгалаг гэр.",
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
    name: "Онцгой үнэртэн 30мл",
    description: "Цэцэгс болон зөөлөн заарын үнэртэй, дурсамжтай бэлэгт тохирох жижиг үнэртэн.",
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
    name: "Амбер үнэрт шар буурцгийн лаа",
    description: "Оройн дулаан үнэртэй, удаан асах амбер үнэрт шар буурцгийн лаа.",
    price: 39000,
    category: "home-decor",
    tags: ["candle", "home", "romantic"],
    images: ["https://images.pexels.com/photos/7795651/pexels-photo-7795651.jpeg?auto=compress&cs=tinysrgb&w=900"],
    stock: 52,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "sample-necklace",
    name: "Алтан зүрхэн хүзүүний зүүлт",
    description: "Бэлгийн савлагаанд бэлэн, дулаан алтлаг өнгөтэй минимал зүрхэн гоёлын зүүлт.",
    price: 99000,
    category: "jewelry",
    tags: ["necklace", "gold", "romantic"],
    images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338"],
    stock: 24,
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
