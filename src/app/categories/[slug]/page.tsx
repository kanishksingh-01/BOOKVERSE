import React from "react";
import prisma from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import BookGrid from "@/components/books/BookGrid";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Book } from "@/types";
import { FALLBACK_CATEGORIES, FALLBACK_BOOKS } from "@/lib/constants/fallback-data";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;

  let category: any = null;

  try {
    category = await prisma.category.findUnique({
      where: { slug },
      include: {
        books: {
          include: {
            category: true,
            reviews: { where: { isApproved: true } },
          },
          orderBy: { bestseller: "desc" },
        },
      },
    });
  } catch (error) {
    console.warn("DB notice on category page:", error);
  }

  // Fallback if database is offline or not migrated
  if (!category) {
    const fallbackCat = FALLBACK_CATEGORIES.find((c) => c.slug === slug);
    if (!fallbackCat) {
      notFound();
    }

    const fallbackBooks = FALLBACK_BOOKS.filter((b) => b.category?.slug === slug);

    return (
      <div className="bg-bookverse-ivory min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <div className="mb-6">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-bookverse-espresso/60 hover:text-bookverse-terracotta transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to All Shelves</span>
            </Link>
          </div>

          {/* Category Hero Banner */}
          <div className="bg-bookverse-cream border border-bookverse-beige rounded-3xl p-8 sm:p-12 mb-12 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl space-y-3 text-center md:text-left z-10">
              <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold">
                Genre Collection
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-bookverse-espresso">
                {fallbackCat.name}
              </h1>
              <p className="text-sm sm:text-base text-bookverse-espresso/80 leading-relaxed font-sans">
                {fallbackCat.description}
              </p>
              <p className="text-xs text-bookverse-espresso/60 font-medium pt-2">
                Showing {fallbackBooks.length} curated works in this collection
              </p>
            </div>

            {fallbackCat.image && (
              <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shadow-book border border-bookverse-beige shrink-0 z-10">
                <img
                  src={fallbackCat.image}
                  alt={fallbackCat.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Decorative aura */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-bookverse-terracotta/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Category Books Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-bookverse-beige pb-3">
              <h2 className="font-serif text-xl font-bold text-bookverse-espresso">
                Available in {fallbackCat.name}
              </h2>
              <Link
                href="/shop"
                className="text-xs font-semibold text-bookverse-terracotta hover:underline"
              >
                Browse all categories
              </Link>
            </div>

            <BookGrid
              books={fallbackBooks}
              emptyMessage={`Currently assembling new shipments for the ${fallbackCat.name} shelf. Check back shortly!`}
            />
          </div>
        </div>
      </div>
    );
  }

  const formattedBooks: Book[] = category.books.map((b: any) => {
    const reviewCount = b.reviews.length;
    const avgRating =
      reviewCount > 0
        ? Number((b.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewCount).toFixed(1))
        : 4.8;
    const discountPercent =
      b.originalPrice > b.sellingPrice
        ? Math.round(((b.originalPrice - b.sellingPrice) / b.originalPrice) * 100)
        : 0;

    const { reviews: _r, ...rest } = b;

    return {
      ...rest,
      rating: avgRating,
      reviewCount,
      discountPercent,
    };
  });

  return (
    <div className="bg-bookverse-ivory min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-bookverse-espresso/60 hover:text-bookverse-terracotta transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to All Shelves</span>
          </Link>
        </div>

        {/* Category Hero Banner */}
        <div className="bg-bookverse-cream border border-bookverse-beige rounded-3xl p-8 sm:p-12 mb-12 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3 text-center md:text-left z-10">
            <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold">
              Genre Collection
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-bookverse-espresso">
              {category.name}
            </h1>
            <p className="text-sm sm:text-base text-bookverse-espresso/80 leading-relaxed font-sans">
              {category.description}
            </p>
            <p className="text-xs text-bookverse-espresso/60 font-medium pt-2">
              Showing {formattedBooks.length} curated works in this collection
            </p>
          </div>

          {category.image && (
            <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shadow-book border border-bookverse-beige shrink-0 z-10">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Decorative aura */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-bookverse-terracotta/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Category Books Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-bookverse-beige pb-3">
            <h2 className="font-serif text-xl font-bold text-bookverse-espresso">
              Available in {category.name}
            </h2>
            <Link
              href="/shop"
              className="text-xs font-semibold text-bookverse-terracotta hover:underline"
            >
              Browse all categories
            </Link>
          </div>

          <BookGrid
            books={formattedBooks}
            emptyMessage={`Currently assembling new shipments for the ${category.name} shelf. Check back shortly!`}
          />
        </div>
      </div>
    </div>
  );
}
