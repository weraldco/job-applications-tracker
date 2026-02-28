import Image from "next/image";
import { ChevronRight, ChevronDown } from "lucide-react";

const steps = [
  {
    title: "Choose in 3 ways to summarize",
    description:
      "Use a job description, paste a job URL, or upload a PDF/DOCX file—pick what works for you.",
    image: "/images/step1.png",
  },
  {
    title: "Paste URL or upload file",
    description:
      "Drop your job posting link or file. JobStashr pulls it in instantly—no manual copying.",
    image: "/images/step2.png",
  },
  {
    title: "Get your summarized job application",
    description:
      "AI extracts title, company, skills, and requirements. Review, edit if needed, and add to your tracker.",
    image: "/images/step3.png",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 bg-slate-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
            Three simple steps. No spreadsheets. No copy-paste.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-center lg:gap-6">
          {steps.map((step, index) => (
            <div key={index} className="contents">
              <div className="flex flex-1 flex-col lg:max-w-sm">
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-shadow hover:shadow-lg">
                  <div className="relative aspect-video w-full">
                    <Image
                      src={step.image}
                      alt={step.title}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <span className="mb-2 inline-block text-sm font-medium text-[#f97316]">
                      Step {index + 1}
                    </span>
                    <h3 className="font-semibold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex flex-shrink-0 items-center justify-center">
                  <ChevronDown className="h-8 w-8 text-slate-300 lg:hidden" />
                  <ChevronRight className="hidden h-8 w-8 text-slate-300 lg:block" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
