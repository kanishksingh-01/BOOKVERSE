"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-bookverse-ivory min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-bookverse-cream border border-bookverse-beige rounded-3xl p-8 sm:p-12 text-center shadow-book space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-bookverse-ivory border border-bookverse-beige flex items-center justify-center text-bookverse-espresso/40">
            <Heart className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-bookverse-espresso">
            Your Wishlist is Empty
          </h1>
          <p className="text-xs sm:text-sm text-bookverse-espresso/70 leading-relaxed font-sans">
            Bookmark titles as you browse the catalogue to assemble your personal reading queue.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-bookverse-terracotta text-white font-semibold text-xs sm:text-sm hover:bg-bookverse-terracotta-hover transition-colors shadow-warm"
            >
              <span>Explore The Shelves</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bookverse-ivory min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold block mb-1">
            Personal Reading Queue
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bookverse-espresso">
            Saved In Wishlist ({items.length})
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((book) => (
            <div
              key={book.id}
              className="bg-bookverse-cream rounded-card border border-bookverse-beige p-4 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg mb-3">
                  <Link href={`/books/${book.slug}`}>
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover rounded-lg hover:scale-103 transition-transform"
                    />
                  </Link>
                  <button
                    onClick={() => removeFromWishlist(book.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-bookverse-espresso/60 hover:text-red-500 shadow-sm transition-colors"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <Link href={`/books/${book.slug}`}>
                  <h3 className="font-serif font-bold text-sm text-bookverse-espresso hover:text-bookverse-terracotta transition-colors line-clamp-2">
                    {book.title}
                  </h3>
                </Link>
                <p className="text-xs text-bookverse-espresso/70 mt-0.5">by {book.author}</p>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-sm font-bold text-bookverse-terracotta">
                    {formatINR(book.sellingPrice, true)}
                  </span>
                  {book.originalPrice > book.sellingPrice && (
                    <span className="text-xs text-bookverse-espresso/40 line-through">
                      {formatINR(book.originalPrice, true)}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-bookverse-beige">
                <button
                  onClick={() => addToCart(book)}
                  disabled={book.stock <= 0}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    book.stock <= 0
                      ? "bg-bookverse-beige text-bookverse-espresso/40 cursor-not-allowed"
                      : "bg-bookverse-espresso text-bookverse-cream hover:bg-bookverse-terracotta"
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{book.stock <= 0 ? "Out of Stock" : "Move to Satchel"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
