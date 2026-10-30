import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Toaster } from "sonner";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";

export const metadata: Metadata = {
  title: "BookVerse – Every Book Opens a New World | Independent Indian Bookstore",
  description:
    "An aesthetic, independent online bookstore curated for Indian readers. Discover literary fiction, timeless history, technology, and thought-provoking nonfiction.",
  keywords: [
    "online bookstore India",
    "Indian literature",
    "buy books online",
    "BookVerse",
    "independent bookstore",
    "Arundhati Roy",
    "fiction books",
    "bestsellers",
  ],
  authors: [{ name: "BookVerse Booksellers" }],
  openGraph: {
    title: "BookVerse – Every Book Opens a New World",
    description: "Curated collection of books for the discerning Indian reader.",
    url: "https://bookverse.in",
    siteName: "BookVerse",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-bookverse-ivory text-bookverse-espresso antialiased">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AnnouncementBar />
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: "#FFFDF8",
                    color: "#3D3028",
                    border: "1px solid #EDE5D9",
                    borderRadius: "12px",
                  },
                }}
              />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
