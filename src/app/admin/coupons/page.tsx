"use client";

import React, { useState, useEffect } from "react";
import { Tag, Plus, Check, X, Loader2, Calendar } from "lucide-react";
import { formatINR, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("15");
  const [minOrderRupees, setMinOrderRupees] = useState("499");
  const [maxDiscountRupees, setMaxDiscountRupees] = useState("150");
  const [validDays, setValidDays] = useState("90");
  const [isSaving, setIsSaving] = useState(false);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsSaving(true);
    try {
      const payload = {
        code: code.trim().toUpperCase(),
        description,
        discountType,
        discountValue:
          discountType === "PERCENTAGE"
            ? parseInt(discountValue, 10)
            : Math.round(parseFloat(discountValue) * 100),
        minOrderAmount: Math.round(parseFloat(minOrderRupees || "0") * 100),
        maxDiscountAmount:
          discountType === "PERCENTAGE" && maxDiscountRupees
            ? Math.round(parseFloat(maxDiscountRupees) * 100)
            : null,
        validUntil: new Date(Date.now() + parseInt(validDays, 10) * 24 * 60 * 60 * 1000),
      };

      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Voucher created successfully!");
        setIsModalOpen(false);
        setCode("");
        setDescription("");
        fetchCoupons();
      } else {
        toast.error(data.error || "Failed to create coupon");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold block mb-1">
            Promotional Engine
          </span>
          <h1 className="font-serif text-3xl font-bold text-bookverse-espresso">
            Coupons & Vouchers
          </h1>
          <p className="text-xs text-bookverse-espresso/60">
            Create percentage or flat monetary discount vouchers for campaigns and book clubs.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bookverse-terracotta text-white text-xs font-semibold hover:bg-bookverse-terracotta-hover shadow-warm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      <div className="bg-bookverse-cream border border-bookverse-beige rounded-3xl p-6 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-bookverse-terracotta animate-spin mx-auto" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bookverse-ivory/80 text-bookverse-espresso/70 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Coupon Code</th>
                  <th className="p-3.5">Discount Offer</th>
                  <th className="p-3.5">Min Order</th>
                  <th className="p-3.5">Usage Count</th>
                  <th className="p-3.5">Valid Until</th>
                  <th className="p-3.5 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bookverse-beige/60">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-bookverse-ivory/50 transition-colors">
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-sm text-bookverse-terracotta bg-bookverse-terracotta/10 px-2.5 py-1 rounded-lg">
                        {c.code}
                      </span>
                      <p className="text-[11px] text-bookverse-espresso/60 mt-1 max-w-xs">
                        {c.description}
                      </p>
                    </td>

                    <td className="p-3.5 font-bold text-bookverse-espresso">
                      {c.discountType === "PERCENTAGE"
                        ? `${c.discountValue}% OFF`
                        : `${formatINR(c.discountValue, true)} FLAT OFF`}
                    </td>

                    <td className="p-3.5 text-bookverse-espresso/80">
                      {formatINR(c.minOrderAmount, true)}
                    </td>

                    <td className="p-3.5 text-bookverse-espresso/80">
                      <span className="font-bold">{c.usedCount}</span> / {c.maxUses} uses
                    </td>

                    <td className="p-3.5 text-bookverse-espresso/70">
                      {formatDate(c.validUntil)}
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.isActive && new Date(c.validUntil) > new Date()
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {c.isActive && new Date(c.validUntil) > new Date() ? "ACTIVE" : "EXPIRED"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bookverse-espresso/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-bookverse-cream rounded-3xl border border-bookverse-beige shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-bookverse-beige">
              <h3 className="font-serif text-xl font-bold text-bookverse-espresso">
                Create Discount Voucher
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-bookverse-espresso/50 hover:text-bookverse-espresso"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                  Voucher Code *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. MONSOON20"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso uppercase font-mono font-bold focus:outline-none focus:border-bookverse-terracotta"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                  Description / Reader Hook
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 20% off all Indian fiction orders above ₹699"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={discountType}
                    onChange={(e: any) => setDiscountType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                    Value {discountType === "PERCENTAGE" ? "(%)" : "(₹)"} *
                  </label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === "PERCENTAGE" ? "15" : "100"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                    Min Cart Subtotal (₹)
                  </label>
                  <input
                    type="number"
                    value={minOrderRupees}
                    onChange={(e) => setMinOrderRupees(e.target.value)}
                    placeholder="499"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                  />
                </div>

                {discountType === "PERCENTAGE" && (
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                      Max Cap Discount (₹)
                    </label>
                    <input
                      type="number"
                      value={maxDiscountRupees}
                      onChange={(e) => setMaxDiscountRupees(e.target.value)}
                      placeholder="150"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                    />
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-bookverse-beige text-xs font-semibold text-bookverse-espresso"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-bookverse-terracotta text-white text-xs font-semibold hover:bg-bookverse-terracotta-hover disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Create Voucher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
