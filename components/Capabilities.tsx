//components/capabilities.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import type { CapabilityUI } from '@/types/capability';

type CapabilityCard = {
  id: string | number;
  title: string;
  image: string;
  desc?: string;
  bullets: string[];
  href: string;
};

const PLACEHOLDER_IMG = '/assets/capabilities/card-01.png';

export default function Capabilities({ capabilities = [] as CapabilityUI[] }) {
  const router = useRouter();

  const defaultCards: CapabilityCard[] = [
    {
      id: 1,
      title: 'CNC Machining',
      image: '/assets/capabilities/card-17.png',
      desc: 'Precision-engineered components with rapid manufacturing solutions.',
      bullets: ['Tolerance up to ±0.0003 in', 'Prototypes and production', 'Fast turnaround'],
      href: '/quote',
    },
    {
      id: 2,
      title: 'CNC Milling',
      image: '/assets/capabilities/card-15.png',
      desc: 'Complex components with exceptional precision, as fast as 1 day.',
      bullets: ['Tolerance up to ±0.008 mm', 'Prototype to production', 'Rapid delivery'],
      href: '/quote',
    },
  ];

  const cmsCards: CapabilityCard[] = (capabilities || []).map(c => ({
    id: c.id ?? cryptoRandomId(),
    title: c.name ?? 'Untitled',
    image: c.image || PLACEHOLDER_IMG,
    desc: c.description || '',
    bullets: Array.isArray(c.bullets) ? c.bullets : [],
    href: c.slug ? `/capabilities/${c.slug}` : '/quote',
  }));

  // ----- START: New ordering logic (only change) -----
  // Desired sequence provided by the user:
  const desiredOrder = [
    'CNC Machining',
    'CNC Milling',
    'CNC Turning',
    '5 Axis CNC Machining',
    '3D Printing',
    'Laser Cutting',
    'Die Casting',
    'Aluminum Extrusion',
    'WIRE EDM',
    'Metal bending',
    'Sheet Metal Fabrication',
    'Injection Molding',
    'Insert Molding',
    'Overmolding',
    'Injection Mold Tooling',
    'Vacuum Casting',
    'Precision Machining',
  ];

  // helper normalizer for matching titles (remove spaces/dashes, lowercase)
  const normalize = (s?: string) => (s || '').toString().replace(/[\s\-\_]+/g, '').toLowerCase();

  const cmsIndexByNorm: Record<string, CapabilityCard> = {};
  cmsCards.forEach(c => {
    cmsIndexByNorm[normalize(c.title)] = c;
  });

  const defaultIndexByNorm: Record<string, CapabilityCard> = {};
  defaultCards.forEach(d => {
    defaultIndexByNorm[normalize(d.title)] = d;
  });

  // Build ordered cards: prefer CMS card, fallback to default card, otherwise placeholder
  const orderedCards: CapabilityCard[] = desiredOrder.map((title) => {
    const norm = normalize(title);
    const fromCms = cmsIndexByNorm[norm];
    if (fromCms) return fromCms;

    const fromDefault = defaultIndexByNorm[norm];
    if (fromDefault) return fromDefault;

    // If title looks like '3DPrinting' convert to nicer display if needed
    const displayTitle = title.replace(/([a-z])([A-Z])/g, '$1 $2');

    return {
      id: title,
      title: displayTitle,
      image: PLACEHOLDER_IMG,
      desc: '',
      bullets: [],
      href: '/quote',
    };
  });

  // Final cards to render
  const cards = orderedCards;
  // ----- END: New ordering logic -----

  type Material = {
    key: string;
    title: string;
    image: string;
    desc?: string;
    types?: string[];
  };

  const img = (name: string) => encodeURI(`/assets/capabilities/${name}.webp`);

  const metals: Material[] = [
    { key: 'aluminum', title: 'Aluminum', image: img('Aluminum'),
      desc: 'Lightweight, strong, corrosion-resistant. Great machinability.',
      types: ['6061', '6061-T6', '2024', '5052', '5083'] },
    { key: 'stainless', title: 'Stainless Steel', image: img('StainlessSteel'),
      desc: 'Strength + corrosion resistance for medical/food/structural.' },
    { key: 'brass', title: 'Brass', image: img('Brass'),
      desc: 'Great finish and machinability for fittings and decorative parts.' },
    { key: 'copper', title: 'Copper', image: img('Copper'),
      desc: 'High electrical/thermal conductivity for heat sinks, bus bars.' },
    { key: 'bronze', title: 'Bronze', image: img('Bronze'),
      desc: 'Wear-resistant; common in bushings and marine uses.' },
    { key: 'titanium', title: 'Titanium', image: img('Titanium'),
      desc: 'Top strength-to-weight and biocompatibility.' },
    { key: 'magnesium', title: 'Magnesium', image: img('Magnesium'),
      desc: 'Ultra-light for weight-critical parts.' },
    { key: 'steel', title: 'Steel', image: img('Steel'),
      desc: 'Versatile and cost-effective across many alloys.' },
    { key: '6061', title: 'Alloy 6061', image: img('Alloy6061'),
      desc: 'Balanced strength, corrosion resistance, machinability.' },
    { key: '6063', title: 'Alloy 6063', image: img('Alloy6063'),
      desc: 'Great for extrusion with clean finish.' },
    { key: '7075', title: 'Alloy 7075', image: img('Alloy7075'),
      desc: 'High-strength aluminum for aerospace/performance.' },
    { key: '1100', title: 'Alloy 1100', image: img('Alloy1100'),
      desc: 'Commercially pure Al; superb corrosion resistance.' },
  ];

  const [activeMetalIndex, setActiveMetalIndex] = useState(0);
  const activeMetal = metals[activeMetalIndex];

  const plasticsRaw = [
    'ABS', 'PC', 'PMMA (acrylic)', 'POM', 'PA(Nylon)', 'PE', 'PEEK', 'PP',
    'HDPE', 'HIPS', 'LDPE', 'PBT', 'PPA', 'PET', 'PPS', 'PS', 'PVC',
    'PTFE(Teflon)', 'UPE', 'Bakelite', 'FR-4', 'soft Rubber',
  ];

  const plasticDesc = (title: string): string =>
    ({
      ABS: 'Tough and impact-resistant for housings and jigs.',
      PC: 'High impact and clear; great for lenses and guards.',
      'PMMA (acrylic)': 'Clear, glossy, weatherable for displays/light guides.',
      POM: 'Low friction for gears and bushings.',
      'PA(Nylon)': 'Strong, tough; glass-filled options available.',
      PE: 'Chemical-resistant and versatile.',
      PEEK: 'High-performance for heat/chemical demanding parts.',
      PP: 'Lightweight, fatigue-resistant for living hinges.',
      HDPE: 'Stiff and chemical-resistant.',
      HIPS: 'Easy machining for enclosures.',
      LDPE: 'Flexible for soft-touch components.',
      PBT: 'Great electrical properties for connectors.',
      PPA: 'High-temp nylon, stable dimensions.',
      PET: 'Dimensional stability and wear.',
      PPS: 'High heat and chemical resistance.',
      PS: 'Rigid plastic for low-load parts.',
      PVC: 'Chemical-resistant and economical.',
      'PTFE(Teflon)': 'Ultra-low friction; extreme chemical resistance.',
      UPE: 'UHMWPE with outstanding wear resistance.',
      Bakelite: 'Thermoset with electrical insulation.',
      'FR-4': 'Glass-epoxy, common PCB laminate/structural panels.',
      'soft Rubber': 'Flexible elastomer for grips and seals.',
    } as Record<string, string>)[title] || 'Engineering plastic for durable parts.';

  const plastics: Material[] = plasticsRaw.map((title) => ({
    key: `plastic-${title.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '').replace(/-+/g, '-')}`,
    title,
    image: img(title),
    desc: plasticDesc(title),
  }));

  const [activePlasticIndex, setActivePlasticIndex] = useState(0);
  const activePlastic = plastics[activePlasticIndex];

  const finishImg = (basename: string) => `/assets/capabilities/surface/${basename}.webp`;
  const finishes = [
    { key: 'polishing', title: 'Polishing', image: finishImg('card1'), desc: 'Mirror-like sheen; premium look and low friction.' },
    { key: 'as-cast', title: 'As Cast', image: finishImg('card2'), desc: 'Natural casting texture with dimensional control.' },
    { key: 'black-oxidize', title: 'Black Oxidize', image: finishImg('card3'), desc: 'Matte black with corrosion resistance.' },
    { key: 'electroplating', title: 'Electroplating', image: finishImg('card4'), desc: 'Protective metal layer; wear and looks.' },
    { key: 'anodizing', title: 'Anodizing', image: finishImg('card5'), desc: 'Hard oxide on aluminum; clear or dyed.' },
    { key: 'bead-blast', title: 'Bead Blasting', image: finishImg('card6'), desc: 'Satin texture that hides tool marks.' },
  ];

  const railRef = useRef<HTMLDivElement | null>(null);
  const scrollByCards = (dir: 'prev' | 'next') => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-finish-card]');
    const step = card ? card.clientWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir === 'next' ? step : -step, behavior: 'smooth' });
  };

  return (
    <main className="relative overflow-hidden bg-white">
      <div className="pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
            <div className="max-w-2xl lg:pr-10">
              <h1 className="text-slate-900 font-extrabold leading-tight tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                CNC Manufacturing
                <br /> Services
              </h1>
              <p className="mt-8 text-lg md:text-xl text-slate-600 max-w-xl">
                At Open Manufacturing, we understand that aerospace projects demand the highest
                level of precision, reliability, and innovation.
              </p>
              <div className="mt-10">
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center px-6 py-4 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
                >
                  Get Instant Quote
                </Link>
              </div>
            </div>

            <div className="relative flex justify-end">
              <div className="w-[90%] lg:w-[520px] xl:w-[600px]">
                <Image
                  src="/assets/capabilities.png"
                  alt="CNC capabilities hero"
                  width={1200}
                  height={800}
                  priority
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.15) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>
      </div>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-500 tracking-[0.35em] text-xs sm:text-sm">
            <span className="inline-block h-3 w-3 rounded-full bg-blue-600" />
            <span className="uppercase">Capabilities</span>
          </div>
          <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900">
            Our Manufacturing Capabilities
          </h2>
          <p className="mt-6 text-lg md:text-xl text-slate-600">
            Open Manufacturing has extensive manufacturing capabilities, capable of producing any
            geometrically complex part and offering on-demand manufacturing services.
          </p>
        </div>
      </section>

      <section className="pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cards.map((card, idx) => (
              <article
                key={card.id}
                role="button"
                tabIndex={0}
                onClick={() => router.push(card.href)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    router.push(card.href);
                  }
                }}
                className="group rounded-2xl border border-slate-200 bg-[#E6ECF5] p-8 shadow-sm transition duration-300 ease-out cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 active:scale-[0.98] active:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                <div className="-mx-8 -mt-8 mb-6 rounded-t-2xl overflow-hidden">
                  <Image
                    src={card.image || PLACEHOLDER_IMG}
                    alt={card.title}
                    width={1600}
                    height={900}
                    sizes="(min-width: 768px) 100vw, 100vw"
                    className="w-full h-56 md:h-64 lg:h-72 object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06] group-hover:-rotate-1"
                    priority={idx < 4}
                  />
                </div>

                <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 transition-colors duration-300 group-hover:text-slate-950">
                  {card.title}
                </h3>

                {card.desc && <p className="mt-4 text-slate-600">{card.desc}</p>}

                {!!card.bullets?.length && (
                  <ul className="mt-6 space-y-2 text-slate-700">
                    {card.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex gap-3">
                        <span className="mt-1 text-blue-600 transition-transform duration-300 group-hover:translate-x-0.5">✔</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-8 flex items-center gap-4">
                  <Link
                    href={card.href}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-blue-600 text-white text-sm px-5 py-3 rounded-lg shadow hover:bg-blue-700 transition active:scale-95"
                  >
                    Get Instant Quote
                  </Link>

                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1 active:scale-95"
                  >
                    Learn More →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-500 tracking-[0.35em] text-[10px] sm:text-xs">
            <span className="inline-block h-3 w-3 rounded-full bg-blue-600" />
            <span className="uppercase">Materials</span>
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900">
            Material for <span className="text-blue-600">Superior Results</span>
          </h2>
          <p className="mt-5 text-base md:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
            Open Manufacturing has extensive manufacturing capabilities, capable of producing any
            geometrically complex part and offering on-demand manufacturing services.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white" aria-label="Plastic materials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1px_minmax(0,1fr)] gap-6 lg:gap-10 items-start">
            <aside className="lg:max-h-[560px] overflow-y-auto pr-1">
              <div className="px-4 sm:px-5 py-1">
                <p className="text-xs tracking-wider uppercase text-slate-500">Materials</p>
                <h3 className="mt-1 text-2xl font-bold text-slate-900">Plastic</h3>
              </div>
              <ul className="mt-2 space-y-2">
                {plastics.map((m, idx) => {
                  const selected = idx === activePlasticIndex;
                  return (
                    <li key={m.key}>
                      <button
                        onClick={() => setActivePlasticIndex(idx)}
                        className={`w-full text-left px-4 sm:px-5 py-3 rounded-lg transition ${selected ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                      >
                        <span className="text-base sm:text-lg font-medium">{m.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>

            <div className="hidden lg:block h-full w-px bg-slate-300/70 justify-self-center" />

            <section>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:p-6">
                <div className="relative w-full rounded-xl overflow-hidden bg-white">
                  <Image
                    src={activePlastic.image}
                    alt={activePlastic.title}
                    width={1600}
                    height={1200}
                    className="w-full h-[320px] sm:h-[420px] object-contain"
                    priority
                  />
                </div>

                <div className="mt-8">
                  <h4 className="text-3xl font-bold text-slate-900">{activePlastic.title}</h4>
                  <p className="mt-4 text-slate-700 text-lg">
                    {activePlastic.desc || `High-quality ${activePlastic.title} parts with reliable machinability and finish.`}
                  </p>

                  {activePlastic.types?.length ? (
                    <div className="mt-6">
                      <h5 className="text-xl font-semibold text-slate-900">Type</h5>
                      <p className="mt-2 text-slate-700">{activePlastic.types.join(', ')}</p>
                    </div>
                  ) : null}

                  <div className="mt-8">
                    <Link
                      href="/quote"
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white font-medium shadow hover:bg-blue-700 transition"
                    >
                      Learn More <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white" aria-label="Metals">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1px_minmax(0,1fr)] gap-6 lg:gap-10 items-start">
            <aside className="lg:max-h-[560px] overflow-y-auto pr-1">
              <div className="px-4 sm:px-5 py-1">
                <p className="text-xs tracking-wider uppercase text-slate-500">Materials</p>
                <h3 className="mt-1 text-2xl font-bold text-slate-900">Metals</h3>
              </div>
              <ul className="mt-2 space-y-2">
                {metals.map((m, idx) => {
                  const selected = idx === activeMetalIndex;
                  return (
                    <li key={m.key}>
                      <button
                        onClick={() => setActiveMetalIndex(idx)}
                        className={`w-full text-left px-4 sm:px-5 py-3 rounded-lg transition ${selected ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                      >
                        <span className="text-base sm:text-lg font-medium">{m.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>

            <div className="hidden lg:block h-full w-px bg-slate-300/70 justify-self-center" />

            <section>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 sm:p-6">
                <div className="relative w-full rounded-xl overflow-hidden bg-white">
                  <Image
                    src={activeMetal.image}
                    alt={activeMetal.title}
                    width={1600}
                    height={1200}
                    className="w-full h-[320px] sm:h-[420px] object-contain"
                    priority
                  />
                </div>

                <div className="mt-8">
                  <h4 className="text-3xl font-bold text-slate-900">{activeMetal.title}</h4>
                  <p className="mt-4 text-slate-700 text-lg">
                    {activeMetal.desc || `High-quality ${activeMetal.title} for durable, machinable parts across prototypes and production.`}
                  </p>

                  {activeMetal.types?.length ? (
                    <div className="mt-6">
                      <h5 className="text-xl font-semibold text-slate-900">Type</h5>
                      <p className="mt-2 text-slate-700">{activeMetal.types.join(', ')}</p>
                    </div>
                  ) : null}

                  <div className="mt-8">
                    <Link
                      href="/quote"
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white font-medium shadow hover:bg-blue-700 transition"
                    >
                      Learn More <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section
        className="relative py-14 md:py-20 rounded-3xl mx-4 md:mx-8 mb-8 overflow-hidden"
        style={{
          backgroundImage: "url('/assets/capabilities/CADbackground.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-white font-extrabold text-2xl sm:text-3xl md:text-4xl leading-tight">
              Get Your Parts into <br /> Manufacturing Today!
            </h2>
            <p className="mt-3 text-slate-300 text-base md:text-lg max-w-xl">
              Your idea deserves to become a real product. Fast production, aerospace-grade
              precision, and instant quoting at your fingertips.
            </p>
          </div>

          <Link
            href="/quote"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-lg transition active:scale-95"
          >
            Get Instant Quote
          </Link>
        </div>
      </section>

      <section className="pb-16 md:pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-slate-500 tracking-[0.35em] text-[10px] sm:text-xs">
            <span className="inline-block h-3 w-3 rounded-full bg-blue-600" />
            <span className="uppercase">Surface Finish</span>
          </div>
          <h2 className="mt-5 text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900">
            Surface Finishing for <span className="text-blue-600">Custom Parts</span>
          </h2>
          <p className="mt-5 text-center text-base md:text-lg text-slate-600 max-w-4xl mx-auto">
            Open Manufacturing has extensive manufacturing capabilities, capable of producing any geometrically complex part
            and offering on-demand manufacturing services.
          </p>

          <div className="relative mt-10">
            <button
              aria-label="Previous"
              onClick={() => scrollByCards('prev')}
              className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow hover:bg-blue-700"
            >
              ‹
            </button>

            <div
              ref={railRef}
              className="grid auto-cols-[85%] sm:auto-cols-[50%] lg:auto-cols-[25%] grid-flow-col gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {finishes.map((f) => (
                <article
                  key={f.key}
                  data-finish-card
                  className="
                    snap-start rounded-2xl overflow-hidden border border-slate-200/70 shadow-sm
                    bg-[radial-gradient(140%_170%_at_50%_-10%,#F5F8FE_0%,#EDF3FA_55%,#E6ECF5_100%)]
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]
                  "
                >
                  <div className="px-6 pt-6">
                    <div className="relative mx-auto h-44 sm:h-52 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
                      <Image
                        src={f.image}
                        alt={f.title}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 85vw"
                        className="object-contain"
                      />
                    </div>
                  </div>

                  <div className="px-6 pb-6 mt-4">
                    <h3 className="text-xl md:text-2xl font-semibold text-slate-900">{f.title}</h3>
                    <p className="mt-3 text-slate-700 text-[15px] leading-relaxed line-clamp-3">
                      {f.desc}
                    </p>

                    <div className="mt-6 flex justify-end">
                      <Link
                        href="/surface-finishes"
                        className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                        aria-label={`Learn more about ${f.title}`}
                      >
                        →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <button
              aria-label="Next"
              onClick={() => scrollByCards('next')}
              className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow hover:bg-blue-700"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-white" />
    </main>
  );
}

function cryptoRandomId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}
