import React from "react";
import prisma from "@/lib/db/prisma";
import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import BookShowcase from "@/components/home/BookShowcase";
import CuratedBanner from "@/components/home/CuratedBanner";
import WhyShopWithUs from "@/components/home/WhyShopWithUs";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import { Book } from "@/types";
import { FALLBACK_CATEGORIES, FALLBACK_BOOKS } from "@/lib/constants/fallback-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let categories = FALLBACK_CATEGORIES;
  let bestsellers = FALLBACK_BOOKS.filter((b) => b.bestseller).slice(0, 4);
  let newArrivals = FALLBACK_BOOKS.slice(0, 4);
  let staffPicks = FALLBACK_BOOKS.filter((b) => b.staffPick).slice(0, 4);

  if (bestsellers.length === 0) bestsellers = FALLBACK_BOOKS.slice(0, 4);
  if (staffPicks.length === 0) staffPicks = FALLBACK_BOOKS.slice(4, 8);

  try {
    const [dbCategories, dbBestsellers, dbNewArrivals, dbStaffPicks] = await Promise.all([
      prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { books: true } } },
      }),
      prisma.book.findMany({
        where: { bestseller: true },
        take: 4,
        include: { category: true },
        orderBy: { sellingPrice: "desc" },
      }),
      prisma.book.findMany({
        take: 4,
        include: { category: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.book.findMany({
        where: { staffPick: true },
        take: 4,
        include: { category: true },
      }),
    ]);

    if (dbCategories && dbCategories.length > 0) {
      categories = dbCategories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        image: c.image || "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=600&auto=format&fit=crop&q=80",
        bookCount: c._count.books,
      }));
    }

    const formatBook = (b: any): Book => ({
      ...b,
      discountPercent:
        b.originalPrice > b.sellingPrice
          ? Math.round(((b.originalPrice - b.sellingPrice) / b.originalPrice) * 100)
          : 0,
      rating: 4.8,
    });

    if (dbBestsellers && dbBestsellers.length > 0) {
      bestsellers = dbBestsellers.map(formatBook);
    }
    if (dbNewArrivals && dbNewArrivals.length > 0) {
      newArrivals = dbNewArrivals.map(formatBook);
    }
    if (dbStaffPicks && dbStaffPicks.length > 0) {
      staffPicks = dbStaffPicks.map(formatBook);
    }
  } catch (error) {
    console.warn("Database connection notice: Running with resilient curated catalog.", error);
  }

  const categoryItems = categories.map((c) => ({
    name: c.name,
    slug: c.slug,
    description: c.description || "",
    image: c.image || "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=600&auto=format&fit=crop&q=80",
    bookCount: c.bookCount,
  }));

  return (
    <div className="flex flex-col">
      {/* 4, 5, 6: Hero Section with Headings & CTAs */}
      <Hero />

      {/* 7: Featured Categories */}
      <FeaturedCategories categories={categoryItems} />

      {/* 8: Bestselling Books */}
      <BookShowcase
        title="Bestselling Titles"
        subtitle="The stories capturing readers across the nation this season."
        badge="Top Circulated"
        books={bestsellers}
        viewAllHref="/shop?sortBy=popularity"
      />

      {/* 9: New Arrivals */}
      <BookShowcase
        title="Fresh from the Press"
        subtitle="Newly arrived shipments and modern literary releases."
        badge="New Releases"
        books={newArrivals}
        viewAllHref="/shop?sortBy=newest"
      />

      {/* 11: Promotional Section */}
      <CuratedBanner />

      {/* 10: Staff Picks */}
      <BookShowcase
        title="Bookseller Recommendations"
        subtitle="Hand-annotated gems from our indie reading desk."
        badge="Staff Curated"
        books={staffPicks}
        viewAllHref="/shop?staffPick=true"
      />

      {/* 12: Why Shop with BookVerse */}
      <WhyShopWithUs />

      {/* 13: Customer Testimonials */}
      <Testimonials />

      {/* 14: Newsletter Subscription */}
      <Newsletter />
    </div>
  );
}
