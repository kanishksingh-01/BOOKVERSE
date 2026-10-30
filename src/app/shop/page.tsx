"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, ArrowUpDown, X, Loader2 } from "lucide-react";
import { Book, Category } from "@/types";
import BookGrid from "@/components/books/BookGrid";
import BookFilterSidebar from "@/components/books/BookFilterSidebar";
import MobileFilterDrawer from "@/components/books/MobileFilterDrawer";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filters from query or defaults
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sortBy") || "popularity");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }
    loadCategories();
  }, []);

  // Sync state if URL query params change externally
  useEffect(() => {
    const qSearch = searchParams.get("search");
    if (qSearch !== null) setSearch(qSearch);
    const qCat = searchParams.get("category");
    if (qCat !== null) setCategory(qCat);
    const qSort = searchParams.get("sortBy");
    if (qSort !== null) setSortBy(qSort);
    const qStaff = searchParams.get("staffPick");
    if (qStaff === "true") setSortBy("popularity");
  }, [searchParams]);

  // Fetch books
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (category && category !== "all") params.set("category", category);
      if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
      if (priceRange[1] < 500000) params.set("maxPrice", priceRange[1].toString());
      if (inStockOnly) params.set("inStock", "true");
      if (sortBy) params.set("sortBy", sortBy);
      params.set("page", currentPage.toString());
      params.set("limit", "12");

      const res = await fetch(`/api/books?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBooks(data.books || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalCount(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch books", err);
    } finally {
      setLoading(false);
    }
  }, [search, category, priceRange, inStockOnly, sortBy, currentPage]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Active filters count
  let activeFilterCount = 0;
  if (category && category !== "all") activeFilterCount++;
  if (priceRange[0] > 0 || priceRange[1] < 500000) activeFilterCount++;
  if (inStockOnly) activeFilterCount++;
  if (selectedRating !== null) activeFilterCount++;
  if (search.trim()) activeFilterCount++;

  const handleClearAllFilters = () => {
    setSearch("");
    setCategory("all");
    setPriceRange([0, 500000]);
    setInStockOnly(false);
    setSelectedRating(null);
    setSortBy("popularity");
    setCurrentPage(1);
    router.push("/shop");
  };

  return (
    <div className="bg-bookverse-ivory min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8 space-y-2">
          <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold">
            The Complete Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bookverse-espresso">
            Browse All Books
          </h1>
          <p className="text-sm text-bookverse-espresso/70 max-w-2xl font-sans">
            Showing {totalCount} curated works across classical literature, modern Indian narratives, psychology, and computing.
          </p>
        </div>

        {/* Top Controls Bar: Search & Sort & Mobile Filter Toggle */}
        <div className="bg-bookverse-cream border border-bookverse-beige rounded-2xl p-4 mb-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-bookverse-espresso/40 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search title, author, or ISBN..."
              className="w-full pl-10 pr-8 py-2 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-xs sm:text-sm text-bookverse-espresso placeholder:text-bookverse-espresso/40 focus:outline-none focus:border-bookverse-terracotta"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2.5 text-bookverse-espresso/40 hover:text-bookverse-espresso p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-xs font-semibold text-bookverse-espresso hover:bg-bookverse-beige/40 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-bookverse-terracotta" />
              <span>Filters ({activeFilterCount})</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-bookverse-espresso/60 hidden sm:block" />
              <span className="text-bookverse-espresso/60 hidden sm:block">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-xs font-medium text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta cursor-pointer"
              >
                <option value="popularity">Most Popular / Bestsellers</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Badges */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
            <span className="text-bookverse-espresso/60 font-medium">Active filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bookverse-beige text-bookverse-espresso">
                <span>Search: &ldquo;{search}&rdquo;</span>
                <button onClick={() => setSearch("")}>
                  <X className="w-3 h-3 hover:text-red-500" />
                </button>
              </span>
            )}
            {category && category !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bookverse-beige text-bookverse-espresso">
                <span>Category: {categories.find((c) => c.slug === category)?.name || category}</span>
                <button onClick={() => setCategory("all")}>
                  <X className="w-3 h-3 hover:text-red-500" />
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bookverse-beige text-bookverse-espresso">
                <span>In Stock Only</span>
                <button onClick={() => setInStockOnly(false)}>
                  <X className="w-3 h-3 hover:text-red-500" />
                </button>
              </span>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 500000) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bookverse-beige text-bookverse-espresso">
                <span>Price Bracket Filter</span>
                <button onClick={() => setPriceRange([0, 500000])}>
                  <X className="w-3 h-3 hover:text-red-500" />
                </button>
              </span>
            )}
            <button
              onClick={handleClearAllFilters}
              className="text-bookverse-terracotta font-semibold hover:underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Main Grid & Desktop Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar (1 Column) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-bookverse-cream border border-bookverse-beige rounded-2xl p-6 shadow-sm sticky top-28">
              <BookFilterSidebar
                categories={categories}
                selectedCategory={category}
                onSelectCategory={(slug) => {
                  setCategory(slug);
                  setCurrentPage(1);
                }}
                priceRange={priceRange}
                onPriceChange={(min, max) => {
                  setPriceRange([min, max]);
                  setCurrentPage(1);
                }}
                inStockOnly={inStockOnly}
                onInStockChange={(val) => {
                  setInStockOnly(val);
                  setCurrentPage(1);
                }}
                selectedRating={selectedRating}
                onRatingChange={(stars) => {
                  setSelectedRating(stars);
                  setCurrentPage(1);
                }}
                onClearFilters={handleClearAllFilters}
                activeFilterCount={activeFilterCount}
              />
            </div>
          </div>

          {/* Books List Grid (3 Columns) */}
          <div className="lg:col-span-3 space-y-8">
            <BookGrid
              books={books}
              isLoading={loading}
              onClearFilters={handleClearAllFilters}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8 border-t border-bookverse-beige">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-xl border border-bookverse-beige bg-bookverse-cream text-xs font-semibold text-bookverse-espresso disabled:opacity-40 hover:bg-bookverse-ivory transition-colors"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-semibold transition-colors ${
                        currentPage === pNum
                          ? "bg-bookverse-espresso text-bookverse-cream shadow-sm"
                          : "border border-bookverse-beige bg-bookverse-cream text-bookverse-espresso hover:bg-bookverse-ivory"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-4 py-2 rounded-xl border border-bookverse-beige bg-bookverse-cream text-xs font-semibold text-bookverse-espresso disabled:opacity-40 hover:bg-bookverse-ivory transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        categories={categories}
        selectedCategory={category}
        onSelectCategory={(slug) => {
          setCategory(slug);
          setCurrentPage(1);
        }}
        priceRange={priceRange}
        onPriceChange={(min, max) => {
          setPriceRange([min, max]);
          setCurrentPage(1);
        }}
        inStockOnly={inStockOnly}
        onInStockChange={(val) => {
          setInStockOnly(val);
          setCurrentPage(1);
        }}
        selectedRating={selectedRating}
        onRatingChange={(stars) => {
          setSelectedRating(stars);
          setCurrentPage(1);
        }}
        onClearFilters={handleClearAllFilters}
        activeFilterCount={activeFilterCount}
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-bookverse-ivory min-h-screen py-20 text-center">
          <Loader2 className="w-8 h-8 text-bookverse-terracotta animate-spin mx-auto" />
          <p className="text-xs text-bookverse-espresso/60 mt-3">Loading BookVerse Catalogue...</p>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
