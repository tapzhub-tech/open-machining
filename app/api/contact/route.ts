// app/api/contact/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
};

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { name, email, phone, company, message } = body as ContactPayload;

    // ── Validation ────────────────────────────────────────────────────────────
    if (!name || String(name).trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!email || !validateEmail(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    if (!message || String(message).trim() === '') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // ── Send via SendGrid ─────────────────────────────────────────────────────
    const sendgridKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.FROM_EMAIL || 'no-reply@yourdomain.com';
    const fromName = process.env.FROM_NAME || 'OpenManufacturing';
    const supportEmail = process.env.SUPPORT_EMAIL || fromEmail;

    const keyLooksOk =
      typeof sendgridKey === 'string' &&
      sendgridKey.startsWith('SG.') &&
      !/[*]/.test(sendgridKey) &&
      sendgridKey.length > 40;

    if (!sendgridKey || !keyLooksOk) {
      console.warn('SENDGRID_API_KEY not configured — contact email not sent.');
      // Still return success so the user gets feedback; log the message server-side.
      console.info('Contact enquiry (unsent):', { name, email, company, phone, message });
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const sgBody = {
      personalizations: [
        {
          to: [{ email: supportEmail }],
          subject: `New contact enquiry from ${String(name).trim()}`,
        },
      ],
      from: { email: fromEmail, name: fromName },
      reply_to: { email: String(email).trim(), name: String(name).trim() },
      content: [
        {
          type: 'text/plain',
          value: [
            `Name: ${name}`,
            `Email: ${email}`,
            phone ? `Phone: ${phone}` : null,
            company ? `Company: ${company}` : null,
            '',
            `Message:\n${message}`,
          ]
            .filter((l) => l !== null)
            .join('\n'),
        },
        {
          type: 'text/html',
          value: `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
            <hr/>
            <p><strong>Message:</strong></p>
            <p>${String(message).replace(/\n/g, '<br/>')}</p>
          `,
        },
      ],
    };

    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sendgridKey}`,
      },
      body: JSON.stringify(sgBody),
    });

    if (res.status !== 202) {
      const detail = await res.text().catch(() => '');
      console.error('SendGrid contact email failed:', res.status, detail);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    console.error('Contact route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
