// app/page.tsx
import { Hero } from '@/components/hero';
import { ServicesSection } from '@/components/services-section';
import { Navbar } from '@/components/navbar';
import {
  AudiencesSection,
  CtaBand,
  IndustriesStrip,
  LiveOpportunitiesSection,
  NetworkProofSection,
  TenderFlowSection,
} from '@/components/home-sections';

// Tenders are edited in /admin; refresh listings every 5 minutes.
export const revalidate = 300;

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <NetworkProofSection />
        <LiveOpportunitiesSection />
        <TenderFlowSection />
        <ServicesSection />
        <AudiencesSection />
        <IndustriesStrip />
        <CtaBand />
      </main>
    </>
  );
}
