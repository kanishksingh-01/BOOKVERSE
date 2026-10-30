"use client";

import React, { useState, useEffect } from "react";
import { Star, Check, X, Trash2, MessageSquare, Loader2, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApproval = async (reviewId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, isApproved: !currentStatus }),
      });
      if (res.ok) {
        toast.success(!currentStatus ? "Review approved" : "Review hidden");
        fetchReviews();
      }
    } catch {
      toast.error("Error updating review");
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;
    try {
      const res = await fetch(`/api/admin/reviews?id=${reviewId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Review deleted");
        fetchReviews();
      }
    } catch {
      toast.error("Error deleting review");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold block mb-1">
          Content Moderation
        </span>
        <h1 className="font-serif text-3xl font-bold text-bookverse-espresso">
          Reader Reviews & Annotations
        </h1>
        <p className="text-xs text-bookverse-espresso/60">
          Moderate community commentary and ensure thoughtful, civil literary discourse.
        </p>
      </div>

      <div className="bg-bookverse-cream border border-bookverse-beige rounded-3xl p-6 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-bookverse-terracotta animate-spin mx-auto" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-16 text-center text-bookverse-espresso/60 space-y-2">
            <MessageSquare className="w-10 h-10 mx-auto text-bookverse-espresso/30" />
            <p className="font-semibold text-sm">No reviews submitted yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-bookverse-ivory rounded-2xl border border-bookverse-beige p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.book?.coverImage}
                      alt={rev.book?.title}
                      className="w-10 h-14 object-cover rounded shadow-xs shrink-0"
                    />
                    <div>
                      <Link
                        href={`/books/${rev.book?.slug}`}
                        target="_blank"
                        className="font-serif font-bold text-sm text-bookverse-espresso hover:text-bookverse-terracotta flex items-center gap-1"
                      >
                        <span>{rev.book?.title}</span>
                        <ExternalLink className="w-3 h-3 text-bookverse-espresso/40" />
                      </Link>
                      <p className="text-xs text-bookverse-espresso/70 mt-0.5">
                        By <strong>{rev.user?.name}</strong> ({rev.user?.email}) &bull;{" "}
                        {formatDate(rev.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleApproval(rev.id, rev.isApproved)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                        rev.isApproved
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      }`}
                    >
                      {rev.isApproved ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Approved & Live</span>
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5" />
                          <span>Hidden from Store</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(rev.id)}
                      className="p-1.5 rounded-lg text-bookverse-espresso/40 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Rating & Content */}
                <div className="pt-2 border-t border-bookverse-beige/70 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
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
                  <p className="text-xs text-bookverse-espresso/80 leading-relaxed font-sans">
                    {rev.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
