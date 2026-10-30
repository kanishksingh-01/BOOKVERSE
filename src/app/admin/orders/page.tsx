"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  RotateCcw,
  Truck,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Order } from "@/types";
import { formatINR, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      const url =
        statusFilter === "ALL"
          ? "/api/admin/orders"
          : `/api/admin/orders?status=${statusFilter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success(`Order marked as ${status}`);
        fetchOrders();
      } else {
        toast.error("Failed to update order status");
      }
    } catch {
      toast.error("Network error");
    }
  };

  const handleRefund = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Are you sure you want to process a refund for Order #${orderNumber}?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "CANCELLED",
          paymentStatus: "REFUNDED",
        }),
      });
      if (res.ok) {
        toast.success("Order refunded and restocked!");
        fetchOrders();
      } else {
        toast.error("Failed to process refund");
      }
    } catch {
      toast.error("Error processing refund");
    }
  };

  const filteredOrders = orders.filter((o) => {
    return (
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold block mb-1">
          Fulfillment Operations
        </span>
        <h1 className="font-serif text-3xl font-bold text-bookverse-espresso">
          Orders & Shipments
        </h1>
        <p className="text-xs text-bookverse-espresso/60">
          Track packages, manage courier fulfillment, and process authorized refunds.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-bookverse-cream border border-bookverse-beige rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-bookverse-espresso/40 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order # or customer..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === status
                    ? "bg-bookverse-espresso text-white"
                    : "bg-bookverse-ivory text-bookverse-espresso/70 hover:bg-bookverse-beige"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-bookverse-cream border border-bookverse-beige rounded-3xl p-6 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-bookverse-terracotta animate-spin mx-auto" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-bookverse-espresso/60 space-y-2">
            <ShoppingBag className="w-10 h-10 mx-auto text-bookverse-espresso/30" />
            <p className="font-semibold text-sm">No orders matching this filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bookverse-ivory/80 text-bookverse-espresso/70 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Order #</th>
                  <th className="p-3.5">Customer & Destination</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Items</th>
                  <th className="p-3.5">Total (₹)</th>
                  <th className="p-3.5">Payment</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 rounded-r-xl text-right">Fulfillment Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bookverse-beige/60">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-bookverse-ivory/50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-bookverse-espresso">
                      <Link
                        href={`/account/orders/${order.id}`}
                        target="_blank"
                        className="hover:text-bookverse-terracotta underline flex items-center gap-1"
                      >
                        <span>{order.orderNumber}</span>
                        <ExternalLink className="w-3 h-3 text-bookverse-espresso/40" />
                      </Link>
                    </td>

                    <td className="p-3.5">
                      <p className="font-bold text-bookverse-espresso">{order.customerName}</p>
                      <p className="text-[10px] text-bookverse-espresso/60">{order.customerEmail}</p>
                      <p className="text-[10px] text-bookverse-espresso/50 truncate max-w-[160px]">
                        {order.shippingAddress?.city}, {order.shippingAddress?.state}
                      </p>
                    </td>

                    <td className="p-3.5 text-bookverse-espresso/70">{formatDate(order.createdAt)}</td>

                    <td className="p-3.5">
                      <span className="font-medium">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} books
                      </span>
                    </td>

                    <td className="p-3.5 font-serif font-bold text-bookverse-espresso">
                      {formatINR(order.total, true)}
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-0.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            order.paymentStatus === "PAID"
                              ? "bg-emerald-100 text-emerald-800"
                              : order.paymentStatus === "REFUNDED"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                        <p className="text-[9px] text-bookverse-espresso/50">
                          {order.paymentMethod}
                        </p>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-bookverse-sage-light text-bookverse-sage">
                        {order.status}
                      </span>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {order.status !== "PROCESSING" && order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, "PROCESSING")}
                            className="px-2 py-1 rounded bg-bookverse-espresso text-white text-[10px] font-semibold hover:bg-bookverse-terracotta"
                          >
                            Pack
                          </button>
                        )}
                        {order.status !== "SHIPPED" && order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, "SHIPPED")}
                            className="px-2 py-1 rounded bg-blue-600 text-white text-[10px] font-semibold hover:bg-blue-700"
                          >
                            Dispatch
                          </button>
                        )}
                        {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, "DELIVERED")}
                            className="px-2 py-1 rounded bg-emerald-600 text-white text-[10px] font-semibold hover:bg-emerald-700"
                          >
                            Delivered
                          </button>
                        )}
                        {order.status !== "CANCELLED" && order.paymentStatus === "PAID" && (
                          <button
                            onClick={() => handleRefund(order.id, order.orderNumber)}
                            className="px-2 py-1 rounded bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-semibold hover:bg-rose-100"
                          >
                            Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
