// app/machine-server/page.tsx
import Link from 'next/link';
import { AlertCircle, ArrowRight, Cpu, Factory, Users, Wrench } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { VendorCapacityTable } from '@/components/machine-server/vendor-capacity-table';
import { getMachineServerStats, supabase, supabaseAdmin, type MachineServerStats } from '@/lib/supabase';

export const metadata = {
  title: 'Machining Capacity | Open Machining',
  description: 'Live machining capacity across the Open Machining vendor network: machines, skilled staff, CNC programmers and industry coverage.',
};

// Capacity changes as vendors register; refresh every 5 minutes.
export const revalidate = 300;

async function loadStats(): Promise<MachineServerStats | null> {
  try {
    return await getMachineServerStats(supabaseAdmin ?? supabase);
  } catch (e) {
    console.error('[machine-server] Failed to load stats:', e);
    return null;
  }
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 mb-2">{eyebrow}</p>
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
    </div>
  );
}

/** Single-series horizontal bars: one hue, value labelled in text ink. */
function BarList({ data, unit }: { data: { name: string; count: number }[]; unit: string }) {
  if (!data.length) return <p className="text-sm text-slate-500">No data yet.</p>;
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <ul className="space-y-3">
      {data.map((d) => (
        <li key={d.name} title={`${d.name}: ${d.count} ${unit}`}>
          <div className="flex items-baseline justify-between gap-4 text-sm mb-1.5">
            <span className="font-medium text-slate-700">{d.name}</span>
            <span className="font-semibold tabular-nums text-slate-900">{d.count}</span>
          </div>
          <div className="h-2.5 rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-blue-600" style={{ width: `${(d.count / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function MachineServerPage() {
  const stats = await loadStats();

  const kpis = stats
    ? [
        { label: 'Registered vendors', value: stats.vendorsCount, icon: Factory },
        { label: 'Machines on floor', value: stats.machinesCount, icon: Wrench },
        { label: 'Skilled technical staff', value: stats.technicalStaffCount, icon: Users },
        { label: 'CNC programmers', value: stats.programmersCount, icon: Cpu },
      ]
    : [];

  const ratio =
    stats && stats.programmersCount > 0 ? (stats.technicalStaffCount / stats.programmersCount).toFixed(1) : '—';
  const avgMachines =
    stats && stats.vendorsCount > 0 ? (stats.machinesCount / stats.vendorsCount).toFixed(1) : '—';

  return (
    <>
      <Navbar />
      <main className="bg-slate-50">
        {/* Header + KPIs */}
        <header className="relative overflow-hidden bg-slate-950 pt-32 pb-14 md:pt-40 md:pb-20">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:48px_48px]"
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300 mb-4">Machining capacity</p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-5 max-w-4xl">
              Industrial capacity, live from the network.
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed mb-10 md:mb-14">
              Machines, skilled people and programming depth across every registered Open Machining vendor.
            </p>

            {stats && (
              <dl className="grid grid-cols-2 lg:grid-cols-4 gap-px overflow-hidden rounded-xl border border-blue-400/30 bg-blue-400/30">
                {kpis.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="bg-slate-900 p-5 md:p-8">
                    <Icon className="h-6 w-6 text-blue-300 mb-4" aria-hidden />
                    <dt className="sr-only">{label}</dt>
                    <dd className="text-4xl md:text-5xl font-bold tabular-nums text-white mb-1">
                      {value.toLocaleString('en-IN')}
                    </dd>
                    <dd className="text-sm font-medium text-blue-200">{label}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </header>

        {!stats ? (
          <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center gap-3 text-center">
            <AlertCircle className="h-10 w-10 text-red-400" />
            <p className="font-medium text-red-600">Live capacity data is unavailable right now.</p>
            <p className="text-sm text-slate-500">Please try again shortly.</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 space-y-14 md:space-y-20">
            {/* Coverage + machine types */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                <SectionTitle eyebrow="Coverage" title="What the network can build" />
                <p className="text-sm text-slate-500 -mt-3 mb-6">Vendors serving each industry</p>
                <BarList data={stats.industryData} unit="vendors" />
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
                <SectionTitle eyebrow="Machine types on floor" title={`${stats.machinesCount.toLocaleString('en-IN')} units`} />
                <p className="text-sm text-slate-500 -mt-3 mb-6">Machines by type</p>
                <BarList data={stats.machineTypeData} unit="machines" />
              </div>
            </section>

            {/* Workforce */}
            <section>
              <SectionTitle eyebrow="Workforce" title="Programming depth behind the machines" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { value: stats.technicalStaffCount.toLocaleString('en-IN'), label: 'Skilled technical hands' },
                  { value: stats.programmersCount.toLocaleString('en-IN'), label: 'CNC programmers' },
                  { value: `${ratio}:1`, label: 'Staff to programmer ratio' },
                  { value: avgMachines, label: 'Average machines per vendor' },
                ].map((w) => (
                  <div key={w.label} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-3xl font-bold tabular-nums text-slate-900 mb-1">{w.value}</p>
                    <p className="text-sm text-slate-600">{w.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-500">
                Programming capacity is the bottleneck resource in most job shops — a lower staff-to-programmer ratio
                means more programming depth per technician.
              </p>
            </section>

            {/* Vendor register */}
            <section>
              <SectionTitle eyebrow="Vendor register" title="Capacity by vendor" />
              <p className="text-sm text-slate-500 -mt-3 mb-6">
                Vendor identities are kept confidential. Click a column heading to sort.
              </p>
              <VendorCapacityTable vendors={stats.vendorDetails} />
            </section>

            {/* CTA */}
            <section className="rounded-2xl bg-blue-700 p-8 md:p-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">Put this capacity to work.</h2>
                <p className="text-blue-100">Send us a drawing and we&apos;ll route it to the right machines.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/manufacture-with-us"
                  className="group inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 font-semibold text-blue-800 hover:bg-blue-50 transition"
                >
                  Manufacture with us
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-md border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10 transition"
                >
                  Register as Vendor
                </Link>
              </div>
            </section>
          </div>
        )}
      </main>
    </>
  );
}
