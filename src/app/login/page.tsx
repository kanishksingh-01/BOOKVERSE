"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/account/orders");
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) {
      router.push("/shop");
    }
  };

  const fillDemoAccount = async (demoRole: "ADMIN" | "CUSTOMER") => {
    if (demoRole === "ADMIN") {
      setEmail("admin@bookverse.in");
      setPassword("Admin@BookVerse2026!");
      setIsLoading(true);
      const success = await login("admin@bookverse.in", "Admin@BookVerse2026!");
      setIsLoading(false);
      if (success) router.push("/admin");
    } else {
      setEmail("aarav.sharma@example.in");
      setPassword("Customer@2026!");
      setIsLoading(true);
      const success = await login("aarav.sharma@example.in", "Customer@2026!");
      setIsLoading(false);
      if (success) router.push("/shop");
    }
  };

  return (
    <div className="bg-cream-texture min-h-[80vh] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md bg-bookverse-ivory border border-bookverse-beige rounded-3xl p-8 sm:p-10 shadow-book space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-bookverse-espresso text-bookverse-cream flex items-center justify-center shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-bookverse-espresso">
            Welcome to BookVerse
          </h1>
          <p className="text-xs text-bookverse-espresso/70">
            Sign in to access your orders, saved shelves, and book clubs.
          </p>
        </div>

        {/* 1-Click Demo Buttons for Instant Evaluation */}
        <div className="bg-bookverse-cream border border-bookverse-beige rounded-2xl p-4 space-y-2.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-bookverse-sage block text-center">
            One-Click Quick Sign In (Demo Credentials)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount("CUSTOMER")}
              className="py-2 px-3 rounded-xl bg-bookverse-ivory border border-bookverse-beige text-xs font-semibold text-bookverse-espresso hover:bg-bookverse-beige/40 flex items-center justify-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-bookverse-terracotta" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("ADMIN")}
              className="py-2 px-3 rounded-xl bg-bookverse-espresso text-bookverse-cream text-xs font-semibold hover:bg-bookverse-terracotta flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-bookverse-terracotta" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1.5">
              Email Address
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

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="font-bold uppercase tracking-wider text-bookverse-sage">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-bookverse-terracotta hover:underline font-semibold"
              >
                Forgot password?
              </Link>
            </div>
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-bookverse-terracotta text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-bookverse-terracotta-hover shadow-warm transition-all disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Sign In to Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-bookverse-espresso/70 pt-2 border-t border-bookverse-beige/60">
          <span>Don&apos;t have an account yet? </span>
          <Link
            href="/register"
            className="font-bold text-bookverse-terracotta hover:underline"
          >
            Register for free
          </Link>
        </div>
      </div>
    </div>
  );
}
