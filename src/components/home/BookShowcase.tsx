import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Book } from "@/types";
import BookCard from "@/components/books/BookCard";

interface BookShowcaseProps {
  title: string;
  subtitle: string;
  badge?: string;
  books: Book[];
  viewAllHref?: string;
}

export default function BookShowcase({
  title,
  subtitle,
  badge,
  books,
  viewAllHref = "/shop",
}: BookShowcaseProps) {
  if (!books || books.length === 0) return null;

  return (
    <section className="py-14 sm:py-18 bg-bookverse-ivory border-b border-bookverse-beige/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div className="space-y-1">
            {badge && (
              <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold block mb-1">
                {badge}
              </span>
            )}
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-bookverse-espresso">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-bookverse-espresso/70 font-sans">
              {subtitle}
            </p>
          </div>

          <Link
            href={viewAllHref}
            className="mt-4 sm:mt-0 text-xs sm:text-sm font-semibold text-bookverse-terracotta hover:underline flex items-center gap-1 group shrink-0"
          >
            <span>View Shelf</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.slice(0, 4).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
}
