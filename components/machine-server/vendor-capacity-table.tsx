'use client';

import { useMemo, useState } from 'react';
import type { MachineServerStats } from '@/lib/supabase';

type Vendor = MachineServerStats['vendorDetails'][number];
type SortKey = 'location' | 'machines' | 'staff' | 'programmers' | 'industries';

const columns: { key: SortKey; label: string; numeric?: boolean }[] = [
  { key: 'location', label: 'State' },
  { key: 'machines', label: 'Machines', numeric: true },
  { key: 'staff', label: 'Staff', numeric: true },
  { key: 'programmers', label: 'Programmers', numeric: true },
  { key: 'industries', label: 'Industries' },
];

export function VendorCapacityTable({ vendors }: { vendors: Vendor[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('machines');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sorted = useMemo(() => {
    const val = (v: Vendor) =>
      sortKey === 'industries' ? v.industries.length : sortKey === 'location' ? v.location ?? '' : v[sortKey];
    return [...vendors].sort((a, b) => {
      const av = val(a);
      const bv = val(b);
      const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [vendors, sortKey, sortDir]);

  const toggle = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir(key === 'location' ? 'asc' : 'desc');
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-5 py-3">Vendor</th>
            {columns.map((c) => (
              <th
                key={c.key}
                aria-sort={sortKey === c.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                className={`px-5 py-3 ${c.numeric ? 'text-right' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => toggle(c.key)}
                  className={`inline-flex items-center gap-1 uppercase tracking-wider hover:text-slate-900 ${
                    sortKey === c.key ? 'text-slate-900' : ''
                  }`}
                >
                  {c.label}
                  <span aria-hidden className="w-3">{sortKey === c.key ? (sortDir === 'asc' ? '↑' : '↓') : ''}</span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sorted.map((v) => (
            <tr key={v.id} className="hover:bg-slate-50">
              <td className="px-5 py-4 whitespace-nowrap">
                <span className="font-mono text-xs text-slate-400 mr-2">{v.id}</span>
                <span className="font-semibold tracking-widest text-slate-900">{v.name}</span>
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-slate-700">{v.location ?? <span className="text-slate-300">—</span>}</td>
              <td className="px-5 py-4 text-right tabular-nums font-semibold text-slate-900">{v.machines}</td>
              <td className="px-5 py-4 text-right tabular-nums text-slate-700">{v.staff}</td>
              <td className="px-5 py-4 text-right tabular-nums text-slate-700">{v.programmers}</td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap gap-1.5">
                  {v.industries.map((ind) => (
                    <span key={ind} className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
                      {ind}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
          {!sorted.length && (
            <tr>
              <td colSpan={6} className="px-5 py-10 text-center text-slate-500">No vendors registered yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
