import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luxentia Admin"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <body className="text-zinc-950 antialiased">{children}</body>
    </html>
  );
}
