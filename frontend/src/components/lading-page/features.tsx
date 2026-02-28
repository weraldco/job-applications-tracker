import { Sparkles, ListTodo, Bell } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Job Summarizer",
    description:
      "Paste a job URL or upload a PDF—AI extracts title, company, skills, and requirements automatically. No more manual data entry.",
  },
  {
    icon: ListTodo,
    title: "Job Application Tracker",
    description:
      "Track status, notes, and dates for every application. Full analytics: response rate, interview rate, and pipeline visibility.",
  },
  {
    icon: Bell,
    title: "Job Reminders",
    description:
      "Set follow-up reminders and never miss a chance to check in. Stay on top of every opportunity.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            What Makes JobStashr Awesome
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            Built for job seekers who want to move faster and stress less.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((item, index) => (
            <div
              key={index}
              className="group rounded-xl border border-slate-200 bg-slate-50/50 p-8 transition-shadow hover:shadow-lg"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f97316]/10 text-[#f97316] transition-colors group-hover:bg-[#f97316]/20">
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-3 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
