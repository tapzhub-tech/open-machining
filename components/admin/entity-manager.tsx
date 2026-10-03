'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Pencil, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import type { EntityDef, FieldDef } from '@/lib/admin-entities';

type Row = Record<string, any> & { id: string };

function formatCell(f: FieldDef, v: any) {
  if (v === null || v === undefined || v === '') return <span className="text-slate-300">—</span>;
  if (f.type === 'list') return (v as string[]).join(', ');
  if (f.type === 'boolean') return v ? 'Yes' : 'No';
  if (f.type === 'number' && f.key === 'value') return `₹${Number(v).toLocaleString('en-IN')}`;
  if (f.type === 'date') return new Date(v + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  return String(v);
}

function toFormValue(f: FieldDef, v: any) {
  if (f.type === 'boolean') return !!v;
  if (f.type === 'list') return Array.isArray(v) ? v.join(', ') : '';
  return v ?? '';
}

function FieldInput({
  f,
  value,
  onChange,
}: {
  f: FieldDef;
  value: any;
  onChange: (v: any) => void;
}) {
  const base =
    'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20';
  switch (f.type) {
    case 'textarea':
      return <textarea className={base} rows={3} value={value} onChange={(e) => onChange(e.target.value)} required={f.required} />;
    case 'select':
      return (
        <select className={base} value={value} onChange={(e) => onChange(e.target.value)} required={f.required}>
          <option value="">Select…</option>
          {f.options!.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    case 'boolean':
      return (
        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" className="h-4 w-4" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          Yes
        </label>
      );
    default:
      return (
        <input
          className={base}
          type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : f.type === 'url' ? 'url' : 'text'}
          step={f.type === 'number' ? 'any' : undefined}
          value={value}
          placeholder={f.type === 'list' ? 'Comma separated' : undefined}
          onChange={(e) => onChange(e.target.value)}
          required={f.required}
        />
      );
  }
}

export function EntityManager({ def, password }: { def: EntityDef; password: string }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Row | 'new' | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const headers = useMemo(
    () => ({ Authorization: `Bearer ${password}`, 'Content-Type': 'application/json' }),
    [password]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/${def.table}`, { headers, cache: 'no-store' });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || `Failed to load ${def.label.toLowerCase()}`);
      setRows(json.items);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [def, headers]);

  useEffect(() => {
    load();
  }, [load]);

  const columns = def.fields.filter((f) => f.column);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      def.fields.some((f) => {
        const v = r[f.key];
        return v !== null && v !== undefined && String(Array.isArray(v) ? v.join(' ') : v).toLowerCase().includes(q);
      })
    );
  }, [rows, query, def]);

  const openForm = (row: Row | 'new') => {
    const initial: Record<string, any> = {};
    for (const f of def.fields) initial[f.key] = toFormValue(f, row === 'new' ? undefined : row[f.key]);
    setForm(initial);
    setFormError(null);
    setEditing(row);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setFormError(null);
    try {
      const isNew = editing === 'new';
      const res = await fetch(isNew ? `/api/admin/${def.table}` : `/api/admin/${def.table}/${editing.id}`, {
        method: isNew ? 'POST' : 'PATCH',
        headers,
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || 'Save failed');
      setRows((prev) => (isNew ? [json.item, ...prev] : prev.map((r) => (r.id === json.item.id ? json.item : r))));
      setEditing(null);
    } catch (e: any) {
      setFormError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      const res = await fetch(`/api/admin/${def.table}/${deleting.id}`, { method: 'DELETE', headers });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || 'Delete failed');
      setRows((prev) => prev.filter((r) => r.id !== deleting.id));
      setDeleting(null);
    } catch (e: any) {
      setError(e.message);
      setDeleting(null);
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder={`Search ${def.label.toLowerCase()}…`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 sm:ml-auto">
          <button
            onClick={load}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => openForm('new')}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add {def.singular.toLowerCase()}
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3 whitespace-nowrap">
                  {c.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && !rows.length ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-slate-500">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </td>
              </tr>
            ) : filtered.length ? (
              filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={`px-4 py-3 text-slate-700 ${c.key === def.titleKey ? 'font-medium text-slate-900 min-w-[220px]' : 'whitespace-nowrap'}`}
                    >
                      {formatCell(c, r[c.key])}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => openForm(r)}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-slate-600 hover:bg-slate-100 hover:text-blue-700"
                      aria-label={`Edit ${r[def.titleKey]}`}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleting(r)}
                      className="ml-1 inline-flex items-center gap-1 rounded px-2 py-1 text-slate-600 hover:bg-red-50 hover:text-red-700"
                      aria-label={`Delete ${r[def.titleKey]}`}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-slate-500">
                  {query ? 'No matches.' : `No ${def.label.toLowerCase()} yet.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {filtered.length} of {rows.length} {def.label.toLowerCase()}
      </p>

      {/* Add / edit drawer */}
      {editing && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40" onClick={() => !saving && setEditing(null)}>
          <form
            onSubmit={save}
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {editing === 'new' ? `Add ${def.singular.toLowerCase()}` : `Edit ${def.singular.toLowerCase()}`}
              </h2>
              <button type="button" onClick={() => setEditing(null)} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {def.fields.map((f) => (
                <label key={f.key} className={`block ${f.type === 'textarea' || f.key === def.titleKey ? 'sm:col-span-2' : ''}`}>
                  <span className="mb-1 block text-xs font-medium text-slate-600">
                    {f.label}
                    {f.required && <span className="text-red-500"> *</span>}
                  </span>
                  <FieldInput f={f} value={form[f.key]} onChange={(v) => setForm((s) => ({ ...s, [f.key]: v }))} />
                </label>
              ))}
            </div>
            <div className="border-t border-slate-200 px-6 py-4">
              {formError && <p className="mb-3 text-sm text-red-600">{formError}</p>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Delete confirmation */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Delete {def.singular.toLowerCase()}?</h2>
            <p className="text-sm text-slate-600 mb-6">
              <span className="font-medium text-slate-900">{deleting[def.titleKey]}</span> will be permanently deleted
              {def.table === 'vendors' ? ', along with its machines and staff records' : ''}. This cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleting(null)}
                disabled={deleteBusy}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteBusy}
                className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-70"
              >
                {deleteBusy && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
