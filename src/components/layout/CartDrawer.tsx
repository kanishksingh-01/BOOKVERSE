"use client";

import React, { useState } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    shippingFee,
    grandTotal,
    appliedCoupon,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const router = useRouter();

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    await applyCoupon(couponInput);
    setIsApplyingCoupon(false);
    setCouponInput("");
  };

  const freeShippingThreshold = 49900; // ₹499 in paise
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-bookverse-espresso/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-bookverse-cream border-l border-bookverse-beige shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-bookverse-beige flex items-center justify-between bg-bookverse-ivory">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-bookverse-terracotta" />
              <h2 className="font-serif text-xl font-bold text-bookverse-espresso">
                Reading Satchel ({itemCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1 rounded-full text-bookverse-espresso/60 hover:text-bookverse-espresso hover:bg-bookverse-beige/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Shipping Meter */}
          <div className="px-6 py-2.5 bg-bookverse-beige/30 border-b border-bookverse-beige/50 text-xs">
            {amountForFreeShipping > 0 ? (
              <p className="text-bookverse-espresso/80">
                Add{" "}
                <span className="font-bold text-bookverse-terracotta">
                  {formatINR(amountForFreeShipping, true)}
                </span>{" "}
                more to unlock <span className="font-semibold">Free Delivery</span>
              </p>
            ) : (
              <p className="text-bookverse-sage font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                You&apos;ve unlocked Free Pan-India Delivery!
              </p>
            )}
            <div className="w-full bg-bookverse-beige h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-bookverse-terracotta h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-bookverse-beige/60">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-bookverse-ivory border border-bookverse-beige flex items-center justify-center text-bookverse-espresso/40">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-bookverse-espresso">
                  Your satchel is empty
                </h3>
                <p className="text-xs text-bookverse-espresso/60 max-w-xs mx-auto">
                  Every book opens a new world. Explore our curated collections to find your next great read.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    router.push("/shop");
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-bookverse-espresso text-bookverse-cream text-xs font-semibold hover:bg-bookverse-terracotta transition-colors"
                >
                  <span>Explore Catalogue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  <Link
                    href={`/books/${item.book.slug}`}
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="shrink-0"
                  >
                    <img
                      src={item.book.coverImage}
                      alt={item.book.title}
                      className="w-16 h-22 object-cover rounded-md shadow-sm border border-bookverse-beige"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/books/${item.book.slug}`}
                          onClick={() => setIsCartDrawerOpen(false)}
                        >
                          <h4 className="font-serif text-sm font-semibold text-bookverse-espresso hover:text-bookverse-terracotta transition-colors line-clamp-1">
                            {item.book.title}
                          </h4>
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.bookId)}
                          className="text-bookverse-espresso/40 hover:text-red-500 p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-bookverse-espresso/60 -mt-0.5">{item.book.author}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-bookverse-beige rounded-lg bg-bookverse-ivory">
                        <button
                          onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                          className="p-1 hover:text-bookverse-terracotta transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-bookverse-espresso">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                          className="p-1 hover:text-bookverse-terracotta transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-sm font-bold text-bookverse-terracotta">
                          {formatINR(item.book.sellingPrice * item.quantity, true)}
                        </span>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-bookverse-espresso/50">
                            {formatINR(item.book.sellingPrice, true)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Calculations */}
          {items.length > 0 && (
            <div className="border-t border-bookverse-beige px-6 py-5 bg-bookverse-ivory space-y-4">
              {/* Coupon Row */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-bookverse-sage-light border border-bookverse-sage/30 text-xs text-bookverse-espresso">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-bookverse-sage" />
                    <div>
                      <span className="font-bold">{appliedCoupon.code}</span>
                      <p className="text-[10px] text-bookverse-espresso/70">
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
                      placeholder="Coupon Code (e.g. FIRSTBOOK)"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-bookverse-beige bg-bookverse-cream text-bookverse-espresso uppercase placeholder:normal-case focus:outline-none focus:border-bookverse-terracotta"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplyingCoupon || !couponInput.trim()}
                    className="px-4 py-2 bg-bookverse-espresso text-bookverse-cream text-xs font-semibold rounded-lg hover:bg-bookverse-terracotta disabled:opacity-50 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Totals Breakdown */}
              <div className="space-y-1.5 text-xs text-bookverse-espresso/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatINR(subtotal, true)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-bookverse-terracotta font-medium">
                    <span>Coupon Savings</span>
                    <span>-{formatINR(discount, true)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Pan-India Delivery</span>
                  <span>{shippingFee === 0 ? "FREE" : formatINR(shippingFee, true)}</span>
                </div>
                <div className="border-t border-bookverse-beige pt-2 flex justify-between text-sm font-bold text-bookverse-espresso">
                  <span>Grand Total</span>
                  <span className="text-base text-bookverse-terracotta font-bold">
                    {formatINR(grandTotal, true)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    router.push("/checkout");
                  }}
                  className="w-full py-3 bg-bookverse-terracotta text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-bookverse-terracotta-hover shadow-warm transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex justify-between text-xs">
                  <button
                    onClick={() => {
                      setIsCartDrawerOpen(false);
                      router.push("/cart");
                    }}
                    className="text-bookverse-espresso/70 hover:text-bookverse-espresso underline"
                  >
                    View Full Cart
                  </button>
                  <button
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="text-bookverse-espresso/70 hover:text-bookverse-espresso underline"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
