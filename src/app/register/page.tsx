"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Lock, Mail, User, Phone, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    const success = await register(name, email, password, phone);
    setIsLoading(false);
    if (success) {
      router.push("/shop");
    }
  };

  return (
    <div className="bg-cream-texture min-h-[85vh] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-bookverse-ivory border border-bookverse-beige rounded-3xl p-8 sm:p-10 shadow-book space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-bookverse-terracotta text-white flex items-center justify-center shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-bookverse-espresso">
            Join the Readers Circle
          </h1>
          <p className="text-xs text-bookverse-espresso/70">
            Create an account to track shipments and save custom reading shelves.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-bookverse-espresso/40 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-cream text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-bookverse-espresso/40 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aarav@example.in"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-cream text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1.5">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-bookverse-espresso/40 absolute left-3.5 top-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-cream text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1.5">
              Password (min. 8 characters) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-bookverse-espresso/40 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-cream text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1.5">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-bookverse-espresso/40 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
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
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-bookverse-espresso/70 pt-2 border-t border-bookverse-beige/60">
          <span>Already have an account? </span>
          <Link href="/login" className="font-bold text-bookverse-terracotta hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
