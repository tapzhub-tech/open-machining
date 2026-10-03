// data/opportunities.ts
// Opportunity model for the procurement-intelligence view.
//
// Live data comes from the Supabase `tenders` table (managed in /admin).
// Until that table has rows — or when Supabase isn't configured — the
// illustrative `sampleOpportunities` are shown and the pages label them as
// samples.

export type Sector = 'Government' | 'PSU' | 'Defence' | 'Private';
export type Process = 'CNC' | 'Sheet Metal' | 'Fabrication' | 'Electronics' | 'Assembly' | 'Moulding';

export interface Opportunity {
  id: string;
  title: string;
  buyer: string;
  sector: Sector;
  processes: Process[];
  /** Estimated value in INR */
  value: number;
  location: string;
  /** ISO date (YYYY-MM-DD) */
  closesOn: string;
  matched: boolean;
}

export const sectors: Sector[] = ['Government', 'PSU', 'Defence', 'Private'];
export const processes: Process[] = ['CNC', 'Sheet Metal', 'Fabrication', 'Electronics', 'Assembly', 'Moulding'];

export const valueBands = [
  { id: 'lt10l', label: '₹1L–₹10L', min: 1_00_000, max: 10_00_000 },
  { id: '10l-1cr', label: '₹10L–₹1Cr', min: 10_00_000, max: 1_00_00_000 },
  { id: 'gt1cr', label: '₹1Cr+', min: 1_00_00_000, max: Infinity },
] as const;

function inDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const sampleOpportunities: Opportunity[] = [
  { id: 'S-1042', title: 'Machined aluminium enclosures, 6061-T6 (1,200 nos)', buyer: 'State electronics corporation', sector: 'Government', processes: ['CNC'], value: 18_50_000, location: 'Karnataka', closesOn: inDays(4), matched: true },
  { id: 'S-1043', title: 'Sheet metal control panel cabinets with powder coating', buyer: 'Power distribution PSU', sector: 'PSU', processes: ['Sheet Metal', 'Fabrication'], value: 64_00_000, location: 'Maharashtra', closesOn: inDays(11), matched: true },
  { id: 'S-1044', title: 'Precision turned components for actuator assemblies', buyer: 'Defence public sector unit', sector: 'Defence', processes: ['CNC', 'Assembly'], value: 1_35_00_000, location: 'Telangana', closesOn: inDays(19), matched: true },
  { id: 'S-1045', title: 'Injection moulded ABS housings, tooling included', buyer: 'Consumer appliance OEM', sector: 'Private', processes: ['Moulding'], value: 22_00_000, location: 'Tamil Nadu', closesOn: inDays(6), matched: true },
  { id: 'S-1046', title: 'Structural steel fabrication for test rigs', buyer: 'Central research laboratory', sector: 'Government', processes: ['Fabrication'], value: 8_75_000, location: 'Delhi NCR', closesOn: inDays(2), matched: false },
  { id: 'S-1047', title: 'PCB assembly and box build for monitoring units', buyer: 'Railway signalling PSU', sector: 'PSU', processes: ['Electronics', 'Assembly'], value: 2_40_00_000, location: 'Uttar Pradesh', closesOn: inDays(24), matched: true },
  { id: 'S-1048', title: 'Wire-cut and CNC milled fixture plates', buyer: 'Automotive tier-1 supplier', sector: 'Private', processes: ['CNC'], value: 4_20_000, location: 'Gujarat', closesOn: inDays(9), matched: true },
  { id: 'S-1049', title: 'Stainless steel brackets and laser-cut parts', buyer: 'Municipal water board', sector: 'Government', processes: ['Sheet Metal'], value: 3_10_000, location: 'Kerala', closesOn: inDays(5), matched: false },
];

export async function getOpportunities(): Promise<{ items: Opportunity[]; isSample: boolean }> {
  const sample = { items: sampleOpportunities, isSample: true };
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return sample;

  try {
    const { supabase } = await import('@/lib/supabase');
    const { data, error } = await supabase
      .from('tenders')
      .select('id, reference_no, title, buyer, sector, processes, value, location, closes_on, matched')
      .order('closes_on', { ascending: true, nullsFirst: false });
    if (error) throw error;
    if (!data?.length) return sample;

    return {
      isSample: false,
      items: data.map((t) => ({
        id: t.reference_no || String(t.id).slice(0, 8).toUpperCase(),
        title: t.title,
        buyer: t.buyer,
        sector: t.sector as Sector,
        processes: (t.processes ?? []).filter((p: string): p is Process => (processes as string[]).includes(p)),
        value: Number(t.value) || 0,
        location: t.location ?? '',
        closesOn: t.closes_on ?? '',
        matched: !!t.matched,
      })),
    };
  } catch (e) {
    console.error('Failed to load tenders, showing sample opportunities:', e);
    return sample;
  }
}

export function formatINR(value: number) {
  if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(2).replace(/\.?0+$/, '')} Cr`;
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(1).replace(/\.0$/, '')} L`;
  return `₹${value.toLocaleString('en-IN')}`;
}

/** Days until close; NaN when there is no closing date. */
export function daysUntil(isoDate: string) {
  if (!isoDate) return NaN;
  const ms = new Date(isoDate + 'T23:59:59').getTime() - Date.now();
  return Math.ceil(ms / 86_400_000);
}
