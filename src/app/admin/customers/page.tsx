"use client";

import React, { useState, useEffect } from "react";
import { Users, Mail, Phone, Calendar, ShoppingBag, Loader2 } from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await fetch("/api/admin/customers");
        if (res.ok) {
          const data = await res.json();
          setCustomers(data.customers || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold block mb-1">
          Reader Community
        </span>
        <h1 className="font-serif text-3xl font-bold text-bookverse-espresso">
          Registered Customers
        </h1>
        <p className="text-xs text-bookverse-espresso/60">
          View member registration data, order history metrics, and lifetime reader spend.
        </p>
      </div>

      <div className="bg-bookverse-cream border border-bookverse-beige rounded-3xl p-6 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-bookverse-terracotta animate-spin mx-auto" />
          </div>
        ) : customers.length === 0 ? (
          <div className="py-16 text-center text-bookverse-espresso/60 space-y-2">
            <Users className="w-10 h-10 mx-auto text-bookverse-espresso/30" />
            <p className="font-semibold text-sm">No registered customers found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bookverse-ivory/80 text-bookverse-espresso/70 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Customer Name</th>
                  <th className="p-3.5">Email Address</th>
                  <th className="p-3.5">Phone</th>
                  <th className="p-3.5">Member Since</th>
                  <th className="p-3.5 text-center">Total Orders</th>
                  <th className="p-3.5 rounded-r-xl text-right">Lifetime Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bookverse-beige/60">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-bookverse-ivory/50 transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-bookverse-terracotta text-white flex items-center justify-center font-bold text-xs uppercase">
                        {c.name.slice(0, 2)}
                      </div>
                      <span className="font-bold text-sm text-bookverse-espresso">
                        {c.name}
                      </span>
                    </td>

                    <td className="p-3.5 text-bookverse-espresso/80 font-mono text-[11px]">
                      {c.email}
                    </td>

                    <td className="p-3.5 text-bookverse-espresso/70">
                      {c.phone || "—"}
                    </td>

                    <td className="p-3.5 text-bookverse-espresso/70">
                      {formatDate(c.createdAt)}
                    </td>

                    <td className="p-3.5 text-center font-bold text-bookverse-espresso">
                      {c.orderCount}
                    </td>

                    <td className="p-3.5 text-right font-serif font-bold text-bookverse-terracotta text-sm">
                      {formatINR(c.totalSpent, true)}
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
