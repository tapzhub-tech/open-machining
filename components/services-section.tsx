// components/services-section.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { services } from "@/data/services";

/* ---------------- TYPES ---------------- */

type ServiceUI = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
};

/* ---------------- HELPERS ---------------- */

function truncate(text: string, max = 120) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

/* ---------------- COMPONENT ---------------- */

export function ServicesSection() {
  // 🔥 Local services → UI format
  const servicesUI: ServiceUI[] = services.map((s, i) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    description: s.description,
    imageUrl: `/assets/home_capabilities/${s.slug}.png`, // 👈 local image
    imageAlt: `${s.name} service`,
  }));

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= HEADING ================= */}
        <div className="max-w-3xl mb-10 md:mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3 text-blue-700">
            Build · Contract manufacturing
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
            Prototype to production, across processes.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            One accountable partner for machining, moulding, additive and
            assembly, backed by a qualified network of manufacturers.
          </p>
        </div>

        {/* ================= CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
          {servicesUI.map((service) => (
            <div
              key={service.id}
              className="relative bg-[#F6F8FA] rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col
                w-[280px] h-[460px]"
            >
              {/* Image */}
              <div className="h-48 w-full overflow-hidden bg-white">
                <img
                  src={service.imageUrl}
                  alt={service.imageAlt}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Text */}
              <div className="flex-1 p-5">
                <h3 className="text-[20px] font-semibold text-slate-900 mb-2 tracking-tight">
                  {service.name}
                </h3>
                <p className="text-slate-600 text-[14.5px] leading-relaxed">
                  {truncate(service.description)}
                </p>
              </div>

              {/* Arrow */}
              <Link
                href={`/services/${service.slug}`}
                className="absolute bottom-0 right-0 group"
                aria-label={`Open ${service.name}`}
              >
                <div className="bg-slate-900 text-white px-4 py-3 rounded-tl-2xl hover:bg-slate-800 transition-colors">
                  <ArrowRight className="h-5 w-5 translate-x-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
