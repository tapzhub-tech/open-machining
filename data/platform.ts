// data/platform.ts
// Positioning content for the Find → Bid → Build → Deliver model.

export interface PipelineStage {
  id: 'find' | 'bid' | 'build' | 'deliver';
  step: string;
  title: string;
  tagline: string;
  items: string[];
  href: string;
}

export const pipeline: PipelineStage[] = [
  {
    id: 'find',
    step: '01',
    title: 'Find',
    tagline: 'Manufacturing opportunities, identified and matched.',
    items: ['Government tenders', 'PSU & defence procurement', 'Private RFQs', 'OEM requirements'],
    href: '/opportunities',
  },
  {
    id: 'bid',
    step: '02',
    title: 'Bid',
    tagline: 'Tender analysis, costing and submission.',
    items: ['Technical qualification', 'BOQ analysis & costing', 'Supplier sourcing', 'Bid documentation'],
    href: '/bid-management',
  },
  {
    id: 'build',
    step: '03',
    title: 'Build',
    tagline: 'Contract manufacturing across processes.',
    items: ['CNC, EDM & sheet metal', 'Fabrication & moulding', '3D printing & electronics', 'Assembly & finishing'],
    href: '/capabilities',
  },
  {
    id: 'deliver',
    step: '04',
    title: 'Deliver',
    tagline: 'Quality, logistics and contract execution.',
    items: ['Inspection & traceability', 'Packaging & logistics', 'Compliance documentation', 'On-time delivery'],
    href: '/contact',
  },
];

/**
 * Proof markers shown in "The network behind every order".
 * Replace these with real operating metrics (partners, machines, cities,
 * parts delivered) as they become available — never publish estimates.
 */
export const proofMarkers = [
  { value: 'ISO 9001:2015', label: 'Quality management system' },
  { value: 'Multi-process', label: 'CNC, EDM, sheet metal, moulding, 3D printing, assembly' },
  { value: 'Engineering-led', label: 'DFM review and sourcing on every order' },
  { value: 'Quality-controlled', label: 'Inspection before every dispatch' },
];

export const tenderFlow = [
  { title: 'Read the requirement', body: 'Tender PDF, BOQ and drawings are reviewed for scope, specs and eligibility.' },
  { title: 'Map the processes', body: 'Each line item is broken down into the manufacturing processes it needs.' },
  { title: 'Check network capability', body: 'We match processes to qualified partners with the right machines and certifications.' },
  { title: 'Collect quotations', body: 'Supplier quotes are gathered and compared on cost, capacity and lead time.' },
  { title: 'Build bid economics', body: 'Manufacturing cost, logistics, margins and risk roll up into a defensible price.' },
  { title: 'Coordinate submission', body: 'Technical and commercial documents are assembled for submission.' },
  { title: 'Execute if awarded', body: 'Production, inspection and delivery are managed through to contract close.' },
];

export const audiences = [
  {
    who: 'Contract holders',
    quote: 'These people can help me execute my contract.',
    body: 'Won a tender, or about to bid on one? We build and run the manufacturing capability behind it.',
    cta: { label: 'Discuss a tender', href: '/bid-management' },
  },
  {
    who: 'Buyers & OEMs',
    quote: 'These people can take care of my manufacturing.',
    body: 'Prototype to production across processes, with one accountable partner from drawing to delivery.',
    cta: { label: 'Start a project', href: '/contact' },
  },
  {
    who: 'Manufacturers',
    quote: 'These people bring me serious orders.',
    body: 'Tell us what you can manufacture. We bring you matched opportunities — no more hunting for customers.',
    cta: { label: 'Join the network', href: '/network' },
  },
];
