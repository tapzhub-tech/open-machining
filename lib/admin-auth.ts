// lib/admin-auth.ts
import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

/**
 * Checks the "Authorization: Bearer <ADMIN_PASSWORD>" header.
 * Returns a NextResponse to send back on failure, or null when authorised.
 */
export function requireAdmin(request: Request): NextResponse | null {
  const envPassword = (process.env.ADMIN_PASSWORD || '').trim();
  if (!envPassword) {
    console.error('ADMIN_PASSWORD environment variable is not set');
    return NextResponse.json({ error: 'Admin password is not configured on the server' }, { status: 500 });
  }

  const header = request.headers.get('authorization') || '';
  const provided = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  const a = Buffer.from(provided);
  const b = Buffer.from(envPassword);
  if (!provided || a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
