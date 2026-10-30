"use client";

import React from "react";
import Link from "next/link";
import { Package, MapPin, Heart, ShieldCheck, User, LogOut, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

export default function AccountPage() {
  const { user, logout } = useAuth();
  const { itemCount: wishlistCount } = useWishlist();

  if (!user) {
    return (
      <div className="bg-bookverse-ivory min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-bookverse-cream border border-bookverse-beige rounded-3xl p-8 text-center space-y-4">
          <h2 className="font-serif text-2xl font-bold text-bookverse-espresso">
            Reader Sign In Required
          </h2>
          <p className="text-xs text-bookverse-espresso/70">
            Please sign in to view your past orders, delivery addresses, and saved wishlists.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-block px-6 py-3 rounded-xl bg-bookverse-terracotta text-white font-semibold text-xs shadow-warm"
            >
              Sign In to Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Order History",
      description: "Track shipments, view detailed invoices, and check courier delivery status.",
      href: "/account/orders",
      icon: Package,
    },
    {
      title: "Saved Delivery Addresses",
      description: "Manage your default home, office, and secondary courier addresses across India.",
      href: "/account/addresses",
      icon: MapPin,
    },
    {
      title: "Reading Wishlist",
      description: `View your ${wishlistCount} saved titles and move them into your active reading satchel.`,
      href: "/wishlist",
      icon: Heart,
    },
  ];

  return (
    <div className="bg-bookverse-ivory min-h-screen py-10 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* User Card */}
        <div className="bg-bookverse-cream border border-bookverse-beige rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-bookverse-espresso text-bookverse-cream flex items-center justify-center text-xl font-bold uppercase shrink-0">
              {user.name.slice(0, 2)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-bookverse-espresso">
                  {user.name}
                </h1>
                {user.role === "ADMIN" && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-bookverse-terracotta text-white">
                    Administrator
                  </span>
                )}
              </div>
              <p className="text-xs text-bookverse-espresso/70 font-mono">{user.email}</p>
              {user.phone && (
                <p className="text-xs text-bookverse-espresso/60">{user.phone}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="px-4 py-2.5 rounded-xl bg-bookverse-espresso text-white text-xs font-semibold hover:bg-bookverse-terracotta transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-bookverse-terracotta" />
                <span>Admin Console</span>
              </Link>
            )}
            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-xl border border-bookverse-beige text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <Link
                key={i}
                href={c.href}
                className="bg-bookverse-cream border border-bookverse-beige rounded-2xl p-6 shadow-xs hover:border-bookverse-terracotta/40 hover:shadow-warm transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-bookverse-terracotta/10 text-bookverse-terracotta flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-bookverse-espresso group-hover:text-bookverse-terracotta transition-colors mb-1">
                    {c.title}
                  </h3>
                  <p className="text-xs text-bookverse-espresso/70 leading-relaxed font-sans">
                    {c.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-bookverse-beige flex items-center gap-1 text-xs font-bold text-bookverse-terracotta">
                  <span>Open</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
