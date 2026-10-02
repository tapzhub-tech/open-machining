"use client";

import Image from "next/image";
import processData from "../data/process.json";

type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

type ProcessData = {
  steps: ProcessStep[];
  cta: string;
  image: string;
};

export function ProcessSection() {
  const { steps, cta, image } = processData as ProcessData;

  if (!steps.length) {
    return (
      <section className="py-16 md:py-24 bg-white text-center">
        <p className="text-red-500 text-sm">
          No process steps configured.
        </p>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">
            How To Work With{" "}
            <span className="text-[#1E6BF5]">Open Manufacturing</span>
          </h2>

          <div className="space-y-10 relative">
            <div className="absolute left-[26px] top-2 bottom-2 w-[2px] bg-slate-200" />

            {steps.map((step: ProcessStep, index: number) => (
              <div key={index} className="flex items-start gap-6 relative z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold border text-[15px]
                  ${
                    index === 0
                      ? "bg-[#1E6BF5] text-white border-[#1E6BF5]"
                      : "bg-white text-slate-700 border-slate-300"
                  }`}
                >
                  {step.number}
                </div>

                <div>
                  <h3
                    className={`text-lg font-semibold mb-1 ${
                      index === 0 ? "text-[#1E6BF5]" : "text-slate-900"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-[15px] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <button className="bg-[#1E6BF5] hover:bg-[#165be0] text-white font-semibold px-6 py-3 rounded-md shadow transition">
              {cta}
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex justify-center lg:justify-end">
          <Image
            src={image}
            alt="Process illustration"
            width={720}
            height={520}
            className="rounded-xl object-contain drop-shadow-md"
            priority
          />
        </div>
      </div>
    </section>
  );
}
