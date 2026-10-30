"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsSuccess(true);
        toast.success(data.message || "Message sent successfully!");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        toast.error(data.error || "Failed to send message");
      }
    } catch {
      toast.error("Network error while submitting");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-bookverse-ivory min-h-screen py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold">
            Curator Inquiries
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-bookverse-espresso">
            Speak with Our Booksellers
          </h1>
          <p className="text-sm text-bookverse-espresso/70 font-sans leading-relaxed">
            Looking for a rare out-of-print edition, recommendations for your book club, or tracking inquiries? We are always here to talk books.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-bookverse-cream border border-bookverse-beige rounded-3xl p-8 shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-bookverse-espresso pb-3 border-b border-bookverse-beige">
              The Flagship Desk
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-bookverse-terracotta/10 text-bookverse-terracotta flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-bookverse-espresso">Flagship Bookstore</h3>
                  <p className="text-bookverse-espresso/70 mt-0.5">
                    Bahrisons Lane, Shop 12-14, Khan Market, New Delhi, 110003
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-bookverse-sage/10 text-bookverse-sage flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-bookverse-espresso">Email Inquiries</h3>
                  <p className="text-bookverse-espresso/70 mt-0.5">curators@bookverse.in</p>
                  <p className="text-bookverse-espresso/50 text-[11px]">Orders: support@bookverse.in</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-bookverse-terracotta/10 text-bookverse-terracotta flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-bookverse-espresso">Store Helpline</h3>
                  <p className="text-bookverse-espresso/70 mt-0.5">+91 (011) 2461-9876</p>
                  <p className="text-bookverse-espresso/50 text-[11px]">WhatsApp: +91 98110 09876</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-bookverse-sage/10 text-bookverse-sage flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-bookverse-espresso">Hours of Curation</h3>
                  <p className="text-bookverse-espresso/70 mt-0.5">
                    Monday &ndash; Sunday: 10:00 AM &ndash; 8:30 PM IST
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-bookverse-beige/70">
              <span className="text-[11px] font-semibold text-bookverse-sage block mb-1">
                Response SLA:
              </span>
              <p className="text-xs text-bookverse-espresso/70">
                All reader notes and shipment tracking queries receive human responses within 24 hours.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-bookverse-cream border border-bookverse-beige rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
            <h2 className="font-serif text-2xl font-bold text-bookverse-espresso">
              Send a Note to the Desk
            </h2>

            {isSuccess ? (
              <div className="p-8 text-center bg-bookverse-sage-light rounded-2xl border border-bookverse-sage/30 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-bookverse-sage mx-auto" />
                <h3 className="font-serif text-lg font-bold text-bookverse-espresso">
                  Message Delivered
                </h3>
                <p className="text-xs text-bookverse-espresso/70 max-w-sm mx-auto">
                  Thank you for writing to BookVerse. One of our literary curators has received your inquiry and will be in touch shortly.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-3 text-xs font-semibold text-bookverse-terracotta underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Patel"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="priya@example.in"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1.5">
                    Subject of Inquiry *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Book recommendation / Order query / Author edition"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can assist your reading journey..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-bookverse-terracotta text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-bookverse-terracotta-hover shadow-warm transition-all disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Deliver Note to Curators</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
