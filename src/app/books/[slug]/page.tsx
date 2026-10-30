import React from "react";
import prisma from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import BookDetailClient from "./BookDetailClient";
import { Book, Review } from "@/types";
import { FALLBACK_BOOKS } from "@/lib/constants/fallback-data";

export const dynamic = "force-dynamic";

interface BookPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BookPageProps) {
  try {
    const book = await prisma.book.findUnique({
      where: { slug: params.slug },
      select: { title: true, author: true, description: true },
    });

    if (book) {
      return {
        title: `${book.title} by ${book.author} – BookVerse Online Bookstore`,
        description: book.description.slice(0, 160),
      };
    }
  } catch {
    // If DB is offline, check fallback
  }

  const fallback = FALLBACK_BOOKS.find((b) => b.slug === params.slug);
  if (fallback) {
    return {
      title: `${fallback.title} by ${fallback.author} – BookVerse Online Bookstore`,
      description: fallback.description.slice(0, 160),
    };
  }

  return { title: "Book – BookVerse Online Bookstore" };
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { slug } = params;

  let book: any = null;
  let relatedBooks: any[] = [];

  try {
    book = await prisma.book.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: {
          where: { isApproved: true },
          include: {
            user: { select: { name: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (book) {
      relatedBooks = await prisma.book.findMany({
        where: {
          categoryId: book.categoryId,
          id: { not: book.id },
        },
        take: 4,
        include: { category: true },
      });
    }
  } catch (error) {
    console.warn("DB notice on book page:", error);
  }

  // Fallback if not found in database or database connection is offline
  if (!book) {
    const fallback = FALLBACK_BOOKS.find((b) => b.slug === slug);
    if (!fallback) {
      notFound();
    }

    const fallbackRelated = FALLBACK_BOOKS.filter(
      (b) => b.category?.slug === fallback.category?.slug && b.slug !== fallback.slug
    ).slice(0, 4);

    return (
      <BookDetailClient
        book={fallback}
        reviews={[]}
        relatedBooks={fallbackRelated.length > 0 ? fallbackRelated : FALLBACK_BOOKS.slice(0, 4)}
      />
    );
  }

  const reviewCount = book.reviews.length;
  const avgRating =
    reviewCount > 0
      ? Number((book.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviewCount).toFixed(1))
      : 4.9;

  const discountPercent =
    book.originalPrice > book.sellingPrice
      ? Math.round(((book.originalPrice - book.sellingPrice) / book.originalPrice) * 100)
      : 0;

  const formattedReviews: Review[] = book.reviews.map((r: any) => ({
    id: r.id,
    bookId: r.bookId,
    userId: r.userId,
    userName: r.user?.name || "BookVerse Reader",
    userAvatar: r.user?.avatar,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    verifiedPurchase: r.verifiedPurchase,
    isApproved: r.isApproved,
    createdAt: r.createdAt,
  }));

  const { reviews: _rawReviews, ...bookRest } = book;

  const formattedBook: Book = {
    ...bookRest,
    rating: avgRating,
    reviewCount,
    discountPercent,
    reviews: formattedReviews,
  };

  const formattedRelatedBooks: Book[] = relatedBooks.map((b) => ({
    ...b,
    discountPercent:
      b.originalPrice > b.sellingPrice
        ? Math.round(((b.originalPrice - b.sellingPrice) / b.originalPrice) * 100)
        : 0,
    rating: 4.8,
  }));

  return (
    <BookDetailClient
      book={formattedBook}
      reviews={formattedReviews}
      relatedBooks={formattedRelatedBooks}
    />
  );
}
