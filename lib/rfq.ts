// lib/rfq.ts
// Shared RFQ definitions for the /manufacture-with-us form and /api/rfq.

export const RFQ_BUCKET = 'rfq-files';

export const rfqOptions = {
  unit: ['pcs', 'sets', 'lots', 'kg'],
  orderType: ['Prototype', 'Small Batch', 'Production', 'Repeat Order'],
  process: ['CNC Turning', 'CNC Milling', '5-Axis CNC', 'Wire EDM', 'Grinding', 'Sheet Metal', 'Fabrication', 'Other'],
  heat: ['None', 'Required', 'As per drawing'],
  quality: ['Standard', 'Inspection Report', 'FAI', 'Customer Specification'],
  required: ['Not Required', 'Required'],
  repeat: ['No', 'Yes', 'Potential'],
} as const;

export const drawingExtensions = ['pdf'];
export const cadExtensions = ['step', 'stp', 'iges', 'igs', 'dwg', 'dxf', 'stl'];
export const MAX_FILE_BYTES = 50 * 1024 * 1024;

export function fileExtension(name: string) {
  const i = name.lastIndexOf('.');
  return i >= 0 ? name.slice(i + 1).toLowerCase() : '';
}

export interface RfqForm {
  company: string;
  contact: string;
  email: string;
  phone: string;
  ref: string;
  part: string;
  drawingNo: string;
  revision: string;
  qty: string;
  unit: string;
  orderType: string;
  process: string;
  material: string;
  grade: string;
  finish: string;
  tolerance: string;
  heat: string;
  quality: string;
  matCert: string;
  coc: string;
  delivery: string;
  location: string;
  repeat: string;
  notes: string;
}

export const emptyRfq: RfqForm = {
  company: '',
  contact: '',
  email: '',
  phone: '',
  ref: '',
  part: '',
  drawingNo: '',
  revision: '',
  qty: '',
  unit: '',
  orderType: '',
  process: '',
  material: '',
  grade: '',
  finish: '',
  tolerance: '',
  heat: 'None',
  quality: '',
  matCert: 'Not Required',
  coc: 'Not Required',
  delivery: '',
  location: '',
  repeat: 'No',
  notes: '',
};

export const requiredRfqFields: (keyof RfqForm)[] = [
  'company',
  'contact',
  'email',
  'part',
  'drawingNo',
  'qty',
  'unit',
  'orderType',
  'process',
  'material',
  'quality',
  'delivery',
  'location',
];
