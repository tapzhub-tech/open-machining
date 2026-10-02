// app/api/machine-server-stats/route.ts
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getMachineServerStats, supabaseAdmin, supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const client = supabaseAdmin ?? supabase;

    if (!client) {
      console.error('No Supabase client available — check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const stats = await getMachineServerStats(client);
    return NextResponse.json(stats);
  } catch (err: any) {
    // Log the full error so it's visible in Vercel / dev server logs
    console.error('[machine-server-stats] Error:', JSON.stringify(err, null, 2));
    return NextResponse.json(
      { error: err?.message || 'Failed to load network stats' },
      { status: 500 }
    );
  }
}
