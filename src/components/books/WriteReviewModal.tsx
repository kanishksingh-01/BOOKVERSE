"use client";

import React, { useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  bookTitle: string;
  onReviewSubmitted: () => void;
}

export default function WriteReviewModal({
  isOpen,
  onClose,
  bookId,
  bookTitle,
  onReviewSubmitted,
}: WriteReviewModalProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to submit a review");
      return;
    }
    if (!title.trim() || !comment.trim()) {
      toast.error("Please fill in both a title and your review comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          rating,
          title: title.trim(),
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Review published successfully!");
        onReviewSubmitted();
        onClose();
        setTitle("");
        setComment("");
      } else {
        toast.error(data.error || "Failed to submit review");
      }
    } catch {
      toast.error("Network error while submitting review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bookverse-espresso/60 backdrop-blur-xs">
      <div
        className="w-full max-w-lg bg-bookverse-cream rounded-2xl border border-bookverse-beige shadow-2xl p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-bookverse-espresso/50 hover:text-bookverse-espresso hover:bg-bookverse-beige/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-bookverse-espresso mb-1">
          Review & Annotate
        </h3>
        <p className="text-xs text-bookverse-espresso/70 mb-6 truncate font-sans">
          Writing your reflections on &ldquo;{bookTitle}&rdquo;
        </p>

        {!user ? (
          <div className="py-6 text-center space-y-3">
            <p className="text-sm text-bookverse-espresso/80">
              You must be logged in to contribute verified reader reviews.
            </p>
            <Link
              href="/login"
              className="inline-block px-5 py-2.5 rounded-xl bg-bookverse-terracotta text-white font-semibold text-xs hover:bg-bookverse-terracotta-hover transition-colors"
            >
              Sign In to Your Account
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-bookverse-sage mb-2">
                Your Overall Rating
              </label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-amber-400 focus:outline-none transition-transform hover:scale-115"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-bookverse-beige stroke-2"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-bookverse-sage mb-1.5">
                Headline / One-Line Summary
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. A lyrical triumph that stays with you forever"
                className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso placeholder:text-bookverse-espresso/40 focus:outline-none focus:border-bookverse-terracotta"
              />
            </div>

            {/* Review Comment */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-bookverse-sage mb-1.5">
                Reader Reflections
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you think of the writing style, narrative pacing, and themes? Share your literary thoughts..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso placeholder:text-bookverse-espresso/40 focus:outline-none focus:border-bookverse-terracotta"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-bookverse-beige text-xs font-semibold text-bookverse-espresso hover:bg-bookverse-ivory"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-bookverse-terracotta text-white text-xs font-semibold hover:bg-bookverse-terracotta-hover flex items-center gap-2 disabled:opacity-50 shadow-warm transition-all"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Publish Review</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
