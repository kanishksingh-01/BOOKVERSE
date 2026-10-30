"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Plus, Check, Trash2, ArrowLeft, Loader2, Home } from "lucide-react";
import { Address } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function CustomerAddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New address form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [postalCode, setPostalCode] = useState("560038");
  const [isDefault, setIsDefault] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/account/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
      }
    } catch (e) {
      console.error("Failed to load addresses", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !street || !city || !state || !postalCode) {
      toast.error("Please fill in all mandatory address fields");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          street,
          landmark,
          city,
          state,
          postalCode,
          country: "India",
          isDefault,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Delivery address saved successfully!");
        setIsAddOpen(false);
        fetchAddresses();
        // reset form
        setStreet("");
        setLandmark("");
      } else {
        toast.error(data.error || "Failed to save address");
      }
    } catch {
      toast.error("Network error saving address");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-bookverse-ivory min-h-screen py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold block mb-1">
              Account Preferences
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bookverse-espresso">
              Saved Delivery Addresses
            </h1>
            <p className="text-xs sm:text-sm text-bookverse-espresso/70 mt-1">
              Manage locations for seamless 1-click checkout.
            </p>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bookverse-terracotta text-white text-xs font-semibold hover:bg-bookverse-terracotta-hover transition-colors shadow-warm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Address</span>
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-bookverse-terracotta animate-spin mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-bookverse-cream border border-bookverse-beige rounded-2xl p-6 shadow-xs relative flex flex-col justify-between"
              >
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-bookverse-beige">
                    <span className="font-bold text-sm text-bookverse-espresso">
                      {addr.fullName}
                    </span>
                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-bookverse-sage-light text-bookverse-sage text-[10px] font-bold">
                        <Check className="w-3 h-3" />
                        <span>Default Address</span>
                      </span>
                    )}
                  </div>
                  <p className="text-bookverse-espresso/80">{addr.street}</p>
                  {addr.landmark && (
                    <p className="text-bookverse-espresso/60">Landmark: {addr.landmark}</p>
                  )}
                  <p className="text-bookverse-espresso/80">
                    {addr.city}, {addr.state} - {addr.postalCode}
                  </p>
                  <p className="text-bookverse-espresso/70 pt-2 font-medium">
                    Phone: {addr.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Address Modal */}
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bookverse-espresso/60 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-bookverse-cream rounded-3xl border border-bookverse-beige shadow-2xl p-6 sm:p-8 space-y-4">
              <h3 className="font-serif text-xl font-bold text-bookverse-espresso">
                Add New Delivery Address
              </h3>

              <form onSubmit={handleCreateAddress} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                    Flat / House No. & Street *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Flat 402, Lotus Residency, 14th Main"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Bengaluru"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Karnataka"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="560038"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="Near Metro Station"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="w-4 h-4 rounded text-bookverse-terracotta border-bookverse-beige focus:ring-bookverse-terracotta"
                  />
                  <span className="font-medium text-bookverse-espresso">
                    Set as default shipping address
                  </span>
                </label>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-bookverse-beige text-xs font-semibold text-bookverse-espresso"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 rounded-xl bg-bookverse-terracotta text-white text-xs font-semibold hover:bg-bookverse-terracotta-hover disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Address"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
