import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Coffee } from "lucide-react";

export default function CuratedBanner() {
  return (
    <section className="py-16 bg-bookverse-espresso text-bookverse-cream overflow-hidden relative">
      {/* Background graphic elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-bookverse-terracotta/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-bookverse-sage/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-bookverse-charcoal/60 border border-white/10 rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 backdrop-blur-sm">
          <div className="max-w-xl space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bookverse-terracotta/20 text-bookverse-terracotta text-xs font-semibold uppercase tracking-wider">
              <Coffee className="w-3.5 h-3.5" />
              <span>The Monsoon & Winter Reading List</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
              Books Best Accompanied by a Warm Pot of Masala Chai
            </h2>

            <p className="text-sm sm:text-base text-bookverse-cream/70 font-sans leading-relaxed">
              From the misty hills of Mussoorie in Ruskin Bond&apos;s memoirs to the haunting waters of Kerala in Roy&apos;s prose, discover our curators&apos; most beloved slow-reading literature.
            </p>

            <div className="pt-2">
              <Link
                href="/shop?category=fiction"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-bookverse-terracotta text-white font-semibold text-sm hover:bg-bookverse-terracotta-hover transition-colors shadow-warm"
              >
                <span>Browse The Monsoon List</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="flex -space-x-8 sm:-space-x-12 shrink-0">
            <div className="w-28 sm:w-36 aspect-[2/3] rounded-lg shadow-2xl overflow-hidden -rotate-6 transform hover:rotate-0 transition-transform duration-300 border-2 border-white/20">
              <img
                src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80"
                alt="Book 1"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-32 sm:w-40 aspect-[2/3] rounded-lg shadow-2xl overflow-hidden z-10 -translate-y-3 transform hover:translate-y-0 transition-transform duration-300 border-2 border-white/30">
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80"
                alt="Book 2"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-28 sm:w-36 aspect-[2/3] rounded-lg shadow-2xl overflow-hidden rotate-6 transform hover:rotate-0 transition-transform duration-300 border-2 border-white/20">
              <img
                src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&auto=format&fit=crop&q=80"
                alt="Book 3"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
