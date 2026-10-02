// app/about/page.tsx
import Link from 'next/link';
import { Award, Users, Target, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar'; // ✅ Navbar import

export const metadata = {
  title: 'About Us - Open Manufacturing',
  description:
    'Learn about our mission, values, and commitment to manufacturing excellence.',
};

export default function AboutPage() {
  return (
    <>
      {/* ✅ Navbar */}
      <Navbar />

      <div className="min-h-screen bg-white">
        {/* ✅ Hero Section with extra top padding */}
        <div className="relative overflow-hidden">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-800 to-sky-600 text-white pt-28 md:pt-32 pb-16 md:pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
              {/* background glow effects */}
              <div className="absolute -top-20 -left-20 w-56 h-56 bg-blue-400/20 blur-3xl rounded-full" />
              <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-indigo-500/20 blur-3xl rounded-full" />

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                About Open Manufacturing
              </h1>
              <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto">
                A trusted partner in precision manufacturing, delivering quality
                parts and exceptional service since 2005.
              </p>
            </div>
          </div>
        </div>

        {/* About Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
            <div>
              <h2 className="text-3xl font-semibold text-slate-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Founded in 2005, Open Manufacturing began as a small machine
                  shop with a vision to revolutionize the manufacturing industry
                  through advanced technology and unwavering commitment to
                  quality. Over the years, we have grown into a full-service
                  manufacturing partner serving industries from aerospace to
                  consumer products.
                </p>
                <p>
                  Today, we operate a 50,000 square foot facility equipped with
                  the latest CNC machinery, injection molding equipment, and
                  additive manufacturing technology. Our team of experienced
                  engineers and machinists work collaboratively to turn your
                  designs into reality.
                </p>
                <p>
                  What sets us apart is our dedication to customer success. We
                  do not just manufacture parts — we partner with you to
                  optimize designs, reduce costs, and accelerate time to market.
                  Every project receives the same attention to detail, whether
                  it is a prototype or a production run of thousands.
                </p>
              </div>
            </div>

            <div className="relative">
              <div
                className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg ring-1 ring-slate-100"
                style={{
                  backgroundImage:
                    'url(https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg?auto=compress&cs=tinysrgb&w=1600)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              {/* Subtle overlay badge */}
              <div className="absolute -top-4 -left-4 bg-white/80 backdrop-blur px-4 py-2 rounded-lg shadow-sm border border-slate-100">
                <div className="text-xs text-slate-700 font-medium">
                  Precision Facility
                </div>
                <div className="text-sm text-slate-900 font-semibold">
                  50,000 sq ft
                </div>
              </div>
            </div>
          </div>

          {/* Mission */}
          <div className="mb-20 text-center">
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              To empower innovators and manufacturers with precision parts, fast
              turnaround times, and exceptional service — enabling them to bring
              their products to market faster and more efficiently.
            </p>
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="text-3xl font-semibold text-slate-900 mb-8 text-center">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  Icon: Award,
                  title: 'Quality First',
                  desc: 'Uncompromising quality standards in every part we manufacture.',
                },
                {
                  Icon: Users,
                  title: 'Customer Focus',
                  desc: 'Your success is our success. We are committed to your satisfaction.',
                },
                {
                  Icon: Zap,
                  title: 'Innovation',
                  desc: 'Investing in cutting-edge technology and continuous improvement.',
                },
                {
                  Icon: Target,
                  title: 'Reliability',
                  desc: 'On-time delivery and consistent quality you can count on.',
                },
              ].map(({ Icon, title, desc }) => (
                <Card key={title} className="border-0 shadow-sm">
                  <CardContent className="pt-6 text-center">
                    <div className="inline-flex items-center justify-center p-3 rounded-full bg-gradient-to-br from-sky-50 to-indigo-50 mb-4 ring-1 ring-slate-100">
                      <Icon className="h-7 w-7 text-sky-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">
                      {title}
                    </h3>
                    <p className="text-slate-600 text-sm">{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-slate-50 rounded-2xl p-8 md:p-12 mb-12 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-3xl font-semibold text-slate-900 mb-8 text-center">
              By the Numbers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                ['18+', 'Years Experience'],
                ['5000+', 'Projects Completed'],
                ['300+', 'Active Clients'],
                ['99.8%', 'Quality Rate'],
              ].map(([num, label]) => (
                <div key={num} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                    {num}
                  </div>
                  <div className="text-slate-600">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-white to-sky-50 border border-slate-200 shadow-lg p-8 md:p-12 text-center">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-sky-300/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-400/20 blur-3xl rounded-full" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3">
                Work with Open Manufacturing
              </h3>
              <p className="text-slate-600 mb-6">
                Looking for a manufacturing partner who values quality, speed,
                and clear communication? Let’s talk — we’ll help you choose the
                right process and get your parts into production.
              </p>

              <div className="flex items-center justify-center gap-4">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="relative overflow-hidden group text-white font-medium bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-indigo-600 hover:to-sky-500 transition-all duration-300 px-6 py-3 rounded-xl shadow-lg"
                  >
                    <span className="relative z-10 flex items-center">
                      Contact Our Team
                    </span>
                  </Button>
                </Link>
                <a
                  href="mailto:hello@OpenManufacturing.com"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-slate-200 text-slate-700 text-sm hover:bg-slate-100 transition"
                >
                  hello@OpenManufacturing.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
