"use client";

import React from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Check } from "lucide-react";
import { Book } from "@/types";
import { formatINR } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const wishlisted = isInWishlist(book.id);
  const isOutOfStock = book.stock <= 0;
  const isLowStock = book.stock > 0 && book.stock <= 5;

  return (
    <div className="group relative flex flex-col h-full bg-bookverse-cream rounded-card border border-bookverse-beige p-3.5 sm:p-4 hover:shadow-book-hover transition-all duration-300">
      {/* Badges Overlay */}
      <div className="absolute top-5 left-5 z-20 flex flex-col gap-1 items-start">
        {book.bestseller && (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-bookverse-terracotta text-white shadow-xs">
            Bestseller
          </span>
        )}
        {book.staffPick && !book.bestseller && (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-bookverse-sage text-white shadow-xs">
            Staff Pick
          </span>
        )}
        {book.discountPercent && book.discountPercent > 0 ? (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-bookverse-espresso text-bookverse-cream">
            {book.discountPercent}% OFF
          </span>
        ) : null}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(book);
        }}
        className={`absolute top-5 right-5 z-20 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
          wishlisted
            ? "bg-red-50 text-red-500 scale-110"
            : "bg-white/80 text-bookverse-espresso/60 hover:text-red-500 hover:bg-white"
        }`}
        aria-label="Toggle Wishlist"
      >
        <Heart className={`w-4 h-4 ${wishlisted ? "fill-red-500" : ""}`} />
      </button>

      {/* Book Cover Image with spine effect */}
      <Link
        href={`/books/${book.slug}`}
        className="relative block aspect-[2/3] w-full overflow-hidden rounded-lg bg-bookverse-beige/20 mb-3.5 group-hover:opacity-95"
      >
        <div className="book-spine-effect h-full w-full">
          <img
            src={book.coverImage}
            alt={book.title}
            loading="lazy"
            className="h-full w-full object-cover rounded-lg group-hover:scale-103 transition-transform duration-500"
          />
        </div>
      </Link>

      {/* Book Metadata */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-bookverse-espresso/60 mb-1.5">
            <span className="text-[11px] font-medium text-bookverse-sage uppercase tracking-wider truncate max-w-[120px]">
              {book.category?.name || "Literature"}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-bookverse-espresso">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{book.rating || 4.8}</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/books/${book.slug}`}>
            <h3 className="font-serif text-base font-bold text-bookverse-espresso group-hover:text-bookverse-terracotta transition-colors line-clamp-2 leading-snug">
              {book.title}
            </h3>
          </Link>

          {/* Author */}
          <p className="text-xs text-bookverse-espresso/70 mt-1 line-clamp-1 font-sans">
            by {book.author}
          </p>
        </div>

        {/* Pricing & Cart Action */}
        <div className="pt-3 mt-2 border-t border-bookverse-beige/60">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-bookverse-terracotta">
                {formatINR(book.sellingPrice, true)}
              </span>
              {book.originalPrice > book.sellingPrice && (
                <span className="text-xs text-bookverse-espresso/40 line-through">
                  {formatINR(book.originalPrice, true)}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            {isOutOfStock ? (
              <span className="text-[10px] text-red-500 font-semibold">Out of Stock</span>
            ) : isLowStock ? (
              <span className="text-[10px] text-amber-600 font-semibold">
                Only {book.stock} left!
              </span>
            ) : (
              <span className="text-[10px] text-bookverse-sage font-medium flex items-center gap-0.5">
                <Check className="w-3 h-3" /> In Stock
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(book)}
            disabled={isOutOfStock}
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              isOutOfStock
                ? "bg-bookverse-beige text-bookverse-espresso/40 cursor-not-allowed"
                : "bg-bookverse-espresso text-bookverse-cream hover:bg-bookverse-terracotta hover:shadow-warm active:scale-98"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? "Sold Out" : "Add to Satchel"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
