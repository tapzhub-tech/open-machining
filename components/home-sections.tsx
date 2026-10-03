// components/home-sections.tsx
import Link from 'next/link';
import { ArrowRight, FileText, Plane, Car, Cpu, Heart, ShoppingBag, Zap, Factory, Shield } from 'lucide-react';
import { audiences, proofMarkers, tenderFlow } from '@/data/platform';
import { industries } from '@/data/industries';
import { getOpportunities } from '@/data/opportunities';
import { OpportunityBoard } from '@/components/opportunity-board';

export function SectionHeading({
  eyebrow,
  title,
  body,
  dark = false,
}: {
  eyebrow: string;
  title: React.ReactNode;
  body?: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-3xl mb-10 md:mb-14">
      <p className={`text-xs font-semibold uppercase tracking-[0.2em] mb-3 ${dark ? 'text-blue-300' : 'text-blue-700'}`}>
        {eyebrow}
      </p>
      <h2 className={`text-3xl md:text-4xl font-bold tracking-tight mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>
        {title}
      </h2>
      {body && <p className={`text-lg leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{body}</p>}
    </div>
  );
}

export function PageHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <header className="relative overflow-hidden bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-20">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:48px_48px]"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300 mb-4">{eyebrow}</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-5 max-w-4xl">{title}</h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">{body}</p>
      </div>
    </header>
  );
}

export async function LiveOpportunitiesSection() {
  const { items, isSample } = await getOpportunities();
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Live opportunities"
          title="Opportunities, matched to real capacity."
          body="Government, PSU, defence and private manufacturing requirements — identified and matched to the capabilities of our manufacturing network."
        />
        <OpportunityBoard items={items} isSample={isSample} preview />
      </div>
    </section>
  );
}

async function getCapacityMetrics() {
  try {
    const { getMachineServerStats, supabaseAdmin, supabase } = await import('@/lib/supabase');
    const stats = await getMachineServerStats(supabaseAdmin ?? supabase);
    const metrics = [
      { value: stats.vendorsCount, label: 'Registered vendors' },
      { value: stats.machinesCount, label: 'Machines on floor' },
      { value: stats.technicalStaffCount, label: 'Skilled technical staff' },
      { value: stats.programmersCount, label: 'CNC programmers' },
    ];
    return metrics.some((m) => m.value > 0) ? metrics : null;
  } catch (e) {
    console.error('Failed to load capacity metrics for homepage:', e);
    return null;
  }
}

export async function NetworkProofSection() {
  const metrics = await getCapacityMetrics();
  return (
    <section className="py-16 md:py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          dark
          eyebrow="The network behind every order"
          title="Engineering-led. Quality-controlled. Built on India's MSME capacity."
          body="Every order is engineered, sourced and inspected by one accountable team, drawing on a qualified network of manufacturing partners."
        />
        {metrics && (
          <div className="mb-6">
            <dl className="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-xl border border-blue-400/30 bg-blue-400/30">
              {metrics.map((m) => (
                <div key={m.label} className="bg-slate-900 p-6 md:p-8">
                  <dt className="sr-only">{m.label}</dt>
                  <dd className="text-4xl md:text-5xl font-bold tabular-nums text-white mb-2">
                    {m.value.toLocaleString('en-IN')}
                  </dd>
                  <dd className="text-sm font-medium text-blue-200">{m.label}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-3 flex justify-end">
              <Link
                href="/machine-server"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-blue-200"
              >
                View machining capacity
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        )}
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
          {proofMarkers.map((m) => (
            <div key={m.value} className="bg-slate-950 p-6 md:p-8">
              <dt className="text-2xl md:text-3xl font-bold text-white mb-2">{m.value}</dt>
              <dd className="text-sm text-slate-400 leading-relaxed">{m.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function TenderFlowSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="For contract holders"
            title="Have a tender? We build the manufacturing capability behind it."
            body="Send us the tender PDF, BOQ and drawings. We work out what it takes to manufacture, price it properly, and if you're awarded, we execute."
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/bid-management"
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500 transition"
            >
              <FileText className="h-5 w-5" />
              Share a tender
            </Link>
            <Link
              href="/bid-management"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 px-6 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition"
            >
              How bid management works
            </Link>
          </div>
        </div>
        <ol className="lg:col-span-7 relative space-y-0">
          {tenderFlow.map((s, i) => (
            <li key={s.title} className="relative flex gap-5 pb-7 last:pb-0">
              {i < tenderFlow.length - 1 && (
                <span aria-hidden className="absolute left-[19px] top-10 bottom-0 w-px bg-slate-200" />
              )}
              <span
                className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border font-mono text-sm font-semibold ${
                  i === tenderFlow.length - 1
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 bg-white text-slate-700'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="pt-1.5">
                <h3 className="font-semibold text-slate-900">{s.title}</h3>
                <p className="text-slate-600 text-[15px] leading-relaxed">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function AudiencesSection() {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Who we work with" title="One platform, three sides of the order." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {audiences.map((a) => (
            <div key={a.who} className="flex flex-col rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 mb-4">{a.who}</p>
              <p className="text-xl font-semibold text-slate-900 leading-snug mb-3">&ldquo;{a.quote}&rdquo;</p>
              <p className="text-slate-600 leading-relaxed mb-6 flex-1">{a.body}</p>
              <Link
                href={a.cta.href}
                className="group inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-800"
              >
                {a.cta.label}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const industryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Plane,
  Car,
  Cpu,
  Heart,
  ShoppingBag,
  Zap,
  Shield,
};

export function IndustriesStrip() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Industries"
          title="Precision parts for demanding industries."
          body="Industrial and precision manufacturing first — with the documentation and traceability regulated sectors expect."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {industries.map((ind) => {
            const Icon = industryIcons[ind.icon] ?? Factory;
            return (
              <Link
                key={ind.id}
                href={`/industries/${ind.slug}`}
                className="group rounded-xl border border-slate-200 p-5 hover:border-blue-600 hover:shadow-md transition"
              >
                <Icon className="h-7 w-7 text-slate-700 group-hover:text-blue-600 mb-4 transition-colors" />
                <p className="font-semibold text-slate-900">{ind.name}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="bg-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">From opportunity to delivery.</h2>
          <p className="text-blue-100 text-lg">Bring us a drawing, a BOQ or a tender. We&apos;ll take it from there.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/manufacture-with-us"
            className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 font-semibold text-blue-800 hover:bg-blue-50 transition"
          >
            Start a project
          </Link>
          <Link
            href="/network"
            className="inline-flex items-center justify-center rounded-md border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10 transition"
          >
            Join as a manufacturer
          </Link>
        </div>
      </div>
    </section>
  );
}
