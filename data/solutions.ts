//data/solutions.tsx
import type { SolutionUI } from '@/types/solution';

// data/solutions.tsx
export const solutionPageData = {
    heroTitle: 'Our CNC Solutions',
    heroSubtitle:
      'The optimal choice for complex parts and precision manufacturing, as fast as 1 day.',
    heroImage: '/assets/solutions/hero.png', // ✅ ADD THIS
  };
  

export const solutionsData: SolutionUI[] = [
  {
    id: 'rapid-prototyping',
    slug: 'rapid-prototyping',
    title: 'Rapid Prototyping',
    description:
      'At Open Machining, we specialize in rapid prototyping services, utilizing advanced technologies like CNC machining, injection molding, sheet metal fabrication, 3D printing, and vacuum casting. With lead times as fast as 1 day, we help bring your ideas to life swiftly and efficiently.',
    bullets: [
      'Utilize state-of-the-art methods including 3D printing and CNC machining to produce prototypes.',
      'Iterate designs rapidly, enabling both testing and refinement to match your specifications.',
      'Receive prototypes with precision, ensuring they meet functional and aesthetic requirements.',
    ],
    image: '/assets/solutions/rapid-prototyping.png',
    icon: 'package',
    order: 1,
  },

  {
    id: 'on-demand-manufacturing',
    slug: 'on-demand-manufacturing',
    title: 'On Demand Manufacturing',
    description:
      'At Open Machining , we specialize in a range of manufacturing services, including rapid CNC machining, precision injection molding, robust sheet metal fabrication, innovative 3D printing, and versatile vacuum casting. Experience lead times as fast as 1 day, tailored to meet your critical deadlines.',
    bullets: [
      'Leverage advanced technologies like CNC machining and injection molding for precise part production.',
      'Rapidly iterate and refine designs while ensuring stringent quality standards are met.',
      'Get personalized support from our engineering team to ensure prototypes align with your exact specifications.',
    ],
    image: '/assets/solutions/on-demand-manufacturing.png',
    icon: 'factory',
    order: 2,
  },

  {
    id: 'surface-finishing',
    slug: 'surface-finishing',
    title: 'Surface Finishing',
    description:
      'Rapid CNC machining, injection molding, sheet metal fabrication, 3D printing and vacuum casting services. Lead time as fast as 1 day.',
    bullets: [
      'Using 3D printing, CNC machining, and injection molding.',
      'Rapidly iterate and refine designs with high precision.',
      'Ensure prototypes meet your exact specifications.',
    ],
    image: '/assets/solutions/surface-finishing.png',
    icon: 'layers',
    order: 3,
  },

  {
    id: 'assembly-services',
    slug: 'assembly-services',
    title: 'Assembly Services',
    description:
      'At Open Machining, we specialize in delivering comprehensive assembly services that seamlessly integrate with our advanced CNC machining, injection molding, sheet metal fabrication, 3D printing, and vacuum casting solutions.',
    bullets: [
      'Leveraging 3D printing, CNC machining, and injection molding for high precision.',
      'Efficient iteration and refinement of designs.',
      'Ensuring prototypes and production components meet exact requirements.',
    ],
    image: '/assets/solutions/assembly-services.png',
    icon: 'wrench',
    order: 4,
  },
];
