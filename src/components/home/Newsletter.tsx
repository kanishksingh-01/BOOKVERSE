"use client";

import React, { useState } from "react";
import { Mail, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsSubscribed(true);
        toast.success(data.message || "Thank you for subscribing!");
        setEmail("");
      } else {
        toast.error(data.error || "Subscription failed");
      }
    } catch {
      toast.error("Network error while subscribing");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-cream-texture">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-bookverse-ivory border border-bookverse-beige rounded-3xl p-8 sm:p-12 shadow-book space-y-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-bookverse-terracotta/10 text-bookverse-terracotta flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold">
              The Literary Dispatch
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bookverse-espresso">
              Join the BookVerse Readers Circle
            </h2>
            <p className="text-sm text-bookverse-espresso/70 max-w-lg mx-auto leading-relaxed">
              Receive fortnightly essays, rare edition releases, author dispatches, and an immediate{" "}
              <strong className="text-bookverse-terracotta">15% discount code</strong> for your initial order.
            </p>
          </div>

          {isSubscribed ? (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-bookverse-sage-light text-bookverse-sage font-medium text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>You are part of our circle! Check your email for your welcome voucher.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 px-4 py-3.5 rounded-xl border border-bookverse-beige bg-bookverse-cream text-bookverse-espresso placeholder:text-bookverse-espresso/40 text-sm focus:outline-none focus:border-bookverse-terracotta"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3.5 bg-bookverse-espresso text-bookverse-cream font-semibold text-sm rounded-xl hover:bg-bookverse-terracotta transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shrink-0 shadow-sm"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-[11px] text-bookverse-espresso/50">
            No spam. We revere your inbox just like our personal library shelves. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
