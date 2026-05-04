import type { Metadata, Viewport } from "next";
import { AuthProvider } from "../components/auth-provider";
import { CartProvider } from "../components/cart-provider";
import { Header } from "../components/header";
import { MobileNav } from "../components/mobile-nav";
import { PwaRegister } from "../components/pwa-register";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luxentia",
  description: "AI-powered Mongolian gift shop",
  manifest: "/manifest.json"
};

export const viewport: Viewport = {
  themeColor: "#f43f5e",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <body className="font-sans text-zinc-950 antialiased dark:bg-zinc-950 dark:text-zinc-50">
        <AuthProvider>
          <CartProvider>
            <PwaRegister />
            <Header />
            <div className="pb-20 sm:pb-0">{children}</div>
            <MobileNav />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
