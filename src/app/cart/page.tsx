"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Tag,
  Check,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    itemCount,
    subtotal,
    discount,
    shippingFee,
    grandTotal,
    appliedCoupon,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    await applyCoupon(couponInput);
    setIsApplying(false);
    setCouponInput("");
  };

  const freeShippingThreshold = 49900;
  const neededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (items.length === 0) {
    return (
      <div className="bg-bookverse-ivory min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-bookverse-cream border border-bookverse-beige rounded-3xl p-8 sm:p-12 text-center shadow-book space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-bookverse-ivory border border-bookverse-beige flex items-center justify-center text-bookverse-espresso/40">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-bookverse-espresso">
            Your reading satchel is empty
          </h1>
          <p className="text-xs sm:text-sm text-bookverse-espresso/70 leading-relaxed font-sans">
            Every book opens a new world. Browse our curated catalogues to discover stories that stay with you.
          </p>
          <div className="pt-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-bookverse-terracotta text-white font-semibold text-xs sm:text-sm hover:bg-bookverse-terracotta-hover transition-colors shadow-warm"
            >
              <span>Explore The Catalogue</span>
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
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold block mb-1">
              Order Review
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bookverse-espresso">
              Your Reading Satchel ({itemCount} {itemCount === 1 ? "book" : "books"})
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-bookverse-espresso/60 hover:text-red-500 font-medium self-start sm:self-auto"
          >
            Clear Entire Satchel
          </button>
        </div>

        {/* Free Shipping Banner */}
        <div className="mb-8 p-4 bg-bookverse-cream rounded-2xl border border-bookverse-beige shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-bookverse-terracotta shrink-0" />
            {neededForFreeShipping > 0 ? (
              <span className="text-bookverse-espresso/80">
                Add{" "}
                <strong className="text-bookverse-terracotta">
                  {formatINR(neededForFreeShipping, true)}
                </strong>{" "}
                worth of books to qualify for <strong>Complimentary Pan-India Delivery</strong>
              </span>
            ) : (
              <span className="text-bookverse-sage font-bold">
                You have qualified for Free Tracked Pan-India Delivery!
              </span>
            )}
          </div>
          <div className="w-full sm:w-48 bg-bookverse-beige h-2 rounded-full overflow-hidden">
            <div
              className="bg-bookverse-terracotta h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Grid Layout: Items on Left, Summary on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 bg-bookverse-cream rounded-2xl border border-bookverse-beige shadow-xs divide-y divide-bookverse-beige/70 overflow-hidden">
            <div className="p-4 sm:p-5 bg-bookverse-ivory/60 text-xs font-bold uppercase tracking-wider text-bookverse-espresso/70 grid grid-cols-12 gap-4">
              <span className="col-span-6 sm:col-span-7">Selected Titles</span>
              <span className="col-span-3 text-center">Quantity</span>
              <span className="col-span-3 sm:col-span-2 text-right">Total</span>
            </div>

            {items.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 grid grid-cols-12 gap-4 items-center">
                {/* Book Details */}
                <div className="col-span-6 sm:col-span-7 flex gap-4 items-center">
                  <Link
                    href={`/books/${item.book.slug}`}
                    className="w-16 h-22 sm:w-20 sm:h-28 shrink-0 book-spine-effect rounded-lg overflow-hidden border border-bookverse-beige"
                  >
                    <img
                      src={item.book.coverImage}
                      alt={item.book.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-bookverse-sage">
                      {item.book.category?.name || "Book"}
                    </span>
                    <Link href={`/books/${item.book.slug}`}>
                      <h3 className="font-serif text-sm sm:text-base font-bold text-bookverse-espresso hover:text-bookverse-terracotta transition-colors line-clamp-1">
                        {item.book.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-bookverse-espresso/70 truncate">
                      by {item.book.author}
                    </p>
                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <span className="font-bold text-bookverse-terracotta">
                        {formatINR(item.book.sellingPrice, true)}
                      </span>
                      {item.book.originalPrice > item.book.sellingPrice && (
                        <span className="text-[11px] text-bookverse-espresso/40 line-through">
                          {formatINR(item.book.originalPrice, true)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="col-span-3 flex justify-center">
                  <div className="flex items-center border border-bookverse-beige rounded-xl bg-bookverse-ivory shadow-xs">
                    <button
                      onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                      className="p-1.5 sm:p-2 text-bookverse-espresso hover:text-bookverse-terracotta transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2.5 sm:px-3 text-xs sm:text-sm font-bold text-bookverse-espresso">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                      className="p-1.5 sm:p-2 text-bookverse-espresso hover:text-bookverse-terracotta transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Line Total & Remove */}
                <div className="col-span-3 sm:col-span-2 text-right flex flex-col items-end gap-1">
                  <span className="font-serif font-bold text-sm sm:text-base text-bookverse-espresso">
                    {formatINR(item.book.sellingPrice * item.quantity, true)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.bookId)}
                    className="text-xs text-bookverse-espresso/40 hover:text-red-500 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="p-4 sm:p-6 bg-bookverse-ivory/40 flex justify-between items-center text-xs">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 font-semibold text-bookverse-espresso/70 hover:text-bookverse-terracotta"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Browsing Catalog</span>
              </Link>
              <span className="text-bookverse-espresso/50">
                Pristine physical packaging guaranteed
              </span>
            </div>
          </div>

          {/* Cart Summary Card */}
          <div className="lg:col-span-4 bg-bookverse-cream rounded-2xl border border-bookverse-beige p-6 shadow-sm space-y-6 sticky top-28">
            <h2 className="font-serif text-xl font-bold text-bookverse-espresso pb-3 border-b border-bookverse-beige">
              Order Summary
            </h2>

            {/* Coupon Code Input */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-bookverse-sage block">
                Promotional Voucher
              </span>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-bookverse-sage-light border border-bookverse-sage/40 text-xs">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-bookverse-sage" />
                    <div>
                      <span className="font-bold text-bookverse-espresso">
                        {appliedCoupon.code}
                      </span>
                      <p className="text-[10px] text-bookverse-espresso/60">
                        {appliedCoupon.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-500 font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-bookverse-espresso/40" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. FIRSTBOOK"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-bookverse-beige bg-bookverse-ivory text-bookverse-espresso uppercase placeholder:normal-case focus:outline-none focus:border-bookverse-terracotta"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplying || !couponInput.trim()}
                    className="px-4 py-2 bg-bookverse-espresso text-bookverse-cream text-xs font-semibold rounded-xl hover:bg-bookverse-terracotta disabled:opacity-50 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-2.5 text-xs text-bookverse-espresso/80 pt-2 border-t border-bookverse-beige/70">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold">{formatINR(subtotal, true)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-bookverse-terracotta font-semibold">
                  <span>Coupon Deduction</span>
                  <span>-{formatINR(discount, true)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Pan-India Courier</span>
                <span className="font-semibold">
                  {shippingFee === 0 ? "FREE" : formatINR(shippingFee, true)}
                </span>
              </div>
              <div className="border-t border-bookverse-beige pt-3 flex justify-between text-base font-bold text-bookverse-espresso">
                <span>Total Amount</span>
                <span className="text-xl text-bookverse-terracotta">
                  {formatINR(grandTotal, true)}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              onClick={() => router.push("/checkout")}
              className="w-full py-3.5 px-6 rounded-xl bg-bookverse-terracotta text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-bookverse-terracotta-hover shadow-warm transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-[11px] text-bookverse-espresso/60 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-bookverse-sage" />
              <span>Razorpay 256-bit Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
