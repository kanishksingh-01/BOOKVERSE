import React from "react";
import Link from "next/link";
import { BookOpen, Sparkles, Feather, Heart, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Us – BookVerse | Independent Bookstore Philosophy",
  description: "Learn about BookVerse's literary heritage, curation ethos, and passion for the physical page.",
};

export default function AboutPage() {
  return (
    <div className="bg-bookverse-ivory min-h-screen py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold block">
            Our Literary Heritage
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-extrabold text-bookverse-espresso leading-tight">
            Every Book Opens a New World.
          </h1>
          <p className="text-base sm:text-lg text-bookverse-espresso/80 max-w-2xl mx-auto font-sans leading-relaxed">
            In an era of hyper-fast scrolling and fleeting attention, BookVerse is a slow, sensory sanctuary for the printed word.
          </p>
        </div>

        {/* Hero Image */}
        <div className="rounded-3xl overflow-hidden border border-bookverse-beige shadow-book aspect-[16/9] relative">
          <img
            src="https://images.unsplash.com/photo-1507842229451-7f01be777a26?w=1200&auto=format&fit=crop&q=80"
            alt="BookVerse Bookstore Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bookverse-espresso/60 via-transparent to-transparent flex items-end p-8">
            <p className="text-white font-serif italic text-sm sm:text-base">
              The flagship shelves at Bahrisons Lane, New Delhi.
            </p>
          </div>
        </div>

        {/* Narrative Chapters */}
        <div className="prose prose-stone max-w-none text-bookverse-espresso/90 space-y-8 font-sans leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-bookverse-espresso not-prose">
              The Curation Creed
            </h2>
            <p>
              We founded BookVerse with a simple, defiant premise: algorithms should not decide what you read next. Recommendation engines on global platforms push mass-market discounts and sponsored pulp. But literature is deeply personal. It is the aroma of paper off the press, the rhythmic syntax of Arundhati Roy, the vast Himalayan folklore captured by Ruskin Bond, or the architectural clarity of Martin Kleppmann&apos;s distributed systems.
            </p>
            <p>
              Every title that enters our catalogue has passed through human hands. We ask one fundamental question: <em>Will this book still matter a decade from now?</em> If the answer is yes, it earns its place on our shelves.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-bookverse-espresso not-prose">
              Physical Print as an Art Form
            </h2>
            <p>
              We believe a bookstore owes a duty of care to the physical object. When an order leaves our dispatch desk, it is protected with double-wall cardboard envelopes, custom jacket corners, and a signature letterpress bookmark. Our readers never receive a book with folded cover edges or bruised spines.
            </p>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 not-prose pt-4">
            <div className="bg-bookverse-cream border border-bookverse-beige rounded-2xl p-6 text-center space-y-2">
              <span className="font-serif text-3xl font-bold text-bookverse-terracotta block">
                30,000+
              </span>
              <span className="text-xs font-semibold text-bookverse-espresso">Books Hand-Wrapped</span>
            </div>
            <div className="bg-bookverse-cream border border-bookverse-beige rounded-2xl p-6 text-center space-y-2">
              <span className="font-serif text-3xl font-bold text-bookverse-terracotta block">
                100%
              </span>
              <span className="text-xs font-semibold text-bookverse-espresso">Authorized Editions</span>
            </div>
            <div className="bg-bookverse-cream border border-bookverse-beige rounded-2xl p-6 text-center space-y-2">
              <span className="font-serif text-3xl font-bold text-bookverse-terracotta block">
                500+
              </span>
              <span className="text-xs font-semibold text-bookverse-espresso">Indian Pin Codes Reached</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 sm:p-12 rounded-3xl bg-bookverse-espresso text-bookverse-cream text-center space-y-4 shadow-book">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Find Your Next Great Read
          </h3>
          <p className="text-xs sm:text-sm text-bookverse-cream/70 max-w-md mx-auto">
            Browse our literary fiction, non-fiction, philosophy, and computing shelves.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-bookverse-terracotta text-white font-semibold text-xs sm:text-sm hover:bg-bookverse-terracotta-hover transition-colors shadow-warm"
            >
              <span>Explore BookVerse Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
