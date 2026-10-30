"use client";

import React, { useState, useEffect } from "react";
import { Boxes, AlertTriangle, Check, RefreshCw, Loader2 } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [stockInputs, setStockInputs] = useState<Record<string, number>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const url = lowStockOnly ? "/api/admin/inventory?lowStock=true" : "/api/admin/inventory";
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setInventory(data.inventory || []);
        const initialInputs: Record<string, number> = {};
        (data.inventory || []).forEach((b: any) => {
          initialInputs[b.id] = b.stock;
        });
        setStockInputs(initialInputs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [lowStockOnly]);

  const handleUpdateStock = async (bookId: string) => {
    const newStock = stockInputs[bookId];
    if (newStock === undefined || isNaN(newStock)) return;

    setSavingId(bookId);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, newStock }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Inventory updated for "${data.book.title}"`);
        setInventory((prev) =>
          prev.map((b) => (b.id === bookId ? { ...b, stock: data.book.stock } : b))
        );
      } else {
        toast.error(data.error || "Failed to update stock");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold block mb-1">
            Warehouse Operations
          </span>
          <h1 className="font-serif text-3xl font-bold text-bookverse-espresso">
            Inventory & Stock Audit
          </h1>
          <p className="text-xs text-bookverse-espresso/60">
            Real-time physical copy count, restock alerts, and live stock adjustments.
          </p>
        </div>

        <label className="flex items-center gap-2 cursor-pointer bg-bookverse-cream border border-bookverse-beige px-4 py-2.5 rounded-xl shadow-xs text-xs font-semibold text-bookverse-espresso self-start sm:self-auto">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
            className="w-4 h-4 rounded text-bookverse-terracotta border-bookverse-beige focus:ring-bookverse-terracotta"
          />
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>Show Low Stock Only (&le; 20 copies)</span>
        </label>
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
                  <th className="p-3.5 rounded-l-xl">Book Title</th>
                  <th className="p-3.5">ISBN</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Current Stock</th>
                  <th className="p-3.5 rounded-r-xl text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bookverse-beige/60">
                {inventory.map((book) => {
                  const isLow = book.stock <= 15;
                  const isOut = book.stock <= 0;
                  return (
                    <tr key={book.id} className="hover:bg-bookverse-ivory/50 transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-8 h-12 object-cover rounded shadow-xs shrink-0"
                        />
                        <div>
                          <p className="font-serif font-bold text-sm text-bookverse-espresso">
                            {book.title}
                          </p>
                          <p className="text-[11px] text-bookverse-espresso/60">by {book.author}</p>
                        </div>
                      </td>

                      <td className="p-3.5 font-mono text-[11px] text-bookverse-espresso/80">
                        {book.isbn}
                      </td>

                      <td className="p-3.5 text-bookverse-espresso/70">{book.category?.name}</td>

                      <td className="p-3.5 font-serif font-bold text-bookverse-espresso">
                        {formatINR(book.sellingPrice, true)}
                      </td>

                      <td className="p-3.5 font-bold">
                        {isOut ? (
                          <span className="text-red-600 font-extrabold uppercase text-[10px]">
                            Out of Stock (0)
                          </span>
                        ) : isLow ? (
                          <span className="text-amber-600 font-bold">
                            {book.stock} copies (Low)
                          </span>
                        ) : (
                          <span className="text-bookverse-sage font-medium">
                            {book.stock} copies
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <input
                            type="number"
                            min="0"
                            value={stockInputs[book.id] ?? book.stock}
                            onChange={(e) =>
                              setStockInputs({
                                ...stockInputs,
                                [book.id]: parseInt(e.target.value, 10),
                              })
                            }
                            className="w-16 px-2 py-1 text-xs rounded-lg border border-bookverse-beige bg-bookverse-ivory text-center font-bold text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                          />
                          <button
                            onClick={() => handleUpdateStock(book.id)}
                            disabled={savingId === book.id}
                            className="px-3 py-1 rounded-lg bg-bookverse-espresso text-white text-[11px] font-semibold hover:bg-bookverse-terracotta disabled:opacity-50 transition-colors flex items-center gap-1"
                          >
                            {savingId === book.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Check className="w-3 h-3" />
                            )}
                            <span>Save</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
