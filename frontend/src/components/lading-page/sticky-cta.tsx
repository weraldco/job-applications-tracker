"use client";

import { useState, useEffect } from "react";

const APP_URL = "https://jobstashr.vercel.app";

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after user scrolls ~400px
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 py-4 shadow-lg backdrop-blur-sm transition-transform duration-300">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        <p className="hidden text-sm font-medium text-slate-700 sm:block">
          Ready to track your job applications?
        </p>
        <a
          href={APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center rounded-xl bg-[#f97316] px-6 py-3.5 text-base font-semibold text-white shadow-md transition-colors hover:bg-[#ea580c] sm:flex-initial"
        >
          Start Tracking Free
        </a>
      </div>
    </div>
  );
}
