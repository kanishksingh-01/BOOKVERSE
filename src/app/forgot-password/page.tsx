"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Mail, ArrowRight, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setIsSubmitted(true);
      toast.success(data.message || "Reset link dispatched.");
    } catch {
      toast.error("Error processing password reset");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-cream-texture min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-bookverse-ivory border border-bookverse-beige rounded-3xl p-8 sm:p-10 shadow-book space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-bookverse-espresso text-bookverse-cream flex items-center justify-center shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-bookverse-espresso">
            Reset Password
          </h1>
          <p className="text-xs text-bookverse-espresso/70">
            Enter your account email to receive safe recovery instructions.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-6 rounded-2xl bg-bookverse-cream border border-bookverse-beige text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-bookverse-sage mx-auto" />
            <h3 className="font-serif text-base font-bold text-bookverse-espresso">
              Recovery Link Sent
            </h3>
            <p className="text-xs text-bookverse-espresso/70">
              If an account is associated with <strong>{email}</strong>, we have sent instructions to reset your password.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-bookverse-terracotta hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1.5">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-bookverse-espresso/40 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.in"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-cream text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-bookverse-terracotta text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-bookverse-terracotta-hover shadow-warm transition-all disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Send Recovery Email</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-xs text-bookverse-espresso/60 hover:text-bookverse-espresso"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
