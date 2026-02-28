const APP_URL = "https://jobstashr.vercel.app";

export function FinalCTA() {
  return (
    <section className="bg-slate-50 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Ready to take control of your job search?
        </h2>
        <p className="mt-6 text-lg text-slate-600">
          Join thousands of job seekers who track applications, automate data
          entry, and never miss a follow-up. Start free today.
        </p>

        <div className="mt-10">
          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-[#f97316] px-12 py-5 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-[#ea580c] focus:outline-none focus:ring-2 focus:ring-[#f97316] focus:ring-offset-2"
          >
            Start Tracking Free
          </a>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          Free to start. No credit card required. Your data stays private.
        </p>
      </div>
    </section>
  );
}
