// app/api/admin/gem-sync/route.ts
// "Refresh from GeM" button in /admin → Tenders. Imports Ministry of Defence
// bids as tenders (source = 'GeM'). Existing GeM tenders are left untouched so
// admin edits (status, matched, notes) survive a refresh.
export const dynamic = 'force-dynamic';
// GeM blocks most non-Indian traffic: run this function in Mumbai on Vercel.
export const preferredRegion = 'bom1';
export const maxDuration = 60;

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-auth';
import { GEM_MINISTRY, GemError, fetchGemDefenceBids, inferProcesses } from '@/lib/gem';

export async function POST(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  if (!supabaseAdmin) return NextResponse.json({ error: 'Supabase admin client is not configured' }, { status: 500 });

  let result: Awaited<ReturnType<typeof fetchGemDefenceBids>>;
  try {
    result = await fetchGemDefenceBids();
  } catch (e: any) {
    console.error('[gem-sync] fetch failed:', e);
    const message = e instanceof GemError ? e.message : `GeM fetch failed: ${e?.message || e}`;
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const rows = result.bids.map((b) => ({
    source: 'GeM',
    reference_no: b.bidNumber,
    title: b.category,
    buyer: [b.ministry, b.department].filter(Boolean).join(' · ') || GEM_MINISTRY,
    sector: 'Defence',
    processes: inferProcesses(b.category),
    value: null,
    location: null,
    closes_on: b.endDate,
    matched: false,
    status: 'Open',
    source_url: b.url,
    notes: [b.quantity && `Quantity: ${b.quantity}`, b.startDate && `Published on GeM: ${b.startDate}`]
      .filter(Boolean)
      .join('\n') || null,
  }));

  let inserted = 0;
  if (rows.length) {
    const { data, error } = await supabaseAdmin
      .from('tenders')
      .upsert(rows, { onConflict: 'source,reference_no', ignoreDuplicates: true })
      .select('id');
    if (error) {
      console.error('[gem-sync] upsert failed:', error);
      return NextResponse.json(
        { error: `Fetched ${rows.length} bids from GeM but could not save them: ${error.message}. Has migration 005 been run?` },
        { status: 500 }
      );
    }
    inserted = data?.length ?? 0;
  }

  return NextResponse.json({
    ok: true,
    ministry: GEM_MINISTRY,
    fetched: rows.length,
    inserted,
    alreadyPresent: rows.length - inserted,
    totalOnGem: result.numFound,
    pagesRead: result.pagesRead,
    skippedOtherMinistry: result.skippedOtherMinistry,
  });
}
