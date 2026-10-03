// app/api/admin/[entity]/route.ts
// List and create vendors / tenders. Admin-password protected; uses the
// service-role client so RLS is bypassed.
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-auth';
import { entities, isEntityKey, sanitizePayload } from '@/lib/admin-entities';

type Ctx = { params: Promise<{ entity: string }> };

export async function GET(request: Request, { params }: Ctx) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { entity } = await params;
  if (!isEntityKey(entity)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!supabaseAdmin) return NextResponse.json({ error: 'Supabase admin client is not configured' }, { status: 500 });

  const def = entities[entity];
  const columns = ['id', 'created_at', 'updated_at', ...def.fields.map((f) => f.key)].join(',');
  const { data, error } = await supabaseAdmin
    .from(def.table)
    .select(columns)
    .order(def.orderBy, { ascending: entity === 'tenders', nullsFirst: false });

  if (error) {
    console.error(`Supabase error (list ${def.table}):`, error);
    return NextResponse.json({ error: `Failed to load ${def.label.toLowerCase()}: ${error.message}` }, { status: 500 });
  }
  return NextResponse.json({ items: data ?? [] });
}

export async function POST(request: Request, { params }: Ctx) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { entity } = await params;
  if (!isEntityKey(entity)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!supabaseAdmin) return NextResponse.json({ error: 'Supabase admin client is not configured' }, { status: 500 });

  const def = entities[entity];
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });

  const result = sanitizePayload(def, body, 'create');
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: 400 });

  const { data, error } = await supabaseAdmin.from(def.table).insert([result.data]).select().single();
  if (error) {
    console.error(`Supabase error (create ${def.table}):`, error);
    return NextResponse.json({ error: `Failed to create ${def.singular.toLowerCase()}: ${error.message}` }, { status: 500 });
  }
  return NextResponse.json({ item: data }, { status: 201 });
}
