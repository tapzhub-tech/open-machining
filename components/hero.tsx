import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pipeline } from "@/data/platform";

const HERO_VIDEO_URL = "/assets/hero/hero-bg.mp4";

const secondary = [
  { label: "Manufacture with us", href: "/manufacture-with-us" },
  { label: "Explore opportunities", href: "/opportunities" },
  { label: "Register as Vendor", href: "/register" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 pt-28 md:pt-36 pb-16 md:pb-24">
      <video
        src={HERO_VIDEO_URL}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950" />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-blue-300 mb-6">
            <span className="h-px w-8 bg-blue-400" />
            Procurement intelligence · Bid management · Contract manufacturing
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-6">
            From opportunity
            <br />
            <span className="text-blue-400">to delivery.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed mb-10">
            Find the opportunity. Build the bid. Manufacture. Deliver. Open
            Machining brings procurement, engineering and India&apos;s
            manufacturing capacity together in one platform.
          </p>

          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
            {/* Primary action */}
            <Link
              href="/machine-server"
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-7 py-4 text-base font-semibold text-white hover:bg-blue-500 transition"
            >
              Machining Capacity
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            {secondary.map((b) => (
              <Link
                key={b.href}
                href={b.href}
                className="inline-flex items-center justify-center rounded-md border border-white/30 px-7 py-4 text-base font-semibold text-white hover:bg-white hover:text-slate-900 transition"
              >
                {b.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Find → Bid → Build → Deliver */}
        <ol className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
          {pipeline.map((stage) => (
            <li key={stage.id} className="bg-slate-950/80 backdrop-blur p-6">
              <Link href={stage.href} className="group block">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-2xl font-bold text-white">{stage.title}</span>
                  <span className="font-mono text-xs text-slate-500">{stage.step}</span>
                </div>
                <p className="text-sm text-slate-400 mb-4">{stage.tagline}</p>
                <ul className="space-y-1.5">
                  {stage.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                      <span className="h-1 w-1 rounded-full bg-blue-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
