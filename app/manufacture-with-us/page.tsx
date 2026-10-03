import { Navbar } from '@/components/navbar';
import { PageHeader } from '@/components/home-sections';
import { RfqForm } from '@/components/rfq-form';

export const metadata = {
  title: 'Manufacture With Us | Open Machining',
  description: 'Send a manufacturing request (RFQ) with your drawing, quantity, material and delivery requirements.',
};

export default function ManufactureWithUsPage() {
  return (
    <>
      <div className="print:hidden">
        <Navbar />
        <PageHeader
          eyebrow="RFQ / Order entry"
          title="Manufacture with us."
          body="Send us your part, drawing and delivery requirements. Our engineers review every request and route it to the right machines in the network."
        />
      </div>
      <main className="bg-slate-50 py-10 md:py-14 print:bg-white print:py-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <RfqForm />
        </div>
      </main>
    </>
  );
}
