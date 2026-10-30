"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  IndianRupee,
  ShoppingBag,
  Users,
  BookOpen,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Plus,
} from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const res = await fetch("/api/admin/metrics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Failed to load metrics", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchMetrics();
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Error updating order");
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-8 h-8 text-bookverse-terracotta animate-spin mx-auto" />
        <p className="text-xs text-bookverse-espresso/60 mt-3">Loading store telemetry...</p>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalBooks: 0,
    lowStockCount: 0,
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold block mb-1">
            Store Performance
          </span>
          <h1 className="font-serif text-3xl font-bold text-bookverse-espresso">
            Executive Overview
          </h1>
        </div>

        <div className="flex gap-2.5">
          <Link
            href="/admin/books"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-bookverse-terracotta text-white text-xs font-semibold hover:bg-bookverse-terracotta-hover shadow-warm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Book</span>
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-bookverse-beige bg-bookverse-cream text-xs font-semibold text-bookverse-espresso hover:bg-bookverse-ivory transition-colors"
          >
            <span>All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Sales */}
        <div className="bg-bookverse-cream border border-bookverse-beige rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-bookverse-terracotta">
            <span className="text-xs font-bold uppercase tracking-wider text-bookverse-sage">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-bookverse-terracotta/10 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-bookverse-espresso">
            {formatINR(metrics.totalSales, true)}
          </p>
          <span className="text-[11px] text-bookverse-sage font-medium">Verified Paid Volume</span>
        </div>

        {/* Total Orders */}
        <div className="bg-bookverse-cream border border-bookverse-beige rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-bookverse-espresso">
            <span className="text-xs font-bold uppercase tracking-wider text-bookverse-sage">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-bookverse-espresso/10 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-bookverse-espresso" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-bookverse-espresso">
            {metrics.totalOrders}
          </p>
          <span className="text-[11px] text-bookverse-espresso/60 font-medium">
            Lifetime orders recorded
          </span>
        </div>

        {/* Total Customers */}
        <div className="bg-bookverse-cream border border-bookverse-beige rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-bookverse-sage">
            <span className="text-xs font-bold uppercase tracking-wider text-bookverse-sage">
              Customers
            </span>
            <div className="w-8 h-8 rounded-lg bg-bookverse-sage/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-bookverse-sage" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-bookverse-espresso">
            {metrics.totalCustomers}
          </p>
          <span className="text-[11px] text-bookverse-espresso/60 font-medium">
            Registered reader accounts
          </span>
        </div>

        {/* Total Books */}
        <div className="bg-bookverse-cream border border-bookverse-beige rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-bookverse-espresso">
            <span className="text-xs font-bold uppercase tracking-wider text-bookverse-sage">
              Catalogue Titles
            </span>
            <div className="w-8 h-8 rounded-lg bg-bookverse-espresso/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-bookverse-espresso" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-bookverse-espresso">
            {metrics.totalBooks}
          </p>
          <span className="text-[11px] text-bookverse-espresso/60 font-medium">
            Active curated works
          </span>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-bookverse-cream border border-bookverse-beige rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Low Stock Alert
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <p className="font-serif text-2xl font-bold text-amber-700">
            {metrics.lowStockCount}
          </p>
          <span className="text-[11px] text-amber-600 font-medium">Titles under 15 copies</span>
        </div>
      </div>

      {/* Low Stock Section */}
      {data?.lowStockBooks?.length > 0 && (
        <div className="bg-bookverse-cream border border-amber-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="font-serif text-lg font-bold text-bookverse-espresso">
                Inventory Requiring Restock Attention
              </h2>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-semibold text-bookverse-terracotta hover:underline flex items-center gap-1"
            >
              <span>Manage all stock</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.lowStockBooks.map((b: any) => (
              <div
                key={b.id}
                className="bg-bookverse-ivory rounded-xl border border-bookverse-beige p-3 flex items-center gap-3"
              >
                <img
                  src={b.coverImage}
                  alt={b.title}
                  className="w-10 h-14 object-cover rounded shadow-xs shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-serif font-bold text-xs text-bookverse-espresso truncate">
                    {b.title}
                  </h4>
                  <p className="text-[11px] text-red-600 font-bold mt-0.5">
                    {b.stock} copies remaining
                  </p>
                  <p className="text-[10px] text-bookverse-espresso/60">
                    {formatINR(b.sellingPrice, true)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="bg-bookverse-cream border border-bookverse-beige rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-bookverse-beige">
          <div>
            <h2 className="font-serif text-xl font-bold text-bookverse-espresso">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-bookverse-espresso/60">
              Live incoming orders requiring packing and dispatch verification.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-bookverse-terracotta hover:underline"
          >
            View All Orders
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-bookverse-ivory/80 text-bookverse-espresso/70 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="p-3.5 rounded-l-xl">Order #</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 rounded-r-xl text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bookverse-beige/60">
              {data?.recentOrders?.map((order: any) => (
                <tr key={order.id} className="hover:bg-bookverse-ivory/50 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-bookverse-espresso">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="hover:text-bookverse-terracotta underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-bookverse-espresso">{order.customerName}</p>
                    <p className="text-[10px] text-bookverse-espresso/60">{order.customerEmail}</p>
                  </td>
                  <td className="p-3.5 text-bookverse-espresso/70">{formatDate(order.createdAt)}</td>
                  <td className="p-3.5 font-serif font-bold text-bookverse-espresso">
                    {formatINR(order.total, true)}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.paymentStatus === "PAID"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-bookverse-sage-light text-bookverse-sage">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {order.status === "CONFIRMED" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, "PROCESSING")}
                          className="px-2 py-1 rounded bg-bookverse-espresso text-white text-[10px] font-semibold hover:bg-bookverse-terracotta"
                        >
                          Mark Packing
                        </button>
                      )}
                      {order.status === "PROCESSING" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, "SHIPPED")}
                          className="px-2 py-1 rounded bg-blue-600 text-white text-[10px] font-semibold hover:bg-blue-700"
                        >
                          Mark Shipped
                        </button>
                      )}
                      {order.status === "SHIPPED" && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, "DELIVERED")}
                          className="px-2 py-1 rounded bg-emerald-600 text-white text-[10px] font-semibold hover:bg-emerald-700"
                        >
                          Mark Delivered
                        </button>
                      )}
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="p-1 text-bookverse-espresso/60 hover:text-bookverse-espresso"
                        title="View details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
