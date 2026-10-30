"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  ShieldCheck,
  CreditCard,
  MapPin,
  Loader2,
} from "lucide-react";
import { Order } from "@/types";
import { formatINR, formatDate } from "@/lib/utils";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/account/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        }
      } catch (e) {
        console.error("Failed to load order details", e);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-bookverse-ivory min-h-[70vh] flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-bookverse-terracotta animate-spin mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-bookverse-ivory min-h-[70vh] flex items-center justify-center py-20 px-4">
        <div className="max-w-md text-center space-y-4">
          <h2 className="font-serif text-2xl font-bold text-bookverse-espresso">
            Order Not Found
          </h2>
          <p className="text-xs text-bookverse-espresso/70">
            We could not locate this order in our records.
          </p>
          <Link
            href="/account/orders"
            className="inline-block px-5 py-2.5 rounded-xl bg-bookverse-espresso text-bookverse-cream text-xs font-semibold"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  // Tracking timeline status logic
  const steps = [
    { label: "Order Placed", done: true, current: order.status === "PENDING" },
    {
      label: "Payment Verified",
      done: order.paymentStatus === "PAID" || order.paymentMethod === "COD",
      current: order.status === "CONFIRMED",
    },
    {
      label: "Packaging & Quality Inspection",
      done: ["PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status),
      current: order.status === "PROCESSING",
    },
    {
      label: "Dispatched with Courier",
      done: ["SHIPPED", "DELIVERED"].includes(order.status),
      current: order.status === "SHIPPED",
    },
    {
      label: "Delivered",
      done: order.status === "DELIVERED",
      current: order.status === "DELIVERED",
    },
  ];

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="bg-bookverse-ivory min-h-screen py-10 sm:py-14 print:py-0 print:bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation & Print Action */}
        <div className="flex items-center justify-between print:hidden">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-bookverse-espresso/60 hover:text-bookverse-terracotta transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Order History</span>
          </Link>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-bookverse-beige bg-bookverse-cream text-xs font-semibold text-bookverse-espresso hover:bg-bookverse-ivory transition-colors"
          >
            <Printer className="w-4 h-4 text-bookverse-terracotta" />
            <span>Print Official Invoice</span>
          </button>
        </div>

        {/* Invoice Card */}
        <div className="bg-bookverse-cream border border-bookverse-beige rounded-3xl p-6 sm:p-10 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b border-bookverse-beige gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-bookverse-sage">
                Official BookVerse Tax Invoice
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-bookverse-espresso mt-1">
                Order #{order.orderNumber}
              </h1>
              <p className="text-xs text-bookverse-espresso/60 mt-1">
                Placed on {formatDate(order.createdAt)} &bull; Status:{" "}
                <span className="font-bold text-bookverse-terracotta">{order.status}</span>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-bookverse-terracotta">
                {formatINR(order.total, true)}
              </span>
              <p className="text-xs text-bookverse-espresso/60 mt-0.5">
                Paid via {order.paymentMethod === "COD" ? "Cash on Delivery" : "Razorpay Online"}
              </p>
              {order.razorpayPaymentId && (
                <p className="text-[10px] text-bookverse-espresso/50 font-mono">
                  Txn ID: {order.razorpayPaymentId}
                </p>
              )}
            </div>
          </div>

          {/* Shipment Tracking Timeline */}
          {order.status !== "CANCELLED" && (
            <div className="p-6 rounded-2xl bg-bookverse-ivory border border-bookverse-beige/70 print:hidden space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-bookverse-sage block">
                Courier Dispatch & Tracking Timeline
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {steps.map((st, i) => (
                  <div key={i} className="flex flex-col items-center text-center space-y-1.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        st.done
                          ? "bg-bookverse-sage text-white shadow-xs"
                          : "bg-bookverse-beige text-bookverse-espresso/40"
                      } ${st.current ? "ring-2 ring-bookverse-terracotta ring-offset-2" : ""}`}
                    >
                      {st.done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    <span
                      className={`text-[11px] leading-tight ${
                        st.done
                          ? "font-bold text-bookverse-espresso"
                          : "text-bookverse-espresso/40"
                      }`}
                    >
                      {st.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery & Customer Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-xl bg-bookverse-ivory border border-bookverse-beige/60 space-y-1">
              <span className="font-bold uppercase tracking-wider text-bookverse-sage flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-bookverse-terracotta" />
                <span>Shipping Address</span>
              </span>
              <p className="font-bold text-sm text-bookverse-espresso pt-1">
                {order.shippingAddress?.fullName || order.customerName}
              </p>
              <p className="text-bookverse-espresso/80">{order.shippingAddress?.street}</p>
              {order.shippingAddress?.landmark && (
                <p className="text-bookverse-espresso/60">{order.shippingAddress.landmark}</p>
              )}
              <p className="text-bookverse-espresso/80">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
                {order.shippingAddress?.postalCode}
              </p>
              <p className="text-bookverse-espresso/70 pt-1">
                Phone: {order.shippingAddress?.phone || order.customerPhone}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-bookverse-ivory border border-bookverse-beige/60 space-y-1">
              <span className="font-bold uppercase tracking-wider text-bookverse-sage flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-bookverse-terracotta" />
                <span>Payment & Invoicing Info</span>
              </span>
              <p className="text-bookverse-espresso/80 pt-1">
                <strong>Recipient:</strong> {order.customerName}
              </p>
              <p className="text-bookverse-espresso/80">
                <strong>Email:</strong> {order.customerEmail}
              </p>
              <p className="text-bookverse-espresso/80">
                <strong>Method:</strong> {order.paymentMethod} &bull;{" "}
                <span className="font-semibold text-bookverse-sage">{order.paymentStatus}</span>
              </p>
              <p className="text-bookverse-espresso/60 text-[11px] pt-1">
                GSTIN: 07AAACB2026B1Z3 (All Indian Books GST 0% Exempted)
              </p>
            </div>
          </div>

          {/* Ordered Items Table */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-bookverse-espresso">
              Purchased Books & Editions
            </h3>

            <div className="border border-bookverse-beige rounded-2xl overflow-hidden divide-y divide-bookverse-beige text-xs">
              <div className="p-3.5 bg-bookverse-ivory/80 font-bold uppercase tracking-wider text-bookverse-espresso/70 grid grid-cols-12 gap-4">
                <span className="col-span-7">Title & Author</span>
                <span className="col-span-2 text-center">Unit Price</span>
                <span className="col-span-1 text-center">Qty</span>
                <span className="col-span-2 text-right">Total</span>
              </div>

              {order.items.map((item) => (
                <div key={item.id} className="p-4 grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-7 flex items-center gap-3">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-10 h-14 object-cover rounded shadow-xs shrink-0"
                    />
                    <div>
                      <h4 className="font-serif font-bold text-sm text-bookverse-espresso">
                        {item.title}
                      </h4>
                      <p className="text-xs text-bookverse-espresso/60">by {item.author}</p>
                    </div>
                  </div>

                  <div className="col-span-2 text-center text-bookverse-espresso/80 font-medium">
                    {formatINR(item.price, true)}
                  </div>

                  <div className="col-span-1 text-center font-bold text-bookverse-espresso">
                    {item.quantity}
                  </div>

                  <div className="col-span-2 text-right font-serif font-bold text-bookverse-espresso">
                    {formatINR(item.price * item.quantity, true)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="flex justify-end pt-4">
            <div className="w-full sm:w-72 space-y-2 text-xs text-bookverse-espresso/80">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold">{formatINR(order.subtotal, true)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-bookverse-terracotta font-semibold">
                  <span>Discount Applied</span>
                  <span>-{formatINR(order.discount, true)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Pan-India Courier</span>
                <span className="font-semibold">
                  {order.shippingFee === 0 ? "FREE" : formatINR(order.shippingFee, true)}
                </span>
              </div>
              <div className="border-t border-bookverse-beige pt-2 flex justify-between text-base font-bold text-bookverse-espresso">
                <span>Total Paid</span>
                <span className="text-xl text-bookverse-terracotta">
                  {formatINR(order.total, true)}
                </span>
              </div>
            </div>
          </div>

          {/* BookVerse Heritage Signoff */}
          <div className="pt-6 border-t border-bookverse-beige/70 text-center text-xs text-bookverse-espresso/60 space-y-1">
            <p className="font-serif italic text-sm text-bookverse-espresso">
              &ldquo;A reader lives a thousand lives before he dies. The man who never reads lives only one.&rdquo;
            </p>
            <p>Thank you for supporting independent Indian bookselling.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
