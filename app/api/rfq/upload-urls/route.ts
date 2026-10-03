// app/api/rfq/upload-urls/route.ts
// Issues short-lived signed upload URLs so the browser can upload drawings /
// CAD files straight to Supabase Storage (avoids serverless body-size limits).
export const dynamic = 'force-dynamic';

import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { RFQ_BUCKET, cadExtensions, drawingExtensions, fileExtension } from '@/lib/rfq';

export async function POST(request: Request) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'File uploads are not configured on the server' }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const drawing = typeof body?.drawing === 'string' ? body.drawing : '';
  const cad = typeof body?.cad === 'string' ? body.cad : '';

  const drawingExt = fileExtension(drawing);
  if (!drawingExtensions.includes(drawingExt)) {
    return NextResponse.json({ error: 'Drawing must be a PDF file' }, { status: 400 });
  }
  const cadExt = cad ? fileExtension(cad) : '';
  if (cad && !cadExtensions.includes(cadExt)) {
    return NextResponse.json({ error: `CAD file must be one of: ${cadExtensions.join(', ')}` }, { status: 400 });
  }

  const dir = `pending/${randomUUID()}`;
  const storage = supabaseAdmin.storage.from(RFQ_BUCKET);

  const sign = async (path: string) => {
    const { data, error } = await storage.createSignedUploadUrl(path);
    if (error) throw error;
    return { path: data.path, token: data.token };
  };

  try {
    const result: Record<string, { path: string; token: string }> = {
      drawing: await sign(`${dir}/drawing.${drawingExt}`),
    };
    if (cad) result.cad = await sign(`${dir}/cad.${cadExt}`);
    return NextResponse.json(result);
  } catch (e: any) {
    console.error('[rfq] Failed to create upload URLs:', e);
    return NextResponse.json({ error: 'Could not prepare file upload' }, { status: 500 });
  }
}
