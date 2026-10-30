import React from "react";
import prisma from "@/lib/db/prisma";
import { notFound } from "next/navigation";
import BookDetailClient from "./BookDetailClient";
import { Book, Review } from "@/types";

export const dynamic = "force-dynamic";

interface BookPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BookPageProps) {
  const book = await prisma.book.findUnique({
    where: { slug: params.slug },
    select: { title: true, author: true, description: true },
  });

  if (!book) return { title: "Book Not Found – BookVerse" };

  return {
    title: `${book.title} by ${book.author} – BookVerse Online Bookstore`,
    description: book.description.slice(0, 160),
  };
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { slug } = params;

  const book = await prisma.book.findUnique({
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

  if (!book) {
    notFound();
  }

  // Fetch related books in the same category
  const relatedBooks = await prisma.book.findMany({
    where: {
      categoryId: book.categoryId,
      id: { not: book.id },
    },
    take: 4,
    include: { category: true },
  });

  const reviewCount = book.reviews.length;
  const avgRating =
    reviewCount > 0
      ? Number((book.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
      : 4.9;

  const discountPercent =
    book.originalPrice > book.sellingPrice
      ? Math.round(((book.originalPrice - book.sellingPrice) / book.originalPrice) * 100)
      : 0;

  const formattedReviews: Review[] = book.reviews.map((r) => ({
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
