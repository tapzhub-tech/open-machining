// app/industries/[slug]/page.tsx
// Individual industry detail page — driven entirely by local data/industries.ts
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Plane, Car, Cpu, Heart, ShoppingBag, Zap, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { industries } from '@/data/industries';
import type { IndustryUI } from '@/types/industry';

const iconMap: Record<string, any> = {
  plane: Plane, Plane,
  car: Car, Car,
  cpu: Cpu, Cpu,
  heart: Heart, Heart,
  shoppingbag: ShoppingBag, ShoppingBag,
  zap: Zap, Zap,
};

// Tell Next.js which slugs exist at build time
export function generateStaticParams() {
  return industries.map((ind) => ({ slug: ind.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const industry = industries.find((i) => i.slug === params.slug);
  if (!industry) return {};
  return {
    title: `${industry.name} — OpenManufacturing`,
    description: industry.description,
  };
}

export default function IndustryDetailPage({ params }: { params: { slug: string } }) {
  const raw = industries.find((i) => i.slug === params.slug);
  if (!raw) notFound();

  const idx = industries.indexOf(raw);
  const industry: IndustryUI = {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    description: raw.description,
    detailedDescription: raw.detailedDescription ?? '',
    icon: raw.icon ?? 'plane',
    applications: raw.applications ?? [],
    imageUrl: `/assets/industry${(idx % 6) + 1}.jpg`,
    imageAlt: raw.name,
  };

  const iconKey = industry.icon!.trim().toLowerCase().replace(/[\s_-]+/g, '');
  const Icon = iconMap[iconKey] ?? iconMap[industry.icon!] ?? Plane;

  // Prev / Next navigation
  const prev = industries[idx - 1] ?? null;
  const next = industries[idx + 1] ?? null;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white">
        {/* Hero */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-indigo-700 to-sky-500" />
          <div className="relative z-10 text-white pt-28 md:pt-32 pb-16 md:pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Link
                href="/industries"
                className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                All Industries
              </Link>
              <div className="flex items-center gap-4 mb-4">
                <div className="inline-flex p-3 rounded-full bg-white/10 ring-1 ring-white/20">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold">{industry.name}</h1>
              </div>
              <p className="text-xl text-white/90 max-w-3xl">
                {industry.detailedDescription || industry.description}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Main card */}
            <div className="lg:col-span-2">
              <Card className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-md">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-400 to-indigo-600/80 rounded-l-2xl" />
                <CardHeader className="px-6 pt-6 pb-0">
                  <CardTitle className="text-2xl font-semibold text-slate-900 mb-2">
                    {industry.name}
                  </CardTitle>
                  <CardDescription className="text-[15.5px] text-slate-600 leading-relaxed">
                    {industry.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pt-6 pb-6">
                  {industry.applications && industry.applications.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Key Applications</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {industry.applications.map((app, i) => (
                          <li key={i} className="flex items-center text-sm text-slate-700">
                            <span className="w-2.5 h-2.5 mr-3 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex-shrink-0" />
                            {app}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Prev / Next */}
              <div className="flex justify-between mt-8 gap-4">
                {prev ? (
                  <Link href={`/industries/${prev.slug}`} className="flex-1">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      {prev.name}
                    </Button>
                  </Link>
                ) : <div className="flex-1" />}
                {next ? (
                  <Link href={`/industries/${next.slug}`} className="flex-1">
                    <Button variant="outline" className="w-full justify-end gap-2">
                      {next.name}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : <div className="flex-1" />}
              </div>
            </div>

            {/* Sidebar — all industries */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 text-sm uppercase tracking-wider mb-4">
                All Industries
              </h3>
              {industries.map((ind) => {
                const k = (ind.icon ?? 'plane').trim().toLowerCase().replace(/[\s_-]+/g, '');
                const IndIcon = iconMap[k] ?? iconMap[ind.icon ?? ''] ?? Plane;
                const active = ind.slug === params.slug;
                return (
                  <Link key={ind.id} href={`/industries/${ind.slug}`}>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition ${
                      active
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}>
                      <IndIcon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-medium">{ind.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-white to-sky-50 border border-slate-200 shadow-lg p-8 md:p-12 text-center">
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Register your company or contact us to discuss how we can support your{' '}
              {industry.name.toLowerCase()} manufacturing needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-indigo-600 hover:to-sky-500 text-white px-8 rounded-xl shadow-lg">
                  Register a Vendor
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="px-8 rounded-xl">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
