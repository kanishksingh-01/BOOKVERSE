"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Book } from "@/types";
import { toast } from "sonner";

interface WishlistContextType {
  items: Book[];
  itemCount: number;
  isInWishlist: (bookId: string) => boolean;
  toggleWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Book[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bookverse_wishlist");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load wishlist", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("bookverse_wishlist", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save wishlist", e);
    }
  }, [items]);

  const isInWishlist = (bookId: string) => {
    return items.some((b) => b.id === bookId);
  };

  const toggleWishlist = (book: Book) => {
    setItems((prev) => {
      const exists = prev.some((b) => b.id === book.id);
      if (exists) {
        toast.info(`Removed "${book.title}" from Wishlist`);
        return prev.filter((b) => b.id !== book.id);
      } else {
        toast.success(`Saved "${book.title}" to Wishlist`);
        return [...prev, book];
      }
    });
  };

  const removeFromWishlist = (bookId: string) => {
    setItems((prev) => prev.filter((b) => b.id !== bookId));
    toast.info("Item removed from Wishlist");
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount: items.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
