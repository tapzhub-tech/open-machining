// app/services/page.tsx

import { ServicesSection } from '@/components/services-section'
import { Navbar } from '@/components/navbar'

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Same blocks as Home page */}
        <ServicesSection />
      </main>
    </>
  )
}
