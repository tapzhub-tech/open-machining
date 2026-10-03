'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Info } from 'lucide-react';
import {
  type Opportunity,
  type Process,
  type Sector,
  daysUntil,
  formatINR,
  processes,
  sectors,
  valueBands,
} from '@/data/opportunities';

type ValueBandId = (typeof valueBands)[number]['id'];

function toggle<T>(list: T[], value: T) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
        active
          ? 'border-blue-600 bg-blue-600 text-white'
          : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
      }`}
    >
      {children}
    </button>
  );
}

const sectorStyle: Record<Sector, string> = {
  Government: 'bg-sky-50 text-sky-700 ring-sky-200',
  PSU: 'bg-violet-50 text-violet-700 ring-violet-200',
  Defence: 'bg-slate-100 text-slate-700 ring-slate-300',
  Private: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
};

function OpportunityRow({ o }: { o: Opportunity }) {
  const days = daysUntil(o.closesOn);
  return (
    <li className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center px-5 py-4 hover:bg-slate-50 transition">
      <div className="md:col-span-6">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-mono text-xs text-slate-400">{o.id}</span>
          <span className={`rounded px-2 py-0.5 text-xs font-medium ring-1 ${sectorStyle[o.sector]}`}>
            {o.sector}
          </span>
          {o.matched && (
            <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
              Network match
            </span>
          )}
        </div>
        <p className="font-semibold text-slate-900 leading-snug">{o.title}</p>
        <p className="text-sm text-slate-500">
          {o.buyer} · {o.location}
        </p>
      </div>
      <div className="md:col-span-3 flex flex-wrap gap-1.5">
        {o.processes.map((p) => (
          <span key={p} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {p}
          </span>
        ))}
      </div>
      <div className="md:col-span-1 font-semibold text-slate-900 tabular-nums">{formatINR(o.value)}</div>
      <div className="md:col-span-2 md:text-right text-sm tabular-nums">
        {Number.isNaN(days) ? (
          <span className="text-slate-400">No deadline</span>
        ) : days < 0 ? (
          <span className="text-slate-400">Closed</span>
        ) : (
          <span className={days <= 7 ? 'font-semibold text-amber-700' : 'text-slate-600'}>
            Closes in {days} {days === 1 ? 'day' : 'days'}
          </span>
        )}
      </div>
    </li>
  );
}

export function OpportunityBoard({
  items,
  isSample,
  preview = false,
}: {
  items: Opportunity[];
  isSample: boolean;
  /** Homepage teaser: no filters, matched items only, capped list */
  preview?: boolean;
}) {
  const [sel, setSel] = useState<Sector[]>([]);
  const [proc, setProc] = useState<Process[]>([]);
  const [bands, setBands] = useState<ValueBandId[]>([]);
  const [closingSoon, setClosingSoon] = useState(false);
  const [matchedOnly, setMatchedOnly] = useState(false);

  const filtered = useMemo(() => {
    if (preview) return items.filter((o) => o.matched && !(daysUntil(o.closesOn) < 0)).slice(0, 4);
    return items.filter((o) => {
      if (sel.length && !sel.includes(o.sector)) return false;
      if (proc.length && !o.processes.some((p) => proc.includes(p))) return false;
      if (bands.length) {
        const inBand = valueBands.some((b) => bands.includes(b.id) && o.value >= b.min && o.value < b.max);
        if (!inBand) return false;
      }
      if (closingSoon) {
        const d = daysUntil(o.closesOn);
        if (!(d >= 0 && d <= 7)) return false;
      }
      if (matchedOnly && !o.matched) return false;
      return true;
    });
  }, [items, preview, sel, proc, bands, closingSoon, matchedOnly]);

  const matchedCount = items.filter((o) => o.matched).length;
  const anyFilter = sel.length || proc.length || bands.length || closingSoon || matchedOnly;

  return (
    <div>
      {isSample && (
        <p className="mb-4 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          Sample listings shown for illustration. Live tender and RFQ tracking is being rolled out.
        </p>
      )}

      {!preview && (
        <div className="mb-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-20 text-xs font-semibold uppercase tracking-wider text-slate-500">Sector</span>
            {sectors.map((s) => (
              <Chip key={s} active={sel.includes(s)} onClick={() => setSel(toggle(sel, s))}>
                {s}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-20 text-xs font-semibold uppercase tracking-wider text-slate-500">Process</span>
            {processes.map((p) => (
              <Chip key={p} active={proc.includes(p)} onClick={() => setProc(toggle(proc, p))}>
                {p}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-20 text-xs font-semibold uppercase tracking-wider text-slate-500">Value</span>
            {valueBands.map((b) => (
              <Chip key={b.id} active={bands.includes(b.id)} onClick={() => setBands(toggle(bands, b.id))}>
                {b.label}
              </Chip>
            ))}
            <span className="mx-1 h-5 w-px bg-slate-200" />
            <Chip active={closingSoon} onClick={() => setClosingSoon(!closingSoon)}>
              Closing this week
            </Chip>
            <Chip active={matchedOnly} onClick={() => setMatchedOnly(!matchedOnly)}>
              Network matches
            </Chip>
            {anyFilter ? (
              <button
                type="button"
                onClick={() => {
                  setSel([]);
                  setProc([]);
                  setBands([]);
                  setClosingSoon(false);
                  setMatchedOnly(false);
                }}
                className="ml-1 text-sm font-medium text-blue-700 hover:underline"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm">
          <span className="font-semibold text-slate-900">
            {preview ? 'Matched opportunities' : `${filtered.length} of ${items.length} opportunities`}
          </span>
          <span className="text-slate-500">
            {matchedCount} match Open Machining&apos;s network
          </span>
        </div>
        {filtered.length ? (
          <ul className="divide-y divide-slate-100">
            {filtered.map((o) => (
              <OpportunityRow key={o.id} o={o} />
            ))}
          </ul>
        ) : (
          <p className="px-5 py-10 text-center text-slate-500">No opportunities match these filters.</p>
        )}
      </div>

      {preview && (
        <div className="mt-6 flex justify-end">
          <Link
            href="/opportunities"
            className="group inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-800"
          >
            View all opportunities
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}
