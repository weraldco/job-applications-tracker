import Image from "next/image";
import { Check } from "lucide-react";

const APP_URL = "https://jobstashr.vercel.app";

export function Hero() {
  const trustBadges = [
    "Free to Start",
    "No Credit Card",
    "100% Private",
  ];

  return (
    <section className="relative overflow-hidden bg-slate-50 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 md:pb-24 lg:px-8 lg:pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
          {/* Left: Copy */}
          <div className="flex-1 space-y-6 lg:max-w-xl">
            <p className="text-sm font-medium uppercase tracking-wider text-[#f97316]">
              AI-Powered Job Tracker
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-5xl xl:text-6xl">
              Never Lose Track of a Job Application Again
            </h1>
            <p className="text-lg text-slate-600 sm:text-xl">
              JobStashr helps active job seekers, interns, and professionals
              track applications, automate data entry, and never miss a
              follow-up.
            </p>

            {/* CTA microcopy */}
            <p className="text-sm text-slate-500">
              Secure and private. Your data stays yours.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-[#f97316] px-8 py-4 text-base font-semibold text-white shadow-lg transition-colors hover:bg-[#ea580c] focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
              >
                Start Tracking Free
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-xl border-2 border-slate-300 px-8 py-4 text-base font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                See How It Works
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 pt-4">
              {trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600"
                >
                  <Check className="h-5 w-5 flex-shrink-0 text-[#f97316]" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Hero visual with floating badges */}
          <div className="relative flex-1 lg:flex lg:justify-end">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                <Image
                  src="/images/hero.png"
                  alt="JobStashr dashboard showing job applications and analytics"
                  width={600}
                  height={400}
                  priority
                  className="h-auto w-full object-cover"
                />
              </div>
              {/* Floating trust badges on image */}
              <div className="absolute -bottom-3 left-4 rounded-lg bg-white px-4 py-2 shadow-lg sm:left-8">
                <span className="text-sm font-semibold text-slate-800">
                  Free to Start
                </span>
              </div>
              <div className="absolute -right-2 top-8 rounded-lg bg-white px-4 py-2 shadow-lg sm:top-12">
                <span className="text-sm font-semibold text-slate-800">
                  AI-Powered
                </span>
              </div>
              <div className="absolute -left-2 top-1/2 rounded-lg bg-white px-4 py-2 shadow-lg sm:top-1/2">
                <span className="text-sm font-semibold text-slate-800">
                  100% Private
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
