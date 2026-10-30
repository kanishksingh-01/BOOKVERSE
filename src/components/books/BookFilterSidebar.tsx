"use client";

import React from "react";
import { Filter, X, Check } from "lucide-react";
import { Category } from "@/types";

interface BookFilterSidebarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  priceRange: [number, number];
  onPriceChange: (min: number, max: number) => void;
  inStockOnly: boolean;
  onInStockChange: (inStock: boolean) => void;
  selectedRating: number | null;
  onRatingChange: (rating: number | null) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
}

export default function BookFilterSidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  inStockOnly,
  onInStockChange,
  selectedRating,
  onRatingChange,
  onClearFilters,
  activeFilterCount,
}: BookFilterSidebarProps) {
  const priceBrackets: { label: string; min: number; max: number }[] = [
    { label: "All Prices", min: 0, max: 500000 },
    { label: "Under ₹300", min: 0, max: 30000 },
    { label: "₹300 – ₹500", min: 30000, max: 50000 },
    { label: "₹500 – ₹1,000", min: 50000, max: 100000 },
    { label: "Above ₹1,000", min: 100000, max: 500000 },
  ];

  return (
    <aside className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-bookverse-beige">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-bookverse-terracotta" />
          <h3 className="font-serif text-lg font-bold text-bookverse-espresso">
            Refine Shelves
          </h3>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-bookverse-terracotta text-white text-[11px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-xs text-bookverse-espresso/60 hover:text-red-500 font-medium flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-bookverse-sage">
          Category
        </h4>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => onSelectCategory("all")}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
              selectedCategory === "all" || !selectedCategory
                ? "bg-bookverse-terracotta text-white font-bold"
                : "text-bookverse-espresso hover:bg-bookverse-ivory"
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                selectedCategory === cat.slug
                  ? "bg-bookverse-terracotta text-white font-bold"
                  : "text-bookverse-espresso hover:bg-bookverse-ivory"
              }`}
            >
              <span className="truncate">{cat.name}</span>
              {cat.bookCount !== undefined && (
                <span
                  className={`text-[10px] ${
                    selectedCategory === cat.slug ? "text-white/80" : "text-bookverse-espresso/40"
                  }`}
                >
                  {cat.bookCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Ranges */}
      <div className="space-y-3 pt-3 border-t border-bookverse-beige/60">
        <h4 className="text-xs font-bold uppercase tracking-wider text-bookverse-sage">
          Price Bracket
        </h4>
        <div className="space-y-1">
          {priceBrackets.map((bracket, i) => {
            const isSelected =
              priceRange[0] === bracket.min && priceRange[1] === bracket.max;
            return (
              <button
                key={i}
                onClick={() => onPriceChange(bracket.min, bracket.max)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                  isSelected
                    ? "bg-bookverse-beige text-bookverse-espresso font-bold"
                    : "text-bookverse-espresso/80 hover:bg-bookverse-ivory"
                }`}
              >
                <span>{bracket.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-bookverse-terracotta" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-3 pt-3 border-t border-bookverse-beige/60">
        <h4 className="text-xs font-bold uppercase tracking-wider text-bookverse-sage">
          Customer Rating
        </h4>
        <div className="space-y-1">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() => onRatingChange(selectedRating === stars ? null : stars)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                selectedRating === stars
                  ? "bg-bookverse-beige text-bookverse-espresso font-bold"
                  : "text-bookverse-espresso/80 hover:bg-bookverse-ivory"
              }`}
            >
              <span>{stars} Stars & Above</span>
              {selectedRating === stars && (
                <Check className="w-3.5 h-3.5 text-bookverse-terracotta" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div className="space-y-3 pt-3 border-t border-bookverse-beige/60">
        <h4 className="text-xs font-bold uppercase tracking-wider text-bookverse-sage">
          Availability
        </h4>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-bookverse-espresso">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="w-4 h-4 rounded text-bookverse-terracotta border-bookverse-beige focus:ring-bookverse-terracotta"
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </aside>
  );
}
