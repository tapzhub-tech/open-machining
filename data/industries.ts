export interface Industry {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  detailedDescription?: string;
  applications?: string[];
}

export const industries: Industry[] = [
  {
    id: '1',
    slug: 'aerospace',
    name: 'Aerospace',
    description: 'High-precision components for aerospace applications with AS9100 certification and rigorous quality standards.',
    icon: 'Plane',
    detailedDescription: 'We manufacture critical aerospace components meeting the strictest industry standards and certifications.',
    applications: ['Aircraft Components', 'UAV Parts', 'Satellite Hardware', 'Ground Support Equipment']
  },
  {
    id: '2',
    slug: 'automotive',
    name: 'Automotive',
    description: 'Automotive parts and tooling with IATF 16949 compliance for OEMs and tier suppliers.',
    icon: 'Car',
    detailedDescription: 'From prototypes to production runs, we serve automotive manufacturers with precision parts and assemblies.',
    applications: ['Engine Components', 'Transmission Parts', 'Interior/Exterior Trim', 'Testing Fixtures']
  },
  {
    id: '3',
    slug: 'automation',
    name: 'Automation & Robotics',
    description: 'Custom components for automation systems, robotics, and industrial machinery.',
    icon: 'Cpu',
    detailedDescription: 'Precision parts for robots, automated systems, and advanced manufacturing equipment.',
    applications: ['Robot Components', 'Actuator Housings', 'Sensor Mounts', 'Custom Brackets']
  },
  {
    id: '4',
    slug: 'medical',
    name: 'Medical Devices',
    description: 'Medical device manufacturing with ISO 13485 certification and cleanroom capabilities.',
    icon: 'Heart',
    detailedDescription: 'FDA-compliant medical device components manufactured in controlled environments.',
    applications: ['Surgical Instruments', 'Diagnostic Equipment', 'Implant Components', 'Lab Equipment']
  },
  {
    id: '5',
    slug: 'consumer',
    name: 'Consumer Products',
    description: 'High-quality components and assemblies for consumer electronics and products.',
    icon: 'ShoppingBag',
    detailedDescription: 'Scalable manufacturing solutions for consumer product companies from prototype to mass production.',
    applications: ['Electronics Housings', 'Appliance Parts', 'Sporting Goods', 'Product Enclosures']
  },
  {
    id: '6',
    slug: 'energy',
    name: 'Energy & Power',
    description: 'Components for renewable energy, oil & gas, and power generation industries.',
    icon: 'Zap',
    detailedDescription: 'Durable components for demanding energy sector applications and harsh environments.',
    applications: ['Solar Mounting', 'Wind Turbine Parts', 'Battery Enclosures', 'Power Distribution']
  }
];
