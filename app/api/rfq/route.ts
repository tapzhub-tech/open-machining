// app/api/rfq/route.ts
// Stores a manufacturing request from /manufacture-with-us.
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { RFQ_BUCKET, type RfqForm, requiredRfqFields, rfqOptions } from '@/lib/rfq';

const PATH_RE = /^pending\/[0-9a-f-]{36}\/(drawing|cad)\.[a-z]+$/;

function clean(v: unknown, max = 500) {
  return String(v ?? '').trim().slice(0, max);
}

async function fileExists(path: string) {
  const slash = path.lastIndexOf('/');
  const { data, error } = await supabaseAdmin!.storage
    .from(RFQ_BUCKET)
    .list(path.slice(0, slash), { search: path.slice(slash + 1) });
  return !error && !!data?.some((f) => f.name === path.slice(slash + 1));
}

async function notifyTeam(row: Record<string, any>) {
  const key = process.env.SENDGRID_API_KEY;
  if (!key || !key.startsWith('SG.')) return;
  const fromEmail = process.env.FROM_EMAIL || 'no-reply@yourdomain.com';
  const fromName = process.env.FROM_NAME || 'Open Machining';
  const to = process.env.SUPPORT_EMAIL || fromEmail;
  const lines = [
    `Company: ${row.company}`,
    `Contact: ${row.contact_name} <${row.email}>${row.phone ? ` · ${row.phone}` : ''}`,
    `Part: ${row.part_name} (${row.drawing_no}${row.drawing_revision ? ` rev ${row.drawing_revision}` : ''})`,
    `Quantity: ${row.quantity} ${row.unit} · ${row.order_type}`,
    `Process: ${row.process} · Material: ${[row.material, row.material_grade].filter(Boolean).join(' ')}`,
    `Delivery: ${row.delivery_date} → ${row.delivery_location}`,
    '',
    'Open the RFQs tab in /admin for full details and files.',
  ];
  try {
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }], subject: `New RFQ: ${row.part_name} — ${row.company}` }],
        from: { email: fromEmail, name: fromName },
        reply_to: { email: row.email, name: row.contact_name },
        content: [{ type: 'text/plain', value: lines.join('\n') }],
      }),
    });
    if (res.status !== 202) console.warn('[rfq] SendGrid notify failed:', res.status, await res.text().catch(() => ''));
  } catch (e) {
    console.warn('[rfq] SendGrid notify error (non-fatal):', e);
  }
}

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Requests are not configured on the server' }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  const form = body.form as Partial<RfqForm> | undefined;
  if (!form) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  for (const k of requiredRfqFields) {
    if (!clean(form[k])) return NextResponse.json({ error: `Missing required field: ${k}` }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(form.email))) {
    return NextResponse.json({ error: 'Valid business email is required' }, { status: 400 });
  }
  const qty = Number(form.qty);
  if (!Number.isInteger(qty) || qty < 1) return NextResponse.json({ error: 'Quantity must be a whole number ≥ 1' }, { status: 400 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(clean(form.delivery))) {
    return NextResponse.json({ error: 'Invalid delivery date' }, { status: 400 });
  }

  const pick = <T extends readonly string[]>(v: unknown, opts: T, fallback: string | null = null) => {
    const s = clean(v);
    return (opts as readonly string[]).includes(s) ? s : fallback;
  };
  const unit = pick(form.unit, rfqOptions.unit);
  const orderType = pick(form.orderType, rfqOptions.orderType);
  const process = pick(form.process, rfqOptions.process);
  const quality = pick(form.quality, rfqOptions.quality);
  if (!unit || !orderType || !process || !quality) {
    return NextResponse.json({ error: 'Invalid selection in form' }, { status: 400 });
  }

  const drawingPath = clean(body.drawingPath);
  const cadPath = clean(body.cadPath);
  if (!PATH_RE.test(drawingPath) || (cadPath && !PATH_RE.test(cadPath))) {
    return NextResponse.json({ error: 'Invalid file reference' }, { status: 400 });
  }
  if (!(await fileExists(drawingPath)) || (cadPath && !(await fileExists(cadPath)))) {
    return NextResponse.json({ error: 'Uploaded file not found — please attach it again' }, { status: 400 });
  }

  const row = {
    company: clean(form.company, 200),
    contact_name: clean(form.contact, 200),
    email: clean(form.email, 200),
    phone: clean(form.phone, 50) || null,
    reference_no: clean(form.ref, 100) || null,
    part_name: clean(form.part, 200),
    drawing_no: clean(form.drawingNo, 100),
    drawing_revision: clean(form.revision, 50) || null,
    quantity: qty,
    unit,
    order_type: orderType,
    process,
    material: clean(form.material, 200),
    material_grade: clean(form.grade, 100) || null,
    surface_finish: clean(form.finish, 100) || null,
    tolerance: clean(form.tolerance, 100) || null,
    heat_treatment: pick(form.heat, rfqOptions.heat, 'None'),
    quality_requirement: quality,
    material_cert: pick(form.matCert, rfqOptions.required, 'Not Required'),
    coc: pick(form.coc, rfqOptions.required, 'Not Required'),
    delivery_date: clean(form.delivery),
    delivery_location: clean(form.location, 200),
    repeat_order: pick(form.repeat, rfqOptions.repeat, 'No'),
    notes: clean(form.notes, 5000) || null,
    drawing_path: drawingPath,
    cad_path: cadPath || null,
  };

  const { data, error } = await supabaseAdmin.from('rfqs').insert([row]).select('id').single();
  if (error) {
    console.error('[rfq] Insert failed:', error);
    return NextResponse.json({ error: 'Could not save your request. Please try again.' }, { status: 500 });
  }

  await notifyTeam(row);
  return NextResponse.json({ ok: true, id: data.id }, { status: 201 });
}
