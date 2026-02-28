import {
  FileSpreadsheet,
  Clock,
  Copy,
  BarChart3,
  AlertCircle,
  Repeat,
} from "lucide-react";

const problems = [
  {
    icon: FileSpreadsheet,
    title: "Scattered spreadsheets & notes",
    description:
      "Applications buried across multiple tabs, emails, and docs—hard to find when you need to follow up.",
  },
  {
    icon: Clock,
    title: "Missed follow-ups",
    description:
      "No reminders means opportunities slip away. Recruiters move on while you lose track of time.",
  },
  {
    icon: Copy,
    title: "Manual copy-paste hell",
    description:
      "Spending hours typing job details by hand instead of focusing on your applications and interviews.",
  },
  {
    icon: BarChart3,
    title: "No visibility into your pipeline",
    description:
      "No idea how many applications you sent, your response rate, or where you stand in your search.",
  },
  {
    icon: AlertCircle,
    title: "Stress & lower success rates",
    description:
      "The chaos leads to anxiety and missed opportunities—exactly when you need to perform your best.",
  },
  {
    icon: Repeat,
    title: "Duplicate or forgotten applications",
    description:
      "Applying twice to the same company or forgetting you already applied—looks unprofessional and wastes time.",
  },
];

export function ProblemSection() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Sound familiar?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            Job seekers face the same friction every day. Here&apos;s what we fix.
          </p>
        </div>

        <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((item, index) => (
            <li
              key={index}
              className="group flex gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-6 transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#f97316]/10 text-[#f97316] transition-colors group-hover:bg-[#f97316]/20">
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
