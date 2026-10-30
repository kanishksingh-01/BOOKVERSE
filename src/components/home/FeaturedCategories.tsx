import React from "react";
import Link from "next/link";
import { ArrowRight, BookMarked } from "lucide-react";

interface CategoryItem {
  name: string;
  slug: string;
  description: string;
  image: string;
  bookCount?: number;
}

interface FeaturedCategoriesProps {
  categories: CategoryItem[];
}

export default function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  return (
    <section className="py-16 sm:py-20 bg-bookverse-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold block mb-2">
              Browse By Section
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bookverse-espresso">
              Curated Shelves & Genres
            </h2>
          </div>
          <Link
            href="/shop"
            className="mt-4 md:mt-0 text-sm font-semibold text-bookverse-terracotta hover:underline flex items-center gap-1 group"
          >
            <span>View all 11 categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.slice(0, 6).map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col bg-bookverse-cream rounded-xl border border-bookverse-beige overflow-hidden hover:shadow-book-hover transition-all duration-300"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-bookverse-beige/20 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bookverse-espresso/60 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 text-[10px] text-white/90 font-medium bg-black/30 px-2 py-0.5 rounded backdrop-blur-xs">
                  {cat.bookCount ? `${cat.bookCount} books` : "Curated collection"}
                </span>
              </div>
              <div className="p-3 text-center flex-1 flex flex-col justify-center">
                <h3 className="font-serif text-sm font-bold text-bookverse-espresso group-hover:text-bookverse-terracotta transition-colors truncate">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
