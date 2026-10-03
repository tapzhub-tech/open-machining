import Link from 'next/link';
import { ArrowRight, ClipboardList, Gavel, Award, Factory } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { PageHeader, SectionHeading } from '@/components/home-sections';

export const metadata = {
  title: 'Manufacturing Network | Open Machining',
  description:
    'Join the Open Machining manufacturing network. Tell us what you can manufacture and we bring you matched opportunities.',
};

const pipelineStages = [
  { icon: ClipboardList, label: 'Matched RFQs', body: 'Requirements matched to your machines, processes and certifications.' },
  { icon: Gavel, label: 'Bidding', body: 'Quote on the work you want; we handle the buyer and the tender paperwork.' },
  { icon: Award, label: 'Awarded', body: 'Clear purchase orders, specifications and delivery schedules.' },
  { icon: Factory, label: 'In production', body: 'Engineering support, inspection and logistics coordinated with you.' },
];

const steps = [
  'Register your facility, machines and processes',
  'Our team verifies capability and quality systems',
  'Receive opportunities matched to what you make',
  'Quote, manufacture and get paid on clear terms',
];

export default function NetworkPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          eyebrow="For manufacturers"
          title="Tell us what you can manufacture. We'll bring you the opportunities."
          body="Open Machining tracks government, PSU, defence and private requirements and routes the right work to qualified MSMEs — so you can spend time making parts, not hunting for customers."
        />

        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Your order pipeline"
              title="From matched RFQ to production, in one view."
              body="Every partner gets a pipeline of opportunities that fit their capability, from first match through to production."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pipelineStages.map(({ icon: Icon, label, body }) => (
                <div key={label} className="rounded-xl border border-slate-200 p-6">
                  <Icon className="h-7 w-7 text-blue-600 mb-4" />
                  <h3 className="font-semibold text-slate-900 mb-1">{label}</h3>
                  <p className="text-slate-600 text-[15px] leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <SectionHeading eyebrow="How to join" title="Become a qualified partner." />
            <ol className="space-y-4">
              {steps.map((s, i) => (
                <li key={s} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 font-mono text-sm font-semibold text-white">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="font-medium text-slate-900">{s}</span>
                </li>
              ))}
              <li>
                <Link
                  href="/register"
                  className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-6 py-4 font-semibold text-white hover:bg-blue-500 transition"
                >
                  Register your facility
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </li>
            </ol>
          </div>
        </section>
      </main>
    </>
  );
}
