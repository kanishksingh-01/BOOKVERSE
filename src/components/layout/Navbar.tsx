"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Search,
  Heart,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Package,
  LogOut,
  MapPin,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import SearchModal from "./SearchModal";

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { user, logout } = useAuth();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);

  const categories = [
    { name: "Fiction", href: "/categories/fiction" },
    { name: "Mystery & Thriller", href: "/categories/mystery-thriller" },
    { name: "Romance", href: "/categories/romance" },
    { name: "Fantasy", href: "/categories/fantasy" },
    { name: "Science Fiction", href: "/categories/science-fiction" },
    { name: "Self-Help", href: "/categories/self-help" },
    { name: "Business", href: "/categories/business" },
    { name: "Technology", href: "/categories/technology" },
    { name: "History & Biography", href: "/categories/history-biography" },
    { name: "Children", href: "/categories/children" },
  ];

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop All", href: "/shop" },
    { label: "Bestsellers", href: "/shop?sortBy=popularity" },
    { label: "Staff Picks", href: "/shop?staffPick=true" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-bookverse-ivory/95 backdrop-blur-md border-b border-bookverse-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-bookverse-espresso hover:bg-bookverse-beige/40 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 lg:flex-initial flex items-center justify-center lg:justify-start">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-bookverse-espresso flex items-center justify-center text-bookverse-cream group-hover:bg-bookverse-terracotta transition-colors shadow-sm">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-serif text-2xl font-bold tracking-tight text-bookverse-espresso group-hover:text-bookverse-terracotta transition-colors">
                    BookVerse
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-bookverse-sage font-medium -mt-1 hidden sm:block">
                    Independent Booksellers
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-bookverse-espresso">
              <Link
                href="/"
                className={`hover:text-bookverse-terracotta transition-colors py-1 ${
                  pathname === "/" ? "text-bookverse-terracotta font-semibold" : ""
                }`}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className={`hover:text-bookverse-terracotta transition-colors py-1 ${
                  pathname === "/shop" ? "text-bookverse-terracotta font-semibold" : ""
                }`}
              >
                Catalog
              </Link>

              {/* Categories Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsCategoriesDropdownOpen(true)}
                onMouseLeave={() => setIsCategoriesDropdownOpen(false)}
              >
                <button
                  className="flex items-center gap-1 hover:text-bookverse-terracotta transition-colors py-1"
                  onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                >
                  <span>Categories</span>
                  <ChevronDown className="w-4 h-4 text-bookverse-espresso/60" />
                </button>

                {isCategoriesDropdownOpen && (
                  <div className="absolute top-full left-0 w-64 bg-bookverse-cream border border-bookverse-beige rounded-xl shadow-xl py-3 px-2 z-50 grid grid-cols-1 gap-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        onClick={() => setIsCategoriesDropdownOpen(false)}
                        className="px-3 py-2 text-sm text-bookverse-espresso hover:bg-bookverse-ivory hover:text-bookverse-terracotta rounded-lg transition-colors flex items-center justify-between"
                      >
                        <span>{cat.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/shop?sortBy=popularity"
                className="hover:text-bookverse-terracotta transition-colors py-1"
              >
                Bestsellers
              </Link>
              <Link
                href="/shop?staffPick=true"
                className="hover:text-bookverse-terracotta transition-colors py-1"
              >
                Staff Picks
              </Link>
              <Link
                href="/about"
                className={`hover:text-bookverse-terracotta transition-colors py-1 ${
                  pathname === "/about" ? "text-bookverse-terracotta font-semibold" : ""
                }`}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`hover:text-bookverse-terracotta transition-colors py-1 ${
                  pathname === "/contact" ? "text-bookverse-terracotta font-semibold" : ""
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 rounded-full text-bookverse-espresso hover:bg-bookverse-beige/40 transition-colors"
                aria-label="Search BookVerse"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2.5 rounded-full text-bookverse-espresso hover:bg-bookverse-beige/40 transition-colors"
                aria-label="View Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-bookverse-terracotta text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative p-2.5 rounded-full text-bookverse-espresso hover:bg-bookverse-beige/40 transition-colors"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-bookverse-terracotta text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Account Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 p-2 rounded-full hover:bg-bookverse-beige/40 transition-colors text-bookverse-espresso"
                  aria-label="User Account"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border border-bookverse-beige"
                    />
                  ) : (
                    <UserIcon className="w-5 h-5" />
                  )}
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-bookverse-cream border border-bookverse-beige rounded-xl shadow-xl py-2 z-50 text-sm"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-bookverse-beige">
                          <p className="font-semibold text-bookverse-espresso truncate">{user.name}</p>
                          <p className="text-xs text-bookverse-espresso/60 truncate">{user.email}</p>
                          {user.role === "ADMIN" && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-bookverse-terracotta/20 text-bookverse-terracotta rounded">
                              Administrator
                            </span>
                          )}
                        </div>

                        {user.role === "ADMIN" && (
                          <Link
                            href="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-bookverse-terracotta font-medium hover:bg-bookverse-ivory transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Admin Portal</span>
                          </Link>
                        )}

                        <Link
                          href="/account/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-bookverse-espresso hover:bg-bookverse-ivory transition-colors"
                        >
                          <Package className="w-4 h-4" />
                          <span>My Orders</span>
                        </Link>

                        <Link
                          href="/account/addresses"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-bookverse-espresso hover:bg-bookverse-ivory transition-colors"
                        >
                          <MapPin className="w-4 h-4" />
                          <span>Saved Addresses</span>
                        </Link>

                        <Link
                          href="/wishlist"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-bookverse-espresso hover:bg-bookverse-ivory transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          <span>Saved Wishlist</span>
                        </Link>

                        <div className="border-t border-bookverse-beige mt-1 pt-1">
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-left transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2 border-b border-bookverse-beige">
                          <p className="font-medium text-bookverse-espresso">Welcome to BookVerse</p>
                          <p className="text-xs text-bookverse-espresso/60">
                            Sign in to track orders & save books
                          </p>
                        </div>
                        <Link
                          href="/login"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-bookverse-espresso font-semibold hover:bg-bookverse-ivory transition-colors"
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2 text-bookverse-terracotta font-medium hover:bg-bookverse-ivory transition-colors"
                        >
                          Create Free Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-bookverse-beige bg-bookverse-cream px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2 text-base font-medium rounded-lg px-3 ${
                  pathname === link.href
                    ? "bg-bookverse-beige/50 text-bookverse-terracotta"
                    : "text-bookverse-espresso hover:bg-bookverse-ivory"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-bookverse-beige">
              <span className="text-xs uppercase tracking-wider text-bookverse-sage font-bold px-3">
                Top Categories
              </span>
              <div className="grid grid-cols-2 gap-1 mt-2">
                {categories.slice(0, 6).map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm px-3 py-1.5 text-bookverse-espresso hover:text-bookverse-terracotta truncate"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {user?.role === "ADMIN" && (
              <div className="pt-3 border-t border-bookverse-beige">
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-bookverse-terracotta font-bold text-sm bg-bookverse-terracotta/10 rounded-lg"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Management Panel</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
