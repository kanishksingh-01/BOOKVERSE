import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen, Award, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream-texture pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-bookverse-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Editorial Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bookverse-terracotta/10 border border-bookverse-terracotta/20 text-bookverse-terracotta text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Independent Bookseller &bull; Est. New Delhi</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-bookverse-espresso leading-[1.15] tracking-tight">
              Find Stories That{" "}
              <span className="italic font-normal text-bookverse-terracotta">Stay With You.</span>
            </h1>

            <p className="text-base sm:text-lg text-bookverse-espresso/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
              Explore a thoughtfully curated collection of books that inspire, educate and transport you to another world. Hand-wrapped with love for Indian bibliophiles.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-bookverse-terracotta text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-bookverse-terracotta-hover shadow-warm transition-all"
              >
                <span>Explore Books</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop?sortBy=popularity"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-bookverse-cream text-bookverse-espresso border border-bookverse-beige font-semibold text-sm flex items-center justify-center gap-2 hover:bg-bookverse-beige/40 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-bookverse-espresso/60" />
                <span>Discover Bestsellers</span>
              </Link>
            </div>

            {/* Micro badges */}
            <div className="pt-6 border-t border-bookverse-beige/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-bookverse-espresso/70">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-bookverse-sage" />
                <span>100% Genuine Editions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-bookverse-sage" />
                <span>Free Shipping over ₹499</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-bookverse-terracotta" />
                <span>Award-Winning Curation</span>
              </div>
            </div>
          </div>

          {/* Right Visual Composition */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Decorative aura */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-bookverse-terracotta/20 to-bookverse-sage/20 blur-2xl opacity-60 -z-10" />

              {/* Main featured book card stack */}
              <div className="bg-bookverse-cream border border-bookverse-beige rounded-2xl p-5 shadow-book transition-transform hover:-translate-y-1 duration-300">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-bookverse-beige text-xs text-bookverse-espresso/60">
                  <span className="font-serif italic font-medium">Curator&apos;s Pick of the Month</span>
                  <span className="px-2 py-0.5 bg-bookverse-terracotta/10 text-bookverse-terracotta rounded font-semibold text-[10px]">
                    Man Booker Winner
                  </span>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-28 h-40 shrink-0 book-spine-effect rounded-lg overflow-hidden shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"
                      alt="The God of Small Things"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-bookverse-sage font-bold uppercase tracking-wider">
                      Literary Fiction
                    </span>
                    <h3 className="font-serif text-lg font-bold text-bookverse-espresso leading-snug">
                      The God of Small Things
                    </h3>
                    <p className="text-xs text-bookverse-espresso/70">Arundhati Roy</p>
                    <p className="text-xs text-bookverse-espresso/60 line-clamp-2">
                      A lyrical, heart-wrenching modern classic set in Ayemenem, Kerala.
                    </p>
                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-sm font-bold text-bookverse-terracotta">₹389</span>
                      <span className="text-xs text-bookverse-espresso/40 line-through">₹499</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-bookverse-beige/60 flex items-center justify-between">
                  <Link
                    href="/books/the-god-of-small-things"
                    className="text-xs font-semibold text-bookverse-espresso hover:text-bookverse-terracotta flex items-center gap-1"
                  >
                    <span>Read Book Preview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-[11px] text-bookverse-sage font-medium">
                    In Stock &bull; Ready to Ship
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
