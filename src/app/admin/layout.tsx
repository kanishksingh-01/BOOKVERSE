"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  ShoppingBag,
  Boxes,
  Users,
  Tag,
  MessageSquare,
  ArrowLeft,
  ShieldAlert,
  Loader2,
  Store,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Books & Titles", href: "/admin/books", icon: BookOpen },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Orders & Shipments", href: "/admin/orders", icon: ShoppingBag },
    { label: "Inventory Audit", href: "/admin/inventory", icon: Boxes },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Coupons & Offers", href: "/admin/coupons", icon: Tag },
    { label: "Reader Reviews", href: "/admin/reviews", icon: MessageSquare },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bookverse-ivory flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-bookverse-terracotta animate-spin" />
      </div>
    );
  }

  // Role-based protection: User must be signed in with role ADMIN
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-[80vh] bg-bookverse-ivory flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-bookverse-cream border border-bookverse-beige rounded-3xl p-8 text-center space-y-4 shadow-book">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-bookverse-espresso">
            Restricted Admin Area
          </h1>
          <p className="text-xs text-bookverse-espresso/70 leading-relaxed font-sans">
            Only designated BookVerse administrators have clearance to view inventory metrics, moderate customer orders, and alter book metadata.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full py-2.5 rounded-xl bg-bookverse-espresso text-bookverse-cream text-xs font-semibold hover:bg-bookverse-terracotta transition-colors"
            >
              Sign In as Admin
            </Link>
            <Link
              href="/"
              className="w-full py-2.5 rounded-xl border border-bookverse-beige text-xs font-semibold text-bookverse-espresso hover:bg-bookverse-ivory"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4EFE6] flex flex-col lg:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full lg:w-64 bg-bookverse-espresso text-bookverse-cream p-5 shrink-0 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Logo / Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-bookverse-terracotta flex items-center justify-center text-white font-bold text-sm">
                BV
              </div>
              <div>
                <h2 className="font-serif font-bold text-base text-white tracking-tight leading-none">
                  BookVerse
                </h2>
                <span className="text-[10px] text-bookverse-sage uppercase tracking-wider font-semibold">
                  Admin Console
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? "bg-bookverse-terracotta text-white shadow-sm"
                      : "text-bookverse-cream/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Storefront link */}
        <div className="pt-6 border-t border-white/10 space-y-2">
          <div className="px-3 py-2 rounded-xl bg-white/5 text-[11px] text-bookverse-cream/80">
            <p className="font-semibold truncate">{user.name}</p>
            <p className="text-[10px] text-bookverse-cream/50 truncate">{user.email}</p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-bookverse-cream/70 hover:text-white transition-colors"
          >
            <Store className="w-4 h-4" />
            <span>View Public Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Canvas */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
