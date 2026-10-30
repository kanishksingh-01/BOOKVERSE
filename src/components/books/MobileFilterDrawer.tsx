"use client";

import React from "react";
import { X } from "lucide-react";
import BookFilterSidebar from "./BookFilterSidebar";
import { Category } from "@/types";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  ...props
}: MobileFilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      <div
        className="absolute inset-0 bg-bookverse-espresso/60 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-xs bg-bookverse-cream p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="font-serif text-lg font-bold text-bookverse-espresso">
                Filters
              </span>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-bookverse-espresso/60 hover:text-bookverse-espresso hover:bg-bookverse-beige/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <BookFilterSidebar {...props} />
          </div>
          <div className="pt-6 mt-6 border-t border-bookverse-beige">
            <button
              onClick={onClose}
              className="w-full py-3 bg-bookverse-espresso text-bookverse-cream font-semibold rounded-xl text-xs hover:bg-bookverse-terracotta transition-colors"
            >
              Apply Filters & View Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
