import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

/**
 * ===============================
 * LOCAL HERO CONFIG (TEMP FIX)
 * ===============================
 * Agar future me CMS wapas lana ho
 * bas yaha se source change karna hoga
 */

const HERO_VIDEO_URL = "/assets/hero/hero-bg.mp4";
// agar kabhi video nahi ho to gradient fallback rahega

export function Hero() {
  const videoUrl = HERO_VIDEO_URL;

  return (
    <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
      {videoUrl ? (
        <video
          src={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      )}

      {/* overlay */}
      <div className="absolute inset-0 bg-slate-900/70" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Open Manufacturing
          <br />
          <span className="text-slate-300">
            Explore manufacturing in India
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed">
          Advanced CNC machining, injection molding, and rapid prototyping
          services. From concept to production, we deliver quality parts with
          fast turnaround times.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/register">
            <Button
              size="lg"
              className="bg-white text-slate-900 hover:bg-slate-100 text-lg px-8 py-6 group"
            >
              Register a Vendor
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <Link href="/services">
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-900 text-lg px-8 py-6"
            >
              View Services
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-white">
              500+
            </div>
            <div className="text-sm text-slate-300">
              Projects Completed
            </div>
          </div>

          <div className="border-l border-r border-slate-600">
            <div className="text-3xl md:text-4xl font-bold text-white">
              24hr
            </div>
            <div className="text-sm text-slate-300">
              Quick Turnaround
            </div>
          </div>

          <div>
            <div className="text-3xl md:text-4xl font-bold text-white">
              99.8%
            </div>
            <div className="text-sm text-slate-300">
              Quality Rate
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
