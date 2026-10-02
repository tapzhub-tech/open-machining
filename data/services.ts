//data/services.ts
export interface Service {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  detailedDescription?: string;
  features?: string[];
}

export const services: Service[] = [
  {
    id: '1',
    slug: 'cnc-machining',
    name: 'CNC Machining',
    description:
      'Precision CNC machining services for complex parts with tight tolerances and superior surface finishes.',
    icon: 'Settings',
    detailedDescription:
      'Our state-of-the-art CNC machining facilities offer 3, 4, and 5-axis machining capabilities for the most demanding applications.',
    features: ['3-5 Axis Machining', 'Tight Tolerances (±0.001")', 'High-Speed Machining', 'Prototype to Production'],
  },
  {
    id: '4',
    slug: '3d-printing',
    name: '3D Printing',
    description:
      'Rapid prototyping and production with advanced additive manufacturing technologies.',
    icon: 'Box',
    detailedDescription:
      'Multiple 3D printing technologies including FDM, SLA, and SLS for diverse applications.',
    features: ['Rapid Prototyping', 'Multiple Technologies', 'Production Parts', 'Complex Geometries'],
  },
  {
    id: '6',
    slug: 'assembly',
    name: 'Assembly Services',
    description:
      'Complete assembly services with quality control and testing for finished products.',
    icon: 'Package',
    detailedDescription:
      'End-to-end assembly solutions with rigorous quality control and testing procedures.',
    features: ['Full Assembly', 'Quality Testing', 'Packaging', 'Kitting'],
  },
  {
    id: '2',
    slug: 'injection-molding',
    name: 'Injection Molding',
    description:
      'High-volume plastic injection molding with rapid tooling and extensive material selection.',
    icon: 'Layers',
    detailedDescription:
      'Cost-effective injection molding solutions for high-volume production runs with quick turnaround times.',
    features: ['Rapid Tooling', '100+ Materials', 'Insert Molding', 'Overmolding'],
  },
  {
    id: '3',
    slug: 'wire-edm',
    name: 'Wire EDM',
    description:
      'Ultra-precise wire EDM cutting for intricate geometries and hardened materials.',
    icon: 'Zap',
    detailedDescription:
      'Wire EDM technology for cutting complex shapes in hard materials with exceptional accuracy.',
    features: ['Tight Tolerances', 'Hardened Materials', 'Complex Geometries', 'No Tool Wear'],
  },
  {
    id: '5',
    slug: 'sheet-metal',
    name: 'Sheet Metal Fabrication',
    description:
      'Custom sheet metal fabrication including cutting, bending, and finishing services.',
    icon: 'Square',
    detailedDescription:
      'Complete sheet metal services from design to finished parts with various finishing options.',
    features: ['Laser Cutting', 'CNC Bending', 'Welding', 'Powder Coating'],
  },
];
