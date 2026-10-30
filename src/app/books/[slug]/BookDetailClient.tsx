"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  Star,
  Check,
  Shield,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Book, Review } from "@/types";
import { formatINR } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import BookReviews from "@/components/books/BookReviews";
import BookCard from "@/components/books/BookCard";

interface BookDetailClientProps {
  book: Book;
  reviews: Review[];
  relatedBooks: Book[];
}

export default function BookDetailClient({
  book,
  reviews: initialReviews,
  relatedBooks,
}: BookDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const isWishlisted = isInWishlist(book.id);
  const isOutOfStock = book.stock <= 0;
  const isLowStock = book.stock > 0 && book.stock <= 5;

  const handleBuyNow = () => {
    addToCart(book, quantity);
    router.push("/checkout");
  };

  const refreshReviews = async () => {
    try {
      const res = await fetch(`/api/books/${book.slug}`);
      if (res.ok) {
        const data = await res.json();
        if (data.book?.reviews) {
          setReviews(
            data.book.reviews.map((r: any) => ({
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
            }))
          );
        }
      }
    } catch (e) {
      console.error("Failed to refresh reviews", e);
    }
  };

  return (
    <div className="bg-bookverse-ivory min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Breadcrumb Trail */}
        <nav className="flex items-center space-x-2 text-xs text-bookverse-espresso/60">
          <Link href="/" className="hover:text-bookverse-terracotta transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-bookverse-terracotta transition-colors">
            Shop
          </Link>
          <span>/</span>
          {book.category && (
            <>
              <Link
                href={`/categories/${book.category.slug}`}
                className="hover:text-bookverse-terracotta transition-colors"
              >
                {book.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-bookverse-espresso font-semibold truncate max-w-xs">
            {book.title}
          </span>
        </nav>

        {/* Main Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Book Cover Display */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md aspect-[2/3] rounded-2xl overflow-hidden bg-bookverse-cream border border-bookverse-beige shadow-book p-4 flex items-center justify-center">
              <div className="book-spine-effect w-full h-full rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Wishlist Button Overlay */}
              <button
                onClick={() => toggleWishlist(book)}
                className={`absolute top-8 right-8 p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                  isWishlisted
                    ? "bg-red-50 text-red-500 scale-110"
                    : "bg-white/80 text-bookverse-espresso/70 hover:text-red-500 hover:bg-white"
                }`}
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-red-500" : ""}`} />
              </button>
            </div>

            {/* Quality Badges */}
            <div className="grid grid-cols-3 gap-4 w-full max-w-md mt-6 text-center text-xs text-bookverse-espresso/70">
              <div className="bg-bookverse-cream border border-bookverse-beige rounded-xl p-3 flex flex-col items-center gap-1">
                <Shield className="w-4 h-4 text-bookverse-sage" />
                <span className="font-semibold text-[11px]">100% Genuine</span>
                <span className="text-[10px] text-bookverse-espresso/50">Publisher Edition</span>
              </div>
              <div className="bg-bookverse-cream border border-bookverse-beige rounded-xl p-3 flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-bookverse-terracotta" />
                <span className="font-semibold text-[11px]">24hr Dispatch</span>
                <span className="text-[10px] text-bookverse-espresso/50">Pan-India Courier</span>
              </div>
              <div className="bg-bookverse-cream border border-bookverse-beige rounded-xl p-3 flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-bookverse-sage" />
                <span className="font-semibold text-[11px]">Transit Safety</span>
                <span className="text-[10px] text-bookverse-espresso/50">Corner Protection</span>
              </div>
            </div>
          </div>

          {/* Right Column: Book Information, Pricing & Buying Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              {/* Category & Status */}
              <div className="flex items-center gap-2 mb-2">
                {book.category && (
                  <Link
                    href={`/categories/${book.category.slug}`}
                    className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-bookverse-sage-light text-bookverse-sage hover:bg-bookverse-sage/20 transition-colors"
                  >
                    {book.category.name}
                  </Link>
                )}
                {book.bestseller && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-bookverse-terracotta text-white">
                    Bestseller
                  </span>
                )}
                {book.staffPick && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-bookverse-espresso text-bookverse-cream">
                    Staff Pick
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-bookverse-espresso leading-tight">
                {book.title}
              </h1>

              {/* Author & Publisher */}
              <p className="text-base sm:text-lg text-bookverse-espresso/80 mt-2 font-medium">
                by <span className="text-bookverse-terracotta font-semibold">{book.author}</span>
              </p>
              <p className="text-xs text-bookverse-espresso/60 mt-0.5">
                Published by {book.publisher}
              </p>

              {/* Ratings snippet */}
              <div className="flex items-center gap-2 mt-3 text-xs">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i <= Math.round(book.rating || 4.8)
                          ? "fill-amber-400 text-amber-400"
                          : "text-bookverse-beige stroke-2"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-bookverse-espresso">{book.rating || 4.8}</span>
                <span className="text-bookverse-espresso/50">
                  ({reviews.length} reader reviews)
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-bookverse-cream border border-bookverse-beige shadow-xs space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-bookverse-terracotta">
                  {formatINR(book.sellingPrice, true)}
                </span>
                {book.originalPrice > book.sellingPrice && (
                  <>
                    <span className="text-base text-bookverse-espresso/40 line-through">
                      {formatINR(book.originalPrice, true)}
                    </span>
                    <span className="text-xs font-bold text-bookverse-sage bg-bookverse-sage-light px-2 py-0.5 rounded">
                      Save {formatINR(book.originalPrice - book.sellingPrice, true)} (
                      {book.discountPercent}% OFF)
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-bookverse-espresso/60">
                Inclusive of all taxes &bull; Free standard delivery across India on orders over ₹499
              </p>

              {/* Stock Status */}
              <div className="pt-2 border-t border-bookverse-beige/60">
                {isOutOfStock ? (
                  <span className="text-xs font-bold text-red-600">
                    Currently Out of Stock &ndash; Check back soon
                  </span>
                ) : isLowStock ? (
                  <span className="text-xs font-bold text-amber-600">
                    Only {book.stock} copies remaining on this shelf!
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-bookverse-sage flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    Available in Stock ({book.stock} copies ready to dispatch)
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Selector & CTAs */}
            {!isOutOfStock && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-bookverse-sage">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-bookverse-beige rounded-xl bg-bookverse-cream shadow-xs">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2.5 hover:text-bookverse-terracotta transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-bold text-bookverse-espresso">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(book.stock, q + 1))}
                      className="p-2.5 hover:text-bookverse-terracotta transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => addToCart(book, quantity)}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-bookverse-espresso text-bookverse-cream font-semibold text-sm flex items-center justify-center gap-2 hover:bg-bookverse-espresso/90 shadow-sm active:scale-98 transition-all"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Satchel</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-bookverse-terracotta text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-bookverse-terracotta-hover shadow-warm active:scale-98 transition-all"
                  >
                    <span>Buy Now with 1-Click</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Book Description */}
            <div className="pt-6 border-t border-bookverse-beige/70 space-y-3">
              <h3 className="font-serif text-xl font-bold text-bookverse-espresso">
                About this Work
              </h3>
              <p className="text-sm text-bookverse-espresso/80 leading-relaxed font-sans whitespace-pre-line">
                {book.description}
              </p>
            </div>

            {/* Specifications Grid */}
            <div className="pt-6 border-t border-bookverse-beige/70 space-y-3">
              <h3 className="font-serif text-lg font-bold text-bookverse-espresso">
                Bibliographic Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-bookverse-cream border border-bookverse-beige p-3 rounded-xl">
                  <span className="text-bookverse-espresso/50 block">ISBN</span>
                  <span className="font-semibold text-bookverse-espresso font-mono">
                    {book.isbn}
                  </span>
                </div>
                <div className="bg-bookverse-cream border border-bookverse-beige p-3 rounded-xl">
                  <span className="text-bookverse-espresso/50 block">Length</span>
                  <span className="font-semibold text-bookverse-espresso">{book.pages} pages</span>
                </div>
                <div className="bg-bookverse-cream border border-bookverse-beige p-3 rounded-xl">
                  <span className="text-bookverse-espresso/50 block">Language</span>
                  <span className="font-semibold text-bookverse-espresso">{book.language}</span>
                </div>
                <div className="bg-bookverse-cream border border-bookverse-beige p-3 rounded-xl">
                  <span className="text-bookverse-espresso/50 block">Binding</span>
                  <span className="font-semibold text-bookverse-espresso">Paperback / Pristine</span>
                </div>
                <div className="bg-bookverse-cream border border-bookverse-beige p-3 rounded-xl">
                  <span className="text-bookverse-espresso/50 block">Publisher</span>
                  <span className="font-semibold text-bookverse-espresso truncate block">
                    {book.publisher}
                  </span>
                </div>
                <div className="bg-bookverse-cream border border-bookverse-beige p-3 rounded-xl">
                  <span className="text-bookverse-espresso/50 block">Country of Print</span>
                  <span className="font-semibold text-bookverse-espresso">India</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reader Reviews & Annotations */}
        <BookReviews
          bookId={book.id}
          bookTitle={book.title}
          reviews={reviews}
          rating={book.rating || 4.8}
          reviewCount={reviews.length}
          onRefresh={refreshReviews}
        />

        {/* Related Books / Customers Also Loved */}
        {relatedBooks.length > 0 && (
          <section className="pt-12 border-t border-bookverse-beige/70">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold block mb-1">
                  Further Reading
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-bookverse-espresso">
                  Readers Also Explored
                </h3>
              </div>
              <Link
                href={`/categories/${book.category?.slug || "fiction"}`}
                className="text-xs font-semibold text-bookverse-terracotta hover:underline flex items-center gap-1"
              >
                <span>View More in {book.category?.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedBooks.map((relBook) => (
                <BookCard key={relBook.id} book={relBook} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
