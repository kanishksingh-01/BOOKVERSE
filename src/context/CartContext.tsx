"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Book, CartItem, Coupon } from "@/types";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;       // in paise
  discount: number;       // in paise
  shippingFee: number;    // in paise
  grandTotal: number;     // in paise
  appliedCoupon: Coupon | null;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  applyCoupon: (couponCode: string) => Promise<boolean>;
  removeCoupon: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const SHIPPING_THRESHOLD = 49900; // Free shipping over ₹499 (49900 paise)
const STANDARD_SHIPPING = 4900;   // ₹49 shipping fee

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const { user } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bookverse_cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem("bookverse_coupon");
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.error("Failed to load local cart", e);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("bookverse_cart", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem("bookverse_coupon", JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem("bookverse_coupon");
      }
    } catch (e) {
      console.error("Failed to save coupon", e);
    }
  }, [appliedCoupon]);

  const addToCart = (book: Book, quantity = 1) => {
    if (book.stock <= 0) {
      toast.error("Sorry, this book is currently out of stock");
      return;
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.bookId === book.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > book.stock) {
          toast.warning(`Only ${book.stock} copies available in stock`);
          return prev.map((item) =>
            item.bookId === book.id ? { ...item, quantity: book.stock } : item
          );
        }
        toast.success(`Updated "${book.title}" in cart`);
        return prev.map((item) =>
          item.bookId === book.id ? { ...item, quantity: newQty } : item
        );
      } else {
        const addedQty = Math.min(quantity, book.stock);
        toast.success(`Added "${book.title}" to cart`);
        return [
          ...prev,
          {
            id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            bookId: book.id,
            book,
            quantity: addedQty,
          },
        ];
      }
    });

    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (bookId: string) => {
    setItems((prev) => prev.filter((item) => item.bookId !== bookId));
    toast.info("Item removed from cart");
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.bookId === bookId) {
          if (quantity > item.book.stock) {
            toast.warning(`Maximum available stock is ${item.book.stock}`);
            return { ...item, quantity: item.book.stock };
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem("bookverse_cart");
    localStorage.removeItem("bookverse_coupon");
  };

  // Calculations
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.book.sellingPrice * item.quantity,
    0
  );

  let discount = 0;
  if (appliedCoupon) {
    if (subtotal >= appliedCoupon.minOrderAmount) {
      if (appliedCoupon.discountType === "PERCENTAGE") {
        const calculated = Math.round((subtotal * appliedCoupon.discountValue) / 100);
        discount = appliedCoupon.maxDiscountAmount
          ? Math.min(calculated, appliedCoupon.maxDiscountAmount)
          : calculated;
      } else {
        discount = appliedCoupon.discountValue;
      }
    }
  }

  // Free shipping if subtotal >= ₹499 or if empty cart
  const shippingFee = subtotal === 0 || subtotal >= SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const applyCoupon = async (code: string): Promise<boolean> => {
    const cleanCode = code.trim().toUpperCase();
    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(cleanCode)}&subtotal=${subtotal}`);
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Invalid coupon code");
        return false;
      }

      setAppliedCoupon(data.coupon);
      toast.success(`Coupon "${cleanCode}" applied successfully!`);
      return true;
    } catch {
      toast.error("Failed to validate coupon");
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.info("Coupon removed");
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        discount,
        shippingFee,
        grandTotal,
        appliedCoupon,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
