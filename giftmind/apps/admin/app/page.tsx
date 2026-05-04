"use client";

import type { Order, Product, User } from "@giftmind/db";
import { Button, Input, formatMnt } from "@giftmind/ui";
import { motion } from "framer-motion";
import { Boxes, PackageCheck, ShoppingBag, Users } from "lucide-react";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

type Stats = {
  totalOrders: number;
  revenue: number;
  users: number;
  products: number;
};

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem("luxentia_session") ?? "";
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init?.headers
    }
  });

  if (!response.ok) throw new Error(await response.text());
  return response.json() as Promise<T>;
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, revenue: 0, users: 0, products: 0 });
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setError("");
    try {
      const [statsData, productsData, ordersData, usersData] = await Promise.all([
        adminFetch<Stats>("/api/admin/stats"),
        adminFetch<{ products: Product[] }>("/api/admin/products"),
        adminFetch<{ orders: Order[] }>("/api/admin/orders"),
        adminFetch<{ users: User[] }>("/api/admin/users")
      ]);
      setStats(statsData);
      setProducts(productsData.products);
      setOrders(ordersData.orders);
      setUsers(usersData.users);
    } catch {
      setError("Админ эрхтэй session token шаардлагатай.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  const cards = [
    { label: "Orders", value: stats.totalOrders, icon: ShoppingBag },
    { label: "Revenue", value: formatMnt(stats.revenue), icon: PackageCheck },
    { label: "Users", value: stats.users, icon: Users },
    { label: "Products", value: stats.products, icon: Boxes }
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-black">Luxentia Admin</h1>
          <p className="mt-1 text-zinc-600">Захиалга, бараа, хэрэглэгчийн тойм.</p>
        </div>
        <div className="flex gap-2">
          <Input className="w-72" placeholder="Admin bearer token" value={token} onChange={(event) => setToken(event.target.value)} />
          <Button onClick={() => { localStorage.setItem("luxentia_session", token); load(); }}>Connect</Button>
        </div>
      </div>

      {error ? <p className="mt-5 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="rounded-lg bg-white p-5 shadow-sm">
            <card.icon className="size-6 text-rose-500" />
            <p className="mt-4 text-sm font-semibold text-zinc-500">{card.label}</p>
            <p className="mt-1 text-2xl font-black">{card.value}</p>
          </motion.div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">Products</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-zinc-500">
                <tr><th className="py-2">Name</th><th>Category</th><th>Stock</th><th>Price</th></tr>
              </thead>
              <tbody>
                {products.slice(0, 10).map((product) => (
                  <tr key={product.id} className="border-t border-zinc-100">
                    <td className="py-3 font-semibold">{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.stock}</td>
                    <td>{formatMnt(product.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">Orders</h2>
          <div className="mt-4 space-y-3">
            {orders.slice(0, 8).map((order) => (
              <div key={order.id} className="flex justify-between rounded-lg bg-zinc-50 p-3 text-sm">
                <span className="font-semibold">{order.status}</span>
                <span>{formatMnt(order.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-lg bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">Users</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {users.slice(0, 9).map((user) => (
            <div key={user.id} className="rounded-lg bg-zinc-50 p-3">
              <p className="font-semibold">{user.name ?? user.phone}</p>
              <p className="text-sm text-zinc-500">{user.role}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
