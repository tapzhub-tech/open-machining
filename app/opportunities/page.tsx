import { Navbar } from '@/components/navbar';
import { CtaBand, PageHeader } from '@/components/home-sections';
import { OpportunityBoard } from '@/components/opportunity-board';
import { getOpportunities } from '@/data/opportunities';

// Tenders are edited in /admin; refresh listings every 5 minutes.
export const revalidate = 300;

export const metadata = {
  title: 'Opportunities | Open Machining',
  description:
    'Government, PSU, defence and private manufacturing opportunities, filtered by process, value and closing date.',
};

export default async function OpportunitiesPage() {
  const { items, isSample } = await getOpportunities();

  return (
    <>
      <Navbar />
      <main>
        <PageHeader
          eyebrow="Procurement intelligence"
          title="Manufacturing opportunities, in one place."
          body="Tenders, PSU and defence procurement, and private RFQs — filtered by process, value and deadline, and matched to the capabilities of our manufacturing network."
        />
        <section className="py-12 md:py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <OpportunityBoard items={items} isSample={isSample} />
          </div>
        </section>
        <CtaBand />
      </main>
    </>
  );
}
