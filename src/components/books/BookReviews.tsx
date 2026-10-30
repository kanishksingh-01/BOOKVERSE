"use client";

import React, { useState } from "react";
import { Star, ShieldCheck, PenLine, User } from "lucide-react";
import { Review } from "@/types";
import { formatDate } from "@/lib/utils";
import WriteReviewModal from "./WriteReviewModal";

interface BookReviewsProps {
  bookId: string;
  bookTitle: string;
  reviews: Review[];
  rating: number;
  reviewCount: number;
  onRefresh?: () => void;
}

export default function BookReviews({
  bookId,
  bookTitle,
  reviews,
  rating,
  reviewCount,
  onRefresh,
}: BookReviewsProps) {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // Distribution calculations
  const total = Math.max(1, reviews.length);
  const countForStar = (stars: number) => reviews.filter((r) => r.rating === stars).length;

  return (
    <section className="pt-12 border-t border-bookverse-beige/70">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold block mb-1">
            Literary Community
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-bookverse-espresso">
            Reader Reviews & Annotations
          </h3>
        </div>

        <button
          onClick={() => setIsWriteModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bookverse-espresso text-bookverse-cream font-semibold text-xs hover:bg-bookverse-terracotta transition-colors shadow-sm self-start md:self-auto"
        >
          <PenLine className="w-3.5 h-3.5" />
          <span>Write a Review</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        {/* Rating Breakdown Card */}
        <div className="lg:col-span-4 bg-bookverse-cream rounded-2xl p-6 border border-bookverse-beige space-y-4">
          <div className="text-center pb-4 border-b border-bookverse-beige">
            <span className="font-serif text-5xl font-extrabold text-bookverse-espresso">
              {rating}
            </span>
            <div className="flex justify-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i <= Math.round(rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-bookverse-beige stroke-2"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-bookverse-espresso/60">
              Based on {reviewCount} verified reader reviews
            </p>
          </div>

          {/* Star bars */}
          <div className="space-y-2 text-xs">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = countForStar(stars);
              const percent = Math.round((count / total) * 100);
              return (
                <div key={stars} className="flex items-center gap-2 text-bookverse-espresso/70">
                  <span className="w-10 text-right font-medium">{stars} stars</span>
                  <div className="flex-1 bg-bookverse-beige/60 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-6 text-right font-medium text-bookverse-espresso/50">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-8 space-y-6">
          {reviews.length === 0 ? (
            <div className="p-8 text-center bg-bookverse-cream rounded-2xl border border-bookverse-beige space-y-2">
              <p className="font-serif text-base font-semibold text-bookverse-espresso">
                Be the first to leave a review
              </p>
              <p className="text-xs text-bookverse-espresso/60 max-w-sm mx-auto">
                Have you read &ldquo;{bookTitle}&rdquo;? Share your thoughts, annotations, and reflections with the BookVerse community.
              </p>
              <button
                onClick={() => setIsWriteModalOpen(true)}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-bookverse-terracotta hover:underline"
              >
                <PenLine className="w-3.5 h-3.5" />
                <span>Write the inaugural review</span>
              </button>
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-bookverse-cream rounded-2xl p-6 border border-bookverse-beige shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-bookverse-beige flex items-center justify-center text-bookverse-espresso/70 font-bold text-xs uppercase">
                      {rev.userName ? rev.userName.slice(0, 2) : <User className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-bookverse-espresso">
                        {rev.userName || "Verified Reader"}
                      </h4>
                      <p className="text-[11px] text-bookverse-espresso/50">
                        {formatDate(rev.createdAt)}
                      </p>
                    </div>
                  </div>

                  {rev.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-bookverse-sage-light text-bookverse-sage text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Buyer</span>
                    </span>
                  )}
                </div>

                {/* Stars & Title */}
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i <= rev.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-bookverse-beige stroke-2"
                        }`}
                      />
                    ))}
                  </div>
                  <h5 className="font-serif font-bold text-sm text-bookverse-espresso">
                    {rev.title}
                  </h5>
                </div>

                <p className="text-xs sm:text-sm text-bookverse-espresso/80 leading-relaxed font-sans">
                  {rev.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        bookId={bookId}
        bookTitle={bookTitle}
        onReviewSubmitted={() => {
          if (onRefresh) onRefresh();
        }}
      />
    </section>
  );
}
