import React from "react";
import Link from "next/link";
import { BookOpen, Mail, Phone, MapPin, Heart, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-bookverse-espresso text-bookverse-cream/80 pt-16 pb-12 border-t border-bookverse-espresso/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-bookverse-beige/10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-bookverse-terracotta flex items-center justify-center text-white shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                BookVerse
              </span>
            </Link>
            <p className="text-sm text-bookverse-cream/70 max-w-sm leading-relaxed">
              Every Book Opens a New World. We are an independent, editorial online bookstore curated for discerning Indian bibliophiles, bringing timeless literature and modern discourse to your doorstep.
            </p>
            <div className="pt-2 text-xs text-bookverse-cream/60 space-y-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-bookverse-terracotta shrink-0" />
                <span>Bahrisons Lane, Khan Market, New Delhi, 110003</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-bookverse-terracotta shrink-0" />
                <span>curators@bookverse.in</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-bookverse-terracotta shrink-0" />
                <span>+91 (011) 2461-9876</span>
              </p>
            </div>
          </div>

          {/* Catalog Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-white text-base font-semibold">Curated Collections</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="hover:text-bookverse-terracotta transition-colors">
                  Full Catalogue
                </Link>
              </li>
              <li>
                <Link href="/categories/fiction" className="hover:text-bookverse-terracotta transition-colors">
                  Literary Fiction
                </Link>
              </li>
              <li>
                <Link href="/categories/history-biography" className="hover:text-bookverse-terracotta transition-colors">
                  History & Biographies
                </Link>
              </li>
              <li>
                <Link href="/categories/technology" className="hover:text-bookverse-terracotta transition-colors">
                  Technology & Systems
                </Link>
              </li>
              <li>
                <Link href="/categories/children" className="hover:text-bookverse-terracotta transition-colors">
                  Children&apos;s Stories
                </Link>
              </li>
              <li>
                <Link href="/shop?staffPick=true" className="hover:text-bookverse-terracotta transition-colors">
                  Bookseller Picks
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="font-serif text-white text-base font-semibold">Customer Care</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/account/orders" className="hover:text-bookverse-terracotta transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/account/addresses" className="hover:text-bookverse-terracotta transition-colors">
                  Saved Addresses
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-bookverse-terracotta transition-colors">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-bookverse-terracotta transition-colors">
                  Our Literary Heritage
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-bookverse-terracotta transition-colors">
                  Contact Curators
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Guarantee */}
          <div className="space-y-3">
            <h4 className="font-serif text-white text-base font-semibold">The BookVerse Promise</h4>
            <div className="space-y-2 text-xs text-bookverse-cream/70 leading-relaxed">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-bookverse-sage shrink-0 mt-0.5" />
                <span>100% Genuine Publisher Editions with pristine binding guarantee.</span>
              </div>
              <div className="flex items-start gap-2">
                <Heart className="w-4 h-4 text-bookverse-terracotta shrink-0 mt-0.5" />
                <span>Eco-friendly cardboard mailers that protect jacket corners.</span>
              </div>
            </div>
            <div className="pt-3">
              <span className="text-[11px] uppercase tracking-wider text-bookverse-beige/60 font-semibold block mb-2">
                Secure Indian Payments
              </span>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-bookverse-cream/90">
                <span className="px-2 py-1 bg-white/10 rounded">UPI</span>
                <span className="px-2 py-1 bg-white/10 rounded">RuPay</span>
                <span className="px-2 py-1 bg-white/10 rounded">Visa</span>
                <span className="px-2 py-1 bg-white/10 rounded">Mastercard</span>
                <span className="px-2 py-1 bg-white/10 rounded">NetBanking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-bookverse-cream/50 gap-4">
          <p>© {new Date().getFullYear()} BookVerse Booksellers Pvt. Ltd. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/about" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Shipping & Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
