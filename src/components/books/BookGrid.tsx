import React from "react";
import { Book } from "@/types";
import BookCard from "./BookCard";
import { BookOpen } from "lucide-react";
import Link from "next/link";

interface BookGridProps {
  books: Book[];
  isLoading?: boolean;
  emptyMessage?: string;
  onClearFilters?: () => void;
}

export default function BookGrid({
  books,
  isLoading = false,
  emptyMessage = "No books found matching your current selection.",
  onClearFilters,
}: BookGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-bookverse-cream rounded-card border border-bookverse-beige p-4 space-y-4 animate-pulse"
          >
            <div className="aspect-[2/3] bg-bookverse-beige/40 rounded-lg w-full" />
            <div className="space-y-2">
              <div className="h-4 bg-bookverse-beige/60 rounded w-3/4" />
              <div className="h-3 bg-bookverse-beige/40 rounded w-1/2" />
            </div>
            <div className="pt-2 flex justify-between items-center">
              <div className="h-5 bg-bookverse-beige/50 rounded w-20" />
              <div className="h-8 bg-bookverse-beige/60 rounded w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="py-20 text-center bg-bookverse-cream border border-bookverse-beige rounded-2xl p-8 max-w-lg mx-auto space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-bookverse-ivory border border-bookverse-beige flex items-center justify-center text-bookverse-espresso/40">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-xl font-bold text-bookverse-espresso">
          No books in this shelf
        </h3>
        <p className="text-sm text-bookverse-espresso/70 leading-relaxed">
          {emptyMessage}
        </p>
        {onClearFilters ? (
          <button
            onClick={onClearFilters}
            className="px-5 py-2.5 rounded-full bg-bookverse-terracotta text-white text-xs font-semibold hover:bg-bookverse-terracotta-hover transition-colors shadow-sm"
          >
            Reset Filters
          </button>
        ) : (
          <Link
            href="/shop"
            className="inline-block px-5 py-2.5 rounded-full bg-bookverse-terracotta text-white text-xs font-semibold hover:bg-bookverse-terracotta-hover transition-colors shadow-sm"
          >
            Browse All Books
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
