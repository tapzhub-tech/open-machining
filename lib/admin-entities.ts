// lib/admin-entities.ts
// Field definitions for the admin CRUD screens. Shared by the admin UI (form
// rendering) and the admin API (column whitelist + type coercion), so only
// these columns can ever be written from /admin.

export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'select' | 'list' | 'boolean' | 'url'
  /** Storage path; read-only, shown as a signed download link (`<key>_url`) */
  | 'file';

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  /** Show as a column in the table view */
  column?: boolean;
}

export type EntityKey = 'vendors' | 'tenders' | 'rfqs';

export interface EntityDef {
  table: EntityKey;
  label: string;
  singular: string;
  titleKey: string;
  orderBy: string;
  /** false hides "Add" (rows only come from a public form) */
  canCreate?: boolean;
  fields: FieldDef[];
}

export const entities: Record<EntityKey, EntityDef> = {
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
  rfqs: {
    table: 'rfqs',
    label: 'RFQs',
    singular: 'RFQ',
    titleKey: 'part_name',
    orderBy: 'created_at',
    canCreate: false,
    fields: [
      { key: 'status', label: 'Status', type: 'select', options: ['New', 'Reviewing', 'Quoted', 'Won', 'Lost', 'Closed'], column: true },
      { key: 'part_name', label: 'Part name', type: 'text', required: true, column: true },
      { key: 'company', label: 'Company', type: 'text', required: true, column: true },
      { key: 'contact_name', label: 'Contact name', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'text', required: true, column: true },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'reference_no', label: 'Reference no.', type: 'text' },
      { key: 'drawing_no', label: 'Drawing no.', type: 'text', required: true },
      { key: 'drawing_revision', label: 'Revision', type: 'text' },
      { key: 'quantity', label: 'Quantity', type: 'number', required: true, column: true },
      { key: 'unit', label: 'Unit', type: 'select', required: true, options: ['pcs', 'sets', 'lots', 'kg'] },
      { key: 'order_type', label: 'Order type', type: 'select', required: true, options: ['Prototype', 'Small Batch', 'Production', 'Repeat Order'] },
      { key: 'process', label: 'Process', type: 'select', required: true, options: ['CNC Turning', 'CNC Milling', '5-Axis CNC', 'Wire EDM', 'Grinding', 'Sheet Metal', 'Fabrication', 'Other'], column: true },
      { key: 'material', label: 'Material', type: 'text', required: true },
      { key: 'material_grade', label: 'Material grade', type: 'text' },
      { key: 'surface_finish', label: 'Surface finish', type: 'text' },
      { key: 'tolerance', label: 'Critical tolerance', type: 'text' },
      { key: 'heat_treatment', label: 'Heat treatment', type: 'select', options: ['None', 'Required', 'As per drawing'] },
      { key: 'quality_requirement', label: 'Quality requirement', type: 'select', required: true, options: ['Standard', 'Inspection Report', 'FAI', 'Customer Specification'] },
      { key: 'material_cert', label: 'Material certificate', type: 'select', options: ['Not Required', 'Required'] },
      { key: 'coc', label: 'Certificate of Conformance', type: 'select', options: ['Not Required', 'Required'] },
      { key: 'delivery_date', label: 'Delivery date', type: 'date', required: true, column: true },
      { key: 'delivery_location', label: 'Delivery location', type: 'text', required: true },
      { key: 'repeat_order', label: 'Repeat order expected', type: 'select', options: ['No', 'Yes', 'Potential'] },
      { key: 'notes', label: 'Special instructions', type: 'textarea' },
      { key: 'drawing_path', label: 'Drawing', type: 'file', column: true },
      { key: 'cad_path', label: 'CAD file', type: 'file' },
    ],
  },
};

export function isEntityKey(v: string): v is EntityKey {
  return Object.prototype.hasOwnProperty.call(entities, v);
}

/** Whitelist + coerce an incoming payload. Returns an error string on invalid input. */
export function sanitizePayload(
  def: EntityDef,
  input: Record<string, unknown>,
  mode: 'create' | 'update'
): { data: Record<string, unknown> } | { error: string } {
  const data: Record<string, unknown> = {};
  for (const f of def.fields) {
    if (f.type === 'file' || !(f.key in input)) continue;
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
    if (!f.required || f.type === 'file') continue;
    const present = f.key in data;
    if ((mode === 'create' || present) && (data[f.key] === null || data[f.key] === undefined)) {
      return { error: `${f.label} is required` };
    }
  }
  return { data };
}
