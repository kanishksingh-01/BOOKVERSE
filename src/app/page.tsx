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

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch categories and books concurrently
  const [categories, bestsellers, newArrivals, staffPicks] = await Promise.all([
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { books: true } },
      },
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

  const formattedCategories = categories.map((c) => ({
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image || "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=600&auto=format&fit=crop&q=80",
    bookCount: c._count.books,
  }));

  const formatBook = (b: any): Book => ({
    ...b,
    discountPercent:
      b.originalPrice > b.sellingPrice
        ? Math.round(((b.originalPrice - b.sellingPrice) / b.originalPrice) * 100)
        : 0,
    rating: 4.8,
  });

  return (
    <div className="flex flex-col">
      {/* 4, 5, 6: Hero Section with Headings & CTAs */}
      <Hero />

      {/* 7: Featured Categories */}
      <FeaturedCategories categories={formattedCategories} />

      {/* 8: Bestselling Books */}
      <BookShowcase
        title="Bestselling Titles"
        subtitle="The stories capturing readers across the nation this season."
        badge="Top Circulated"
        books={bestsellers.map(formatBook)}
        viewAllHref="/shop?sortBy=popularity"
      />

      {/* 9: New Arrivals */}
      <BookShowcase
        title="Fresh from the Press"
        subtitle="Newly arrived shipments and modern literary releases."
        badge="New Releases"
        books={newArrivals.map(formatBook)}
        viewAllHref="/shop?sortBy=newest"
      />

      {/* 11: Promotional / Editorial Banner */}
      <CuratedBanner />

      {/* 10: Staff Picks / Recommended */}
      <BookShowcase
        title="Bookseller Recommendations"
        subtitle="Hand-annotated gems from our indie reading desk."
        badge="Staff Curated"
        books={staffPicks.map(formatBook)}
        viewAllHref="/shop?staffPick=true"
      />

      {/* 12: Why shop with BookVerse */}
      <WhyShopWithUs />

      {/* 13: Customer Testimonials */}
      <Testimonials />

      {/* 14: Newsletter Subscription */}
      <Newsletter />
    </div>
  );
}
