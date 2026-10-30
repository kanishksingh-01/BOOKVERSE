"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, BookOpen, ArrowRight, Loader2 } from "lucide-react";
import { Book } from "@/types";
import { formatINR } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/books?search=${encodeURIComponent(query)}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.books || []);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "Enter" && query.trim()) {
      onClose();
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-bookverse-espresso/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-bookverse-cream rounded-2xl shadow-2xl border border-bookverse-beige overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-5 py-4 border-b border-bookverse-beige">
          <Search className="w-5 h-5 text-bookverse-espresso/50 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by title, author, or ISBN (e.g. Arundhati Roy, Dune, 978...)"
            className="w-full bg-transparent text-bookverse-espresso placeholder-bookverse-espresso/40 text-base sm:text-lg focus:outline-none"
          />
          {loading ? (
            <Loader2 className="w-5 h-5 text-bookverse-terracotta animate-spin ml-2" />
          ) : query ? (
            <button
              onClick={() => setQuery("")}
              className="text-bookverse-espresso/40 hover:text-bookverse-espresso ml-2 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="ml-3 text-xs uppercase tracking-wider text-bookverse-espresso/50 hover:text-bookverse-espresso border border-bookverse-beige px-2 py-1 rounded"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-bookverse-beige/60">
          {results.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-bookverse-sage font-bold px-2 mb-2">
                Books found ({results.length})
              </p>
              {results.map((book) => (
                <Link
                  key={book.id}
                  href={`/books/${book.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-bookverse-ivory transition-colors group"
                >
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-semibold text-bookverse-espresso group-hover:text-bookverse-terracotta transition-colors truncate">
                      {book.title}
                    </h4>
                    <p className="text-xs text-bookverse-espresso/70 truncate">{book.author}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-bookverse-terracotta">
                        {formatINR(book.sellingPrice, true)}
                      </span>
                      {book.originalPrice > book.sellingPrice && (
                        <span className="text-[11px] text-bookverse-espresso/40 line-through">
                          {formatINR(book.originalPrice, true)}
                        </span>
                      )}
                      <span className="text-[10px] text-bookverse-sage font-medium px-1.5 py-0.5 bg-bookverse-sage-light rounded">
                        {book.category?.name || "Book"}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-bookverse-espresso/30 group-hover:text-bookverse-terracotta group-hover:translate-x-1 transition-all" />
                </Link>
              ))}

              <div className="pt-3 px-2">
                <Link
                  href={`/shop?search=${encodeURIComponent(query)}`}
                  onClick={onClose}
                  className="w-full py-2.5 bg-bookverse-espresso text-bookverse-cream rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-bookverse-terracotta transition-colors"
                >
                  <span>View all results for &ldquo;{query}&rdquo;</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : query && !loading ? (
            <div className="py-12 text-center text-bookverse-espresso/60 space-y-2">
              <BookOpen className="w-10 h-10 mx-auto text-bookverse-espresso/30" />
              <p className="text-sm font-medium">No books matched &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-bookverse-espresso/40">
                Try searching by a broader keyword, author name, or ISBN number.
              </p>
            </div>
          ) : (
            <div className="py-8 px-2 space-y-4">
              <p className="text-xs uppercase tracking-wider text-bookverse-sage font-bold">
                Suggested Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {["Arundhati Roy", "Fiction", "Atomic Habits", "Dune", "Technology", "Ruskin Bond"].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="text-xs bg-bookverse-ivory hover:bg-bookverse-beige text-bookverse-espresso px-3 py-1.5 rounded-full border border-bookverse-beige transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
