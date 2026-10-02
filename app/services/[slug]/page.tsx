// app/services/[slug]/page.tsx

import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Settings,
  Layers,
  Zap,
  Box,
  Square,
  Package,
  ArrowLeft,
} from 'lucide-react'
import { services } from '@/data/services'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const iconMap: Record<string, any> = {
  Settings,
  Layers,
  Zap,
  Box,
  Square,
  Package,
}

function getServiceBySlug(slug: string) {
  return services.find((s) => s.slug === slug) || null
}

export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }))
}

export function generateMetadata({
  params,
}: {
  params: { slug: string }
}) {
  const service = getServiceBySlug(params.slug)
  if (!service) return {}

  return {
    title: `${service.name} - PrecisionMFG`,
    description: service.description,
  }
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const service = getServiceBySlug(params.slug)
  if (!service) notFound()

  const Icon = iconMap[service.icon] || Settings

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-indigo-700 to-sky-500" />

        <div className="relative text-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <Link
              href="/services"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Services
            </Link>

            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 rounded-2xl bg-white/10">
                <Icon className="h-10 w-10 text-sky-300" />
              </div>
              <h1 className="text-4xl font-semibold">{service.name}</h1>
            </div>

            <p className="max-w-3xl text-white/90">
              {service.detailedDescription || service.description}
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-16">
        {service.features?.length && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {service.features.map((f, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  {f}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-10">
          <Link href="/contact">
            <Button>Get Instant Quote</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
