import React from "react";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "BookVerse feels like walking into an old European bookshop tucked in the lanes of Lodhi Colony. The book selection is impeccably literary, and the parcel arrived with a handcrafted bookmark and pristine corners.",
      author: "Ananya Deshmukh",
      role: "Member, Delhi Reading Circle",
      city: "New Delhi",
      rating: 5,
    },
    {
      quote:
        "Finding high-quality editions of Martin Kleppmann and classic translated Indian fiction in one seamless checkout was a delightful surprise. Razorpay checkout was lightning fast.",
      author: "Vikram Sengupta",
      role: "Software Architect & Bibliophile",
      city: "Bengaluru",
      rating: 5,
    },
    {
      quote:
        "The editorial curation here is leagues ahead of mega-retailers. Their staff picks introduced me to Keigo Higashino and Chitra Divakaruni. I refuse to buy books anywhere else now.",
      author: "Rituja Nair",
      role: "Literature Professor",
      city: "Kochi",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-bookverse-ivory border-b border-bookverse-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold">
            Reader Reflections
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bookverse-espresso">
            From Fellow Book Lovers
          </h2>
          <p className="text-sm text-bookverse-espresso/70">
            Real stories and notes left by readers across the subcontinent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-bookverse-cream rounded-2xl p-7 border border-bookverse-beige relative flex flex-col justify-between shadow-sm hover:shadow-book transition-shadow"
            >
              <div>
                <Quote className="w-8 h-8 text-bookverse-terracotta/30 mb-4" />
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="font-serif italic text-sm text-bookverse-espresso/90 leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-bookverse-beige/60">
                <h4 className="font-sans font-bold text-sm text-bookverse-espresso">
                  {t.author}
                </h4>
                <p className="text-xs text-bookverse-espresso/60">
                  {t.role} &bull; {t.city}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
