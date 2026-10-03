// lib/admin-entities.ts
// Field definitions for the admin CRUD screens. Shared by the admin UI (form
// rendering) and the admin API (column whitelist + type coercion), so only
// these columns can ever be written from /admin.

export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'select' | 'list' | 'boolean' | 'url';

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  /** Show as a column in the table view */
  column?: boolean;
}

export interface EntityDef {
  table: 'vendors' | 'tenders';
  label: string;
  singular: string;
  titleKey: string;
  orderBy: string;
  fields: FieldDef[];
}

export const entities: Record<'vendors' | 'tenders', EntityDef> = {
  vendors: {
    table: 'vendors',
    label: 'Vendors',
    singular: 'Vendor',
    titleKey: 'company_name',
    orderBy: 'created_at',
    fields: [
      { key: 'company_name', label: 'Company name', type: 'text', required: true, column: true },
      { key: 'owner_name', label: 'Owner name', type: 'text', required: true, column: true },
      { key: 'phone_number', label: 'Phone', type: 'text', column: true },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'gst_no', label: 'GST no.', type: 'text', required: true },
      { key: 'pancard_number', label: 'PAN', type: 'text', required: true },
      { key: 'address', label: 'Address', type: 'textarea', required: true },
      { key: 'city', label: 'City', type: 'text', column: true },
      { key: 'state', label: 'State', type: 'text', column: true },
      { key: 'pincode', label: 'Pincode', type: 'text' },
      { key: 'industries', label: 'Industries', type: 'list' },
      { key: 'number_of_machines', label: 'Machines', type: 'number', column: true },
      { key: 'number_of_skill', label: 'Technical staff', type: 'number' },
      { key: 'number_of_programmer', label: 'Programmers', type: 'number' },
      { key: 'number_of_quality_tools', label: 'Quality tools', type: 'number' },
    ],
  },
  tenders: {
    table: 'tenders',
    label: 'Tenders',
    singular: 'Tender',
    titleKey: 'title',
    orderBy: 'closes_on',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true, column: true },
      { key: 'reference_no', label: 'Reference no.', type: 'text' },
      { key: 'buyer', label: 'Buyer', type: 'text', required: true, column: true },
      { key: 'sector', label: 'Sector', type: 'select', required: true, options: ['Government', 'PSU', 'Defence', 'Private'], column: true },
      { key: 'processes', label: 'Processes', type: 'list' },
      { key: 'value', label: 'Estimated value (₹)', type: 'number', column: true },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'closes_on', label: 'Closes on', type: 'date', column: true },
      { key: 'status', label: 'Status', type: 'select', options: ['Open', 'Bidding', 'Submitted', 'Awarded', 'Lost', 'Closed'], column: true },
      { key: 'matched', label: 'Network match', type: 'boolean' },
      { key: 'source_url', label: 'Source URL', type: 'url' },
      { key: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
};

export function isEntityKey(v: string): v is keyof typeof entities {
  return v === 'vendors' || v === 'tenders';
}

/** Whitelist + coerce an incoming payload. Returns an error string on invalid input. */
export function sanitizePayload(
  def: EntityDef,
  input: Record<string, unknown>,
  mode: 'create' | 'update'
): { data: Record<string, unknown> } | { error: string } {
  const data: Record<string, unknown> = {};
  for (const f of def.fields) {
    if (!(f.key in input)) continue;
    const raw = input[f.key];
    let val: unknown;
    switch (f.type) {
      case 'number': {
        if (raw === '' || raw === null || raw === undefined) val = null;
        else {
          const n = Number(raw);
          if (!Number.isFinite(n)) return { error: `${f.label} must be a number` };
          val = n;
        }
        break;
      }
      case 'boolean':
        val = raw === true || raw === 'true';
        break;
      case 'list':
        val = Array.isArray(raw)
          ? raw.map((s) => String(s).trim()).filter(Boolean)
          : String(raw ?? '')
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);
        break;
      case 'select': {
        const s = String(raw ?? '').trim();
        if (s && f.options && !f.options.includes(s)) return { error: `Invalid ${f.label}` };
        val = s || null;
        break;
      }
      default: {
        const s = String(raw ?? '').trim();
        val = s || null;
      }
    }
    data[f.key] = val;
  }

  for (const f of def.fields) {
    if (!f.required) continue;
    const present = f.key in data;
    if ((mode === 'create' || present) && (data[f.key] === null || data[f.key] === undefined)) {
      return { error: `${f.label} is required` };
    }
  }
  return { data };
}
