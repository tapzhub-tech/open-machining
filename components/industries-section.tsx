// components/industries-section.tsx
"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Plane,
  Car,
  Cpu,
  Heart,
  ShoppingBag,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { IndustryUI } from "@/types/industry";

const ICON_BG = "bg-white border border-slate-200";
const ICON_BG_ACTIVE = "bg-[#1E6BF5] text-white shadow-2xl";

const iconMap: Record<string, any> = {
  plane: Plane,
  car: Car,
  cpu: Cpu,
  heart: Heart,
  shoppingbag: ShoppingBag,
  zap: Zap,
  Plane,
  Car,
  Cpu,
  Heart,
  ShoppingBag,
  Zap,
};

export function IndustriesSection({ industries = [] }: { industries?: IndustryUI[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const prevIndex = useRef(0);
  const [dir, setDir] = useState<"left" | "right">("right");

  useEffect(() => {
    setDir(activeIndex >= prevIndex.current ? "right" : "left");
    prevIndex.current = activeIndex;
  }, [activeIndex]);

  const images = useMemo(
    () => (industries ?? []).map((ind, i) => ind?.imageUrl || `/assets/industry${(i % 6) + 1}.jpg`),
    [industries]
  );

/*   const iconBasePaths = useMemo(
    () => (industries ?? []).map((_, i) => `/assets/industry-icon${i + 1}`),
    [industries]
  ); */

  if (!industries || industries.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="text-center px-4">
          <div className="mx-auto h-6 w-48 rounded-full bg-slate-100 animate-pulse" />
        </div>
      </section>
    );
  }

  const handlePrev = () => setActiveIndex((s) => (s - 1 + industries.length) % industries.length);
  const handleNext = () => setActiveIndex((s) => (s + 1) % industries.length);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="text-center mb-8 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          Quality Parts for Various <span className="text-[#1E6BF5]">Industries</span>
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Trusted by leading companies across diverse industries for mission-critical components.
        </p>
      </div>

      <div className="relative w-full bg-white border-t border-b border-slate-100 py-8">
        <button
          onClick={handlePrev}
          aria-label="Previous industry"
          className="hidden md:flex items-center justify-center h-10 w-10 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md absolute left-6 top-1/2 -translate-y-1/2 z-20"
        >
          <ChevronLeft className="h-5 w-5 text-slate-600" />
        </button>

        <button
          onClick={handleNext}
          aria-label="Next industry"
          className="hidden md:flex items-center justify-center h-10 w-10 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md absolute right-6 top-1/2 -translate-y-1/2 z-20"
        >
          <ChevronRight className="h-5 w-5 text-slate-600" />
        </button>

        <div
          className="hidden md:grid w-full"
          style={{ gridTemplateColumns: `repeat(${industries.length}, minmax(0, 1fr))` }}
        >
          {industries.map((ind, i) => {
            const isActive = i === activeIndex;
            const iconKey = (ind.icon || "").toString().trim().toLowerCase().replace(/[\s_\-]+/g, "");
            const Icon = iconMap[iconKey] || iconMap[ind.icon || ""] || null;
            // const base = iconBasePaths[i];

            return (
              <button
                key={ind.id}
                onClick={() => setActiveIndex(i)}
                aria-pressed={isActive}
                className="flex flex-col items-center justify-center gap-3 py-8 transition-transform duration-200 transform hover:-translate-y-1 focus:outline-none"
                style={{ minHeight: 160 }}
              >
                <div
                  className={`relative rounded-full transition-all duration-200 flex items-center justify-center ${
                    isActive ? ICON_BG_ACTIVE : ICON_BG
                  }`}
                  style={{
                    height: isActive ? 110 : 88,
                    width: isActive ? 110 : 88,
                    boxShadow: isActive ? "0 12px 30px rgba(30,107,245,0.18)" : undefined,
                    overflow: "hidden",
                  }}
                >
                  {/* <img
                    src={`${base}.jpg`}
                    alt="" // removed visible alt text to prevent browser from rendering text
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.remove();
                    }}
                  /> */}
                  <div className={`relative z-10 flex items-center justify-center ${isActive ? "h-8 w-8" : "h-7 w-7"}`}>
                    {Icon && <Icon className={`${isActive ? "text-white" : "text-slate-700"} h-full w-full`} />}
                  </div>
                </div>

                <span className={`mt-2 text-[15px] font-semibold text-center ${isActive ? "text-[#1E6BF5]" : "text-slate-700"}`}>
                  {ind.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-4xl relative rounded-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={images[activeIndex] ?? activeIndex}
                src={images[activeIndex]}
                alt={industries[activeIndex]?.imageAlt || industries[activeIndex]?.name || "industry image"}
                initial={{ x: dir === "right" ? 120 : -120, opacity: 0, scale: 0.985 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: dir === "right" ? -120 : 120, opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="w-full object-cover rounded-2xl h-[280px] md:h-[420px] lg:h-[560px]"
              />
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-slate-50 rounded-2xl p-8 h-full flex flex-col justify-center shadow-sm border border-slate-100">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">
              {industries[activeIndex]?.name}
            </h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              {industries[activeIndex]?.description}
            </p>

            <div className="flex flex-wrap gap-3 items-center">
              <Link
                href={`/industries/${industries[activeIndex]?.slug}`}
                className="inline-flex items-center gap-3 bg-[#1E6BF5] text-white px-5 py-3 rounded-md shadow hover:bg-[#165be0] transition"
              >
                Learn more
              </Link>

              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-md hover:shadow-sm"
              >
                Next industry
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
