// app/page.tsx
import { Hero } from '@/components/hero';
import { ServicesSection } from '@/components/services-section';
import { WhyChooseUs } from '@/components/why-choose-us';
import { IndustriesSection } from '@/components/industries-section';
import { ProcessSection } from '@/components/process-section';
import { Navbar } from '@/components/navbar'; // <- add this

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <ServicesSection />
        <WhyChooseUs />
        <IndustriesSection />
        <ProcessSection />
      </main>
    </>
  );
}
