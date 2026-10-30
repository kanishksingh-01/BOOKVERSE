import React from "react";
import { BookMarked, Box, Truck, Users } from "lucide-react";

export default function WhyShopWithUs() {
  const pillars = [
    {
      icon: BookMarked,
      title: "Handpicked by Bibliophiles",
      description:
        "Every single title in our inventory has been carefully read, debated, and chosen by literary curators—never dictated by cold algorithms.",
    },
    {
      icon: Box,
      title: "Protected Jacket Packaging",
      description:
        "We package books with double-corrugated recyclable board and corner shields, ensuring your dust jackets and spines arrive without a single crease.",
    },
    {
      icon: Truck,
      title: "Express Pan-India Shipping",
      description:
        "Direct dispatch across all Indian PIN codes within 24 hours. Complimentary tracked courier delivery on all orders exceeding ₹499.",
    },
    {
      icon: Users,
      title: "Passionate Reading Circles",
      description:
        "Join monthly book clubs, exclusive author interviews, and verified reader critiques from India's most dedicated reading community.",
    },
  ];

  return (
    <section className="py-20 bg-bookverse-cream border-b border-bookverse-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold">
            The Independent Way
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bookverse-espresso">
            Why Readers Love BookVerse
          </h2>
          <p className="text-sm text-bookverse-espresso/70">
            A sanctuary for physical print, sensory bookmarks, and thoughtful storytelling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-bookverse-ivory rounded-2xl p-6 border border-bookverse-beige hover:border-bookverse-terracotta/40 hover:shadow-warm transition-all duration-300 flex flex-col items-start"
              >
                <div className="w-12 h-12 rounded-xl bg-bookverse-terracotta/10 text-bookverse-terracotta flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-bookverse-espresso mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-bookverse-espresso/70 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
