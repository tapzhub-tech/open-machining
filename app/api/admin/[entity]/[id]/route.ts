// app/api/admin/[entity]/[id]/route.ts
// Update and delete a single vendor / tender.
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-auth';
import { entities, isEntityKey, sanitizePayload } from '@/lib/admin-entities';
import { RFQ_BUCKET } from '@/lib/rfq';

type Ctx = { params: Promise<{ entity: string; id: string }> };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function resolve(request: Request, params: Ctx['params']) {
  const denied = requireAdmin(request);
  if (denied) return { response: denied };
  const { entity, id } = await params;
  if (!isEntityKey(entity) || !UUID_RE.test(id)) {
    return { response: NextResponse.json({ error: 'Not found' }, { status: 404 }) };
  }
  if (!supabaseAdmin) {
    return { response: NextResponse.json({ error: 'Supabase admin client is not configured' }, { status: 500 }) };
  }
  return { def: entities[entity], id, client: supabaseAdmin };
}

export async function PATCH(request: Request, { params }: Ctx) {
  const r = await resolve(request, params);
  if ('response' in r) return r.response;

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });

  const result = sanitizePayload(r.def, body, 'update');
  if ('error' in result) return NextResponse.json({ error: result.error }, { status: 400 });

  const { data, error } = await r.client.from(r.def.table).update(result.data).eq('id', r.id).select().maybeSingle();
  if (error) {
    console.error(`Supabase error (update ${r.def.table}):`, error);
    return NextResponse.json({ error: `Failed to update: ${error.message}` }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ item: data });
}

export async function DELETE(request: Request, { params }: Ctx) {
  const r = await resolve(request, params);
  if ('response' in r) return r.response;

  // vendors → machines cascade via FK (ON DELETE CASCADE)
  const fileFields = r.def.fields.filter((f) => f.type === 'file').map((f) => f.key);
  const { data, error } = await r.client
    .from(r.def.table)
    .delete()
    .eq('id', r.id)
    .select(['id', ...fileFields].join(','));
  if (error) {
    console.error(`Supabase error (delete ${r.def.table}):`, error);
    return NextResponse.json({ error: `Failed to delete: ${error.message}` }, { status: 500 });
  }
  if (!data?.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const paths = fileFields.map((k) => (data[0] as Record<string, any>)[k]).filter(Boolean);
  if (paths.length) {
    const { error: rmError } = await r.client.storage.from(RFQ_BUCKET).remove(paths);
    if (rmError) console.warn(`Deleted ${r.def.table} row but failed to remove files:`, rmError);
  }
  return NextResponse.json({ ok: true });
}
