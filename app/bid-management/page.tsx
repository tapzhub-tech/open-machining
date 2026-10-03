import Link from 'next/link';
import { CheckCircle, FileText } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { CtaBand, PageHeader, SectionHeading, TenderFlowSection } from '@/components/home-sections';

export const metadata = {
  title: 'Bid Management | Open Machining',
  description:
    'Tender analysis, technical qualification, BOQ costing, supplier sourcing and bid documentation for manufacturing contracts.',
};

const services = [
  { title: 'Tender analysis', body: 'Scope, specifications, eligibility criteria and commercial terms, read and summarised.' },
  { title: 'Technical qualification', body: 'Process, material and certification requirements checked against network capability.' },
  { title: 'BOQ analysis & costing', body: 'Line-by-line manufacturing cost built from real supplier quotations.' },
  { title: 'Supplier sourcing', body: 'Qualified partners lined up for every process before you commit to a price.' },
  { title: 'Bid documentation', body: 'Technical and commercial documents assembled and checked for completeness.' },
  { title: 'Submission workflow', body: 'Deadlines, clarifications and submission coordinated end to end.' },
];

const inputs = ['Tender PDF or RFQ', 'Bill of quantities (BOQ)', 'Drawings & specifications', 'Delivery schedule'];

export default function BidManagementPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Bid & contract management"
          title="Bid with the manufacturing already worked out."
          body="We analyse the tender, cost the manufacturing with real quotations, prepare the bid — and if it's awarded, we execute production through to delivery."
        />

        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading eyebrow="What we handle" title="Everything between the tender notice and the purchase order." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div key={s.title} className="rounded-xl border border-slate-200 p-6">
                  <CheckCircle className="h-6 w-6 text-blue-600 mb-4" />
                  <h3 className="font-semibold text-slate-900 mb-1">{s.title}</h3>
                  <p className="text-slate-600 text-[15px] leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <TenderFlowSection />

        <section className="py-16 md:py-20 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <SectionHeading
              dark
              eyebrow="Get started"
              title="Send us what you have."
              body="Share the documents and we'll come back with a view on manufacturability, sourcing and bid economics."
            />
            <div className="rounded-xl border border-white/10 bg-white/5 p-7">
              <ul className="space-y-3 mb-7">
                {inputs.map((i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-200">
                    <FileText className="h-5 w-5 text-blue-300" />
                    {i}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500 transition"
              >
                Discuss a tender
              </Link>
            </div>
          </div>
        </section>

        <CtaBand />
      </main>
    </>
  );
}
