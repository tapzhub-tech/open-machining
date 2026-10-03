'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, FileUp, Loader2, Printer, RotateCcw, Save } from 'lucide-react';
import {
  MAX_FILE_BYTES,
  RFQ_BUCKET,
  type RfqForm as RfqFormData,
  cadExtensions,
  emptyRfq,
  rfqOptions,
} from '@/lib/rfq';

const DRAFT_KEY = 'om-rfq-draft';

const inputCls =
  'w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-[15px] text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100';

function Field({
  label,
  required,
  children,
  wide,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={`block ${wide ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1.5 block text-xs font-bold text-slate-600">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      {children}
    </label>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 break-inside-avoid">
      <h2 className="mb-4 flex items-center gap-3 text-base font-bold text-slate-900">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
          {n}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-100 py-2.5 last:border-0">
      <div className="text-[11px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-0.5 font-semibold text-slate-900 break-words">{value || '—'}</div>
    </div>
  );
}

export function RfqForm() {
  const [form, setForm] = useState<RfqFormData>(emptyRfq);
  const [drawing, setDrawing] = useState<File | null>(null);
  const [cad, setCad] = useState<File | null>(null);
  const [status, setStatus] = useState<{ kind: 'idle' | 'busy' | 'error' | 'info'; text: string }>({
    kind: 'idle',
    text: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const drawingRef = useRef<HTMLInputElement>(null);
  const cadRef = useRef<HTMLInputElement>(null);

  // Restore a saved draft (text fields only — files can't be stored).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) setForm({ ...emptyRfq, ...JSON.parse(raw) });
    } catch {}
  }, []);

  const set = (k: keyof RfqFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const pickFile = (setter: (f: File | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f && f.size > MAX_FILE_BYTES) {
      setStatus({ kind: 'error', text: `${f.name} is larger than 50 MB.` });
      e.target.value = '';
      setter(null);
      return;
    }
    setter(f);
  };

  const saveDraft = () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      setStatus({ kind: 'info', text: 'Draft saved in this browser. Files need to be attached again before submitting.' });
    } catch {
      setStatus({ kind: 'error', text: 'Could not save a draft in this browser.' });
    }
  };

  const clearAll = () => {
    setForm(emptyRfq);
    setDrawing(null);
    setCad(null);
    if (drawingRef.current) drawingRef.current.value = '';
    if (cadRef.current) cadRef.current.value = '';
    setStatus({ kind: 'idle', text: '' });
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current?.checkValidity()) {
      formRef.current?.reportValidity();
      setStatus({ kind: 'error', text: 'Please complete all required fields marked *.' });
      return;
    }
    if (!drawing) {
      setStatus({ kind: 'error', text: 'Please attach the drawing (PDF).' });
      return;
    }

    try {
      setStatus({ kind: 'busy', text: 'Preparing upload…' });
      const urlRes = await fetch('/api/rfq/upload-urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drawing: drawing.name, cad: cad?.name }),
      });
      const urls = await urlRes.json().catch(() => null);
      if (!urlRes.ok) throw new Error(urls?.error || 'Could not prepare file upload');

      const { supabase } = await import('@/lib/supabase');
      const bucket = supabase.storage.from(RFQ_BUCKET);

      setStatus({ kind: 'busy', text: 'Uploading drawing…' });
      const up1 = await bucket.uploadToSignedUrl(urls.drawing.path, urls.drawing.token, drawing);
      if (up1.error) throw new Error('Drawing upload failed: ' + up1.error.message);

      if (cad && urls.cad) {
        setStatus({ kind: 'busy', text: 'Uploading CAD file…' });
        const up2 = await bucket.uploadToSignedUrl(urls.cad.path, urls.cad.token, cad);
        if (up2.error) throw new Error('CAD upload failed: ' + up2.error.message);
      }

      setStatus({ kind: 'busy', text: 'Submitting request…' });
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, drawingPath: urls.drawing.path, cadPath: urls.cad?.path }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || 'Submission failed');

      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setStatus({ kind: 'error', text: err.message || 'Something went wrong. Please try again.' });
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 md:p-12 text-center shadow-sm">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-600" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Request received</h2>
        <p className="text-slate-600 mb-8">
          Thanks, {form.contact.split(' ')[0] || 'there'}. Our engineering team will review{' '}
          <span className="font-semibold text-slate-900">{form.part}</span> and get back to you at{' '}
          <span className="font-semibold text-slate-900">{form.email}</span>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => {
              clearAll();
              setSubmitted(false);
            }}
            className="rounded-md bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Submit another part
          </button>
          <Link href="/" className="rounded-md border border-slate-300 px-6 py-3 font-semibold text-slate-800 hover:bg-slate-50">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const busy = status.kind === 'busy';
  const files = [drawing && '✓ Drawing', cad && '✓ CAD'].filter(Boolean).join(' · ');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-5 print:block">
      <form ref={formRef} onSubmit={submit} noValidate className="space-y-4">
        <Section n={1} title="Company">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field label="Company name" required><input className={inputCls} value={form.company} onChange={set('company')} required autoComplete="organization" /></Field>
            <Field label="Contact name" required><input className={inputCls} value={form.contact} onChange={set('contact')} required autoComplete="name" /></Field>
            <Field label="Business email" required><input className={inputCls} type="email" value={form.email} onChange={set('email')} required autoComplete="email" /></Field>
            <Field label="Phone"><input className={inputCls} type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" /></Field>
            <Field label="RFQ / reference number"><input className={inputCls} value={form.ref} onChange={set('ref')} /></Field>
          </div>
        </Section>

        <Section n={2} title="Part & Quantity">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field label="Part name" required><input className={inputCls} value={form.part} onChange={set('part')} required /></Field>
            <Field label="Part / drawing number" required><input className={inputCls} value={form.drawingNo} onChange={set('drawingNo')} required /></Field>
            <Field label="Drawing revision"><input className={inputCls} value={form.revision} onChange={set('revision')} /></Field>
            <Field label="Quantity" required><input className={inputCls} type="number" min={1} step={1} value={form.qty} onChange={set('qty')} required /></Field>
            <Field label="Unit" required>
              <select className={inputCls} value={form.unit} onChange={set('unit')} required>
                <option value="">Select</option>
                {rfqOptions.unit.map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Order type" required>
              <select className={inputCls} value={form.orderType} onChange={set('orderType')} required>
                <option value="">Select</option>
                {rfqOptions.orderType.map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
          </div>
        </Section>

        <Section n={3} title="Manufacturing Specification">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field label="Manufacturing process" required>
              <select className={inputCls} value={form.process} onChange={set('process')} required>
                <option value="">Select</option>
                {rfqOptions.process.map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Material" required><input className={inputCls} value={form.material} onChange={set('material')} placeholder="e.g. Stainless Steel" required /></Field>
            <Field label="Material grade"><input className={inputCls} value={form.grade} onChange={set('grade')} placeholder="e.g. SS316 / EN8 / Al 6061" /></Field>
            <Field label="Surface finish"><input className={inputCls} value={form.finish} onChange={set('finish')} placeholder="e.g. Ra 1.6 µm" /></Field>
            <Field label="Critical tolerance"><input className={inputCls} value={form.tolerance} onChange={set('tolerance')} placeholder="e.g. ±0.02 mm" /></Field>
            <Field label="Heat treatment">
              <select className={inputCls} value={form.heat} onChange={set('heat')}>
                {rfqOptions.heat.map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
          </div>
        </Section>

        <Section n={4} title="Technical Files">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center hover:border-blue-400">
              <FileUp className="mx-auto mb-1 h-6 w-6 text-slate-400" />
              <b className="text-slate-900">Drawing <span className="text-red-600">*</span></b>
              <div className="text-xs text-slate-500 mb-2">PDF, up to 50 MB</div>
              <input ref={drawingRef} type="file" accept=".pdf" onChange={pickFile(setDrawing)} className="w-full text-sm" />
            </label>
            <label className="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center hover:border-blue-400">
              <FileUp className="mx-auto mb-1 h-6 w-6 text-slate-400" />
              <b className="text-slate-900">CAD file</b>
              <div className="text-xs text-slate-500 mb-2">{cadExtensions.map((e) => e.toUpperCase()).join(', ')}</div>
              <input ref={cadRef} type="file" accept={cadExtensions.map((e) => '.' + e).join(',')} onChange={pickFile(setCad)} className="w-full text-sm" />
            </label>
          </div>
          <p className="mt-2 text-xs text-slate-500">{files ? `${files} selected.` : 'No files selected.'}</p>
        </Section>

        <Section n={5} title="Quality">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field label="Quality requirement" required>
              <select className={inputCls} value={form.quality} onChange={set('quality')} required>
                <option value="">Select</option>
                {rfqOptions.quality.map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Material certificate">
              <select className={inputCls} value={form.matCert} onChange={set('matCert')}>
                {rfqOptions.required.map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
            <Field label="Certificate of Conformance">
              <select className={inputCls} value={form.coc} onChange={set('coc')}>
                {rfqOptions.required.map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
          </div>
        </Section>

        <Section n={6} title="Delivery">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Field label="Required delivery date" required><input className={inputCls} type="date" value={form.delivery} onChange={set('delivery')} required /></Field>
            <Field label="Delivery location" required><input className={inputCls} value={form.location} onChange={set('location')} placeholder="City, State / Country" required /></Field>
            <Field label="Repeat order expected?">
              <select className={inputCls} value={form.repeat} onChange={set('repeat')}>
                {rfqOptions.repeat.map((o) => <option key={o}>{o}</option>)}
              </select>
            </Field>
          </div>
        </Section>

        <Section n={7} title="Special Instructions">
          <textarea className={`${inputCls} min-h-[100px]`} value={form.notes} onChange={set('notes')} placeholder="Only add requirements not captured above." />
        </Section>

        <div aria-live="polite" className="min-h-[1.25rem] text-sm font-semibold">
          {status.text && (
            <p className={status.kind === 'error' ? 'text-red-600' : status.kind === 'busy' ? 'text-slate-600 flex items-center gap-2' : 'text-emerald-700'}>
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {status.text}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5 print:hidden">
          <button type="submit" disabled={busy} className="inline-flex min-h-[46px] items-center gap-2 rounded-lg bg-blue-600 px-5 font-bold text-white hover:bg-blue-700 disabled:opacity-70">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Submit Manufacturing Request
          </button>
          <button type="button" onClick={saveDraft} disabled={busy} className="inline-flex min-h-[46px] items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 font-bold text-slate-800 hover:bg-slate-50">
            <Save className="h-4 w-4" /> Save Draft
          </button>
          <button type="button" onClick={() => window.print()} className="inline-flex min-h-[46px] items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 font-bold text-slate-800 hover:bg-slate-50">
            <Printer className="h-4 w-4" /> Print / Save PDF
          </button>
          <button type="button" onClick={clearAll} disabled={busy} className="inline-flex min-h-[46px] items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 font-bold text-slate-800 hover:bg-slate-50">
            <RotateCcw className="h-4 w-4" /> Clear
          </button>
        </div>
      </form>

      <aside className="h-max rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24 print:mt-4">
        <h2 className="mb-2 text-[17px] font-bold text-slate-900">Live RFQ Summary</h2>
        <SummaryRow label="Company" value={form.company} />
        <SummaryRow label="Part" value={form.part} />
        <SummaryRow label="Process" value={form.process} />
        <SummaryRow label="Material" value={[form.material, form.grade].filter(Boolean).join(' · ')} />
        <SummaryRow label="Quantity" value={form.qty ? `${form.qty} ${form.unit}` : ''} />
        <SummaryRow label="Order type" value={form.orderType} />
        <SummaryRow label="Delivery" value={form.delivery} />
        <SummaryRow label="Files" value={files || 'Drawing required'} />
        <p className="mt-3 text-center text-[11px] text-slate-500">Required fields are marked *.</p>
      </aside>
    </div>
  );
}
