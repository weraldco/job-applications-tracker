import Image from "next/image";

const links = [
  { href: "#how-it-works", label: "How It Works" },
  { href: "#features", label: "Features" },
];

const socials = [
  { href: "https://linkedin.com", label: "LinkedIn", external: true },
  { href: "https://twitter.com", label: "Twitter", external: true },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="JobStashr"
              width={40}
              height={40}
              className=""
            />
            <span className="text-lg font-semibold text-slate-900">
              JobStashr
            </span>
          </div>

          
            <p className="mt-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} JobStashr. Manage and track your
          job applications efficiently.
        </p>
        </div>

      </div>
    </footer>
  );
}
