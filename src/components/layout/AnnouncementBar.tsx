"use client";

import React, { useState } from "react";
import { Sparkles, X } from "lucide-react";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-bookverse-espresso text-bookverse-cream text-xs sm:text-sm py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="w-6 hidden sm:block"></div>
        <div className="flex-1 flex items-center justify-center gap-2 text-center">
          <Sparkles className="w-3.5 h-3.5 text-bookverse-terracotta shrink-0 animate-pulse" />
          <span>
            Complimentary pan-India delivery on orders above ₹499 &bull; Use code{" "}
            <span className="font-semibold text-bookverse-terracotta underline decoration-dotted">
              FIRSTBOOK
            </span>{" "}
            for 15% off
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-bookverse-beige/70 hover:text-white transition-colors p-1"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
