"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, ArrowRight, Clock, ShieldCheck, ChevronRight, Loader2 } from "lucide-react";
import { Order } from "@/types";
import { formatINR, formatDate } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/account/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (e) {
        console.error("Failed to load orders", e);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "SHIPPED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "PROCESSING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "CONFIRMED":
        return "bg-bookverse-sage-light text-bookverse-sage border-bookverse-sage/40";
      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-bookverse-beige text-bookverse-espresso border-bookverse-beige";
    }
  };

  return (
    <div className="bg-bookverse-ivory min-h-screen py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold block mb-1">
            Customer Dashboard
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bookverse-espresso">
            Your Order History
          </h1>
          <p className="text-xs sm:text-sm text-bookverse-espresso/70 mt-1">
            Track past shipments, view payment receipts, and re-order literary favorites.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-bookverse-terracotta animate-spin mx-auto" />
            <p className="text-xs text-bookverse-espresso/60 mt-3">Loading your past orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-bookverse-cream border border-bookverse-beige rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-bookverse-ivory border border-bookverse-beige flex items-center justify-center text-bookverse-espresso/40">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg font-bold text-bookverse-espresso">
              No orders placed yet
            </h3>
            <p className="text-xs text-bookverse-espresso/60 leading-relaxed font-sans">
              You haven&apos;t placed any orders yet. Once you order books, you can track courier progress and view tax invoices here.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-bookverse-terracotta text-white text-xs font-semibold hover:bg-bookverse-terracotta-hover transition-colors shadow-warm"
              >
                <span>Browse The Shelves</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-bookverse-cream border border-bookverse-beige rounded-2xl p-6 shadow-xs space-y-4 hover:border-bookverse-terracotta/40 transition-colors"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-bookverse-beige/70 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-bookverse-espresso">
                        #{order.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-bookverse-ivory border border-bookverse-beige text-bookverse-espresso/70">
                        {order.paymentMethod === "COD" ? "Cash on Delivery" : "Razorpay Online"}
                      </span>
                    </div>
                    <p className="text-xs text-bookverse-espresso/60 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Placed on {formatDate(order.createdAt)}</span>
                    </p>
                  </div>

                  <div className="text-right sm:self-auto self-start">
                    <span className="font-serif text-lg font-bold text-bookverse-terracotta">
                      {formatINR(order.total, true)}
                    </span>
                    <p className="text-[10px] text-bookverse-espresso/60">
                      {order.items.length} {order.items.length === 1 ? "title" : "titles"}
                    </p>
                  </div>
                </div>

                {/* Items Mini Preview */}
                <div className="flex flex-wrap items-center gap-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 text-xs">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="w-8 h-12 object-cover rounded shadow-xs shrink-0"
                      />
                      <span className="truncate max-w-[140px] font-medium text-bookverse-espresso">
                        {item.title}
                      </span>
                      <span className="text-bookverse-espresso/50">&times; {item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Actions Footer */}
                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="text-bookverse-sage text-[11px] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Payment: {order.paymentStatus}</span>
                  </span>

                  <Link
                    href={`/account/orders/${order.id}`}
                    className="inline-flex items-center gap-1 font-semibold text-bookverse-terracotta hover:underline"
                  >
                    <span>View Tracking & Full Invoice</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
