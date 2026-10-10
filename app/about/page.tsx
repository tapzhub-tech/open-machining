// app/about/page.tsx
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { PageHeader, SectionHeading } from '@/components/home-sections';
import { pipeline } from '@/data/platform';
import { company } from '@/data/company';

export const metadata = {
  title: 'About Us | Open Machining',
  description:
    'Open Machining connects manufacturing opportunities, bid management and India’s manufacturing capacity — from opportunity to delivery.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <PageHeader
          eyebrow="About us"
          title="From opportunity to delivery."
          body="Open Machining brings procurement, engineering and India's manufacturing capacity together in one platform."
        />

        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="What we do" title="One accountable partner, from tender to delivered part." />
            </div>
            <div className="lg:col-span-7 space-y-5 text-lg text-slate-600 leading-relaxed">
              <p>
                We identify manufacturing opportunities across government, PSU, defence and private buyers, and match
                them to the capabilities of our network of manufacturers.
              </p>
              <p>
                For contract holders, we analyse tenders, cost the manufacturing with real supplier quotations and
                prepare the bid. For buyers and OEMs, we take drawings from prototype to production across machining,
                fabrication, moulding, additive and assembly.
              </p>
              <p>
                For manufacturers, we bring matched orders — so they can spend their time making parts instead of
                hunting for customers. Every order is engineered, sourced and inspected through to delivery.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pipeline.map((stage) => (
                <li key={stage.id} className="rounded-xl border border-slate-200 p-6">
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xl font-bold text-slate-900">{stage.title}</span>
                    <span className="font-mono text-xs text-slate-400">{stage.step}</span>
                  </div>
                  <p className="text-sm text-slate-600">{stage.tagline}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-slate-50 py-14 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="flex items-start gap-3">
              <MapPin className="h-6 w-6 mt-1 flex-shrink-0 text-blue-600" />
              <div>
                <p className="font-semibold text-slate-900 mb-1">{company.name}</p>
                {company.addressLines.map((line) => (
                  <p key={line} className="text-slate-600">{line}</p>
                ))}
              </div>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-7 py-4 font-semibold text-white hover:bg-blue-700 transition"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
