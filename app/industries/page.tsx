import Link from "next/link";
import {
  Plane,
  Car,
  Cpu,
  Heart,
  ShoppingBag,
  Zap,
  ArrowRight,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";

import { industries } from "@/data/industries";
import { IndustriesSection } from "@/components/industries-section";
import type { IndustryUI } from "@/types/industry";

/* ---------------- ICON MAP ---------------- */

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

export const metadata = {
  title: "Industries We Serve - OpenManufacturing",
  description:
    "Trusted manufacturing partner for aerospace, automotive, medical, and more industries.",
};

export default function IndustriesPage() {
  /* ---------------- NORMALIZE LOCAL DATA ---------------- */

  const industriesUI: IndustryUI[] = industries.map((ind, idx) => ({
    id: String(ind.id),
    slug: ind.slug,
    name: ind.name,
    description: ind.description,
    detailedDescription: ind.detailedDescription ?? "",
    icon: ind.icon ?? "plane",
    applications: ind.applications ?? [],
    imageUrl: `/assets/industry${(idx % 6) + 1}.jpg`,
    imageAlt: ind.name,
  }));

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white">
        {/* ================= HERO ================= */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-indigo-700 to-sky-500" />
          <div className="relative z-10 text-white pt-28 md:pt-32 pb-16 md:pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Industries We Serve
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Trusted by leading companies across diverse industries for
                mission-critical components and assemblies.
              </p>
            </div>
          </div>
        </div>

        {/* ================= CARDS ================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {industriesUI.map((industry) => {
              const iconRaw = industry.icon || "plane";
              const applications = industry.applications || [];

              const iconKey = iconRaw
                .trim()
                .toLowerCase()
                .replace(/[\s_\-]+/g, "");

              const Icon =
                iconMap[iconKey] ??
                iconMap[iconRaw] ??
                Plane;

              return (
                <Card
                  key={industry.id}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50 to-[#f8fbff] border border-slate-200 shadow-md hover:shadow-xl transition-transform hover:-translate-y-1"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b from-sky-400 to-indigo-600/80" />

                  <CardHeader className="px-6 pt-6 pb-0">
                    {/* ✅ ONLY LUCIDE ICON */}
                    <div className="mb-4">
                      <div className="inline-flex p-3 rounded-full bg-gradient-to-br from-sky-50 to-indigo-50 ring-1 ring-sky-100">
                        <Icon className="h-6 w-6 text-sky-600" />
                      </div>
                    </div>

                    <CardTitle className="text-2xl font-semibold text-slate-900 mb-2">
                      {industry.name}
                    </CardTitle>

                    <CardDescription className="text-[15.5px] text-slate-600 leading-relaxed">
                      {industry.detailedDescription || industry.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-6 pt-6 pb-6">
                    {applications.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-slate-900 mb-3">
                          Applications:
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {applications.map((app, idx) => (
                            <li
                              key={idx}
                              className="flex items-center text-sm text-slate-700"
                            >
                              <span className="w-2.5 h-2.5 mr-3 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600" />
                              {app}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Link href={`/industries/${industry.slug}`}>
                      <Button
                        variant="outline"
                        className="w-full mt-4 group border-slate-200 bg-white/60 hover:bg-white"
                      >
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* ================= CAROUSEL ================= */}
        <IndustriesSection industries={industriesUI} />
      </div>
    </>
  );
}
