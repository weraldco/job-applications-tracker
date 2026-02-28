import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/images/logo.png"      
            alt="JobStashr"
            width={36}
            height={36}
          />
          <div>
            <span className="text-lg font-semibold text-slate-900">
              JobStashr
            </span>
            <p className="hidden text-xs text-slate-500 sm:block">
              Manage and track your job applications efficiently
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link
           href="/auth/signin"
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-xl bg-[#f97316] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#ea580c]"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
