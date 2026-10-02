//components/why-choose-us.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle, Clock, Award, HeadphonesIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Feature = {
  id: string;
  icon: any;
  title: string;
  description: string;
  image: string;
};

const features: Feature[] = [
  {
    id: "quality",
    icon: CheckCircle,
    title: "Quality Assurance",
    description:
      "ISO 9001:2015 certified with rigorous quality control processes ensuring every part meets specifications.",
    image: "/assets/whyChooseUs1.png",
  },
  {
    id: "technology",
    icon: Award,
    title: "Advanced Technology",
    description:
      "State-of-the-art equipment and cutting-edge manufacturing technologies for superior results.",
    image: "/assets/whyChooseUs2.png",
  },
  {
    id: "leadtime",
    icon: Clock,
    title: "Fast Lead Times",
    description:
      "Quick turnaround times from quote to delivery without compromising quality or precision.",
    image: "/assets/whyChooseUs3.png",
  },
  {
    id: "support",
    icon: HeadphonesIcon,
    title: "Expert Support",
    description:
      "Dedicated engineering support and design for manufacturability (DFM) analysis at no extra cost.",
    image: "/assets/whyChooseUs4.png",
  },
];

export function WhyChooseUs() {
  const [active, setActive] = useState<string>(features[0].id);
  const activeFeature = features.find((f) => f.id === active) || features[0];

  const prevIndexRef = useRef<number>(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    const newIndex = features.findIndex((f) => f.id === active);
    const prevIndex = prevIndexRef.current;
    setSlideDirection(newIndex >= prevIndex ? "right" : "left");
    prevIndexRef.current = newIndex;
  }, [active]);

  const variants = {
    enterRight: { x: 120, opacity: 0 },
    enterLeft: { x: -120, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exitRight: { x: 120, opacity: 0 },
    exitLeft: { x: -120, opacity: 0 },
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-4">
            Why Choose <span className="text-[#3B82F6]">Open Manufacturing</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Experience the difference of working with a manufacturing partner committed to excellence and innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-3 flex justify-center lg:justify-start">
            <div className="space-y-6 w-full max-w-xs">
              {features.map((f) => {
                const Icon = f.icon;
                const isActive = f.id === active;
                return (
                  <button
                    key={f.id}
                    onClick={() => setActive(f.id)}
                    className={`w-full flex items-center gap-4 p-6 rounded-full transition-all duration-200 focus:outline-none ${
                      isActive
                        ? "bg-[#1E6BF5] text-white shadow-lg"
                        : "bg-white border border-slate-200 text-slate-700 hover:shadow-sm"
                    }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${
                        isActive ? "bg-white/20" : "bg-slate-50"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-700"}`} />
                    </span>

                    <div className="text-left">
                      <div className={`font-semibold text-base ${isActive ? "text-white" : "text-slate-800"}`}>
                        {f.title}
                      </div>
                      {!isActive ? (
                        <div className="text-[13px] text-slate-400 mt-1">
                          {f.description.slice(0, 48) + (f.description.length > 48 ? "…" : "")}
                        </div>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full h-full max-w-xl relative overflow-hidden rounded-3xl">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeFeature.image}
                  src={activeFeature.image}
                  alt={activeFeature.title}
                  initial={slideDirection === "right" ? "enterRight" : "enterLeft"}
                  animate="center"
                  exit={slideDirection === "right" ? "exitLeft" : "exitRight"}
                  variants={variants}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-[520px] object-cover rounded-3xl shadow-lg border border-slate-100 absolute top-0 left-0"
                />
              </AnimatePresence>

              <div
                aria-hidden
                className="pointer-events-none w-full h-[520px] rounded-3xl bg-slate-50"
              />
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="pl-2 lg:pl-6">
              <h3 className="text-3xl font-semibold text-slate-900 mb-4">{activeFeature.title}</h3>
              <p className="text-slate-600 mb-6">{activeFeature.description}</p>

              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-4">
                  <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1E6BF5]/10 text-[#1E6BF5]">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                  <span className="text-slate-700">Certified processes & rigorous checks</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1E6BF5]/10 text-[#1E6BF5]">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                  <span className="text-slate-700">Experienced engineering & support</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1E6BF5]/10 text-[#1E6BF5]">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                  <span className="text-slate-700">Fast, reliable delivery and DFM</span>
                </li>
              </ul>

              <div className="mt-4">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-3 bg-[#1E6BF5] text-white px-5 py-3 rounded-md shadow hover:bg-[#165be0] transition"
                >
                  Request a Quote
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
