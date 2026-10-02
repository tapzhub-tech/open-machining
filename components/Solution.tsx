'use client';

import React, { useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, Layers, Factory, Wrench } from 'lucide-react';
import type { SolutionUI } from '@/types/solution';

const ICONS: Record<string, React.ComponentType<any>> = {
  package: Package,
  layers: Layers,
  factory: Factory,
  wrench: Wrench,
};

type Props = {
  solutions?: SolutionUI[];
  page?: {
    heroTitle?: string;
    heroSubtitle?: string;
    heroImage?: string | null;
    heroBullets?: string[];
    heroCtaText?: string | null;
    heroCtaLink?: string | null;
  } | null;
};

export default function Solution({
  solutions = [],
  page = null,
}: Props) {
  useEffect(() => {
    console.debug('🛈 Solution page data:', { solutions, page });
  }, [solutions, page]);

  const data = Array.isArray(solutions) ? solutions : [];

  /* ================= HERO DATA ================= */

  const heroTitle =
    page?.heroTitle?.trim() || 'Our CNC Solutions';

  const heroSubtitle =
    page?.heroSubtitle?.trim() ||
    'The optimal choice for complex parts and precision manufacturing, as fast as 1 day.';

  const heroImage = useMemo<string | null>(() => {
    return page?.heroImage ? String(page.heroImage) : null;
  }, [page]);

  /** 🔐 BUILD-SAFE BULLETS */
  const heroBullets = useMemo<string[]>(() => {
    const bullets = page?.heroBullets;

    if (Array.isArray(bullets) && bullets.length > 0) {
      return bullets;
    }

    return [
      'Tolerances as tight as +/- 0.001 inches.',
      'Custom milled parts for prototyping and production.',
      'Quick turn milling services.',
    ];
  }, [page]);

  const heroCtaText = page?.heroCtaText ?? 'Get Instant Quote';
  const heroCtaLink = page?.heroCtaLink ?? '#';

  return (
    <main className="w-full">
      {/* ================= HERO ================= */}
      <section className="w-full bg-[#EAF4FF] py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0A2540] leading-tight">
              {heroTitle}
            </h1>

            <p className="text-lg text-gray-700 mt-4">
              {heroSubtitle}
            </p>

            <ul className="mt-6 space-y-3 text-gray-700 text-lg">
              {heroBullets.map((b, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="mt-1">✅</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="mb-6 w-full max-w-[500px]">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={heroTitle}
                  width={500}
                  height={500}
                  className="w-full h-auto object-contain"
                />
              ) : (
                <div className="h-[300px] bg-white rounded-2xl shadow flex items-center justify-center">
                  No image
                </div>
              )}
            </div>

            <Link href={heroCtaLink}>
              <button className="bg-[#0066FF] text-white px-8 py-3 text-lg rounded-lg hover:bg-[#0052cc] transition">
                {heroCtaText}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= ICON GRID ================= */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <p className="tracking-[0.35em] text-center text-sm text-slate-500">
            SOLUTIONS
          </p>
          <h2 className="text-center text-4xl md:text-5xl font-bold mt-2">
            Our CNC <span className="text-[#1976f3]">Solutions</span>
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {data.map((s) => {
              const Icon = ICONS[s.icon ?? 'package'] ?? Package;
              const targetId = String(s.slug ?? s.id);

              return (
                <HexCard
                  key={targetId}
                  icon={<Icon className="h-10 w-10 text-[#1976f3]" />}
                  title={s.title}
                  targetId={targetId}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= DETAIL SECTIONS ================= */}
      {data.map((s, i) => {
        const Icon = ICONS[s.icon ?? 'package'] ?? Package;
        const sectionId = String(s.slug ?? s.id);

        return (
          <DetailSection
            key={sectionId}
            id={sectionId}
            icon={<Icon className="h-8 w-8 text-[#1976f3]" />}
            title={s.title}
            description={s.description ?? ''}
            bullets={s.bullets ?? []}
            img={s.image ?? ''}
            reverse={i % 2 === 1}
          />
        );
      })}
    </main>
  );
}

/* ================= SUB COMPONENTS ================= */

function HexCard({
  icon,
  title,
  targetId,
}: {
  icon: React.ReactNode;
  title: string;
  targetId: string;
}) {
  const go = () =>
    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

  return (
    <button
      type="button"
      onClick={go}
      className="group flex flex-col items-center text-center hover:-translate-y-1 transition"
    >
      <div className="h-20 w-20 rounded-2xl bg-white shadow flex items-center justify-center">
        {icon}
      </div>
      <p className="mt-5 text-lg font-semibold">{title}</p>
    </button>
  );
}

function DetailSection({
  id,
  icon,
  title,
  description,
  bullets,
  img,
  reverse,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  bullets: string[];
  img: string;
  reverse?: boolean;
}) {
  return (
    <section id={id} className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className={reverse ? 'md:order-2' : ''}>
          {img ? (
            <Image
              src={img}
              alt={title}
              width={1200}
              height={900}
              className="rounded-3xl object-cover"
            />
          ) : (
            <div className="h-[360px] bg-slate-100 rounded-3xl flex items-center justify-center">
              No image
            </div>
          )}
        </div>

        <div className={reverse ? 'md:order-1' : ''}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-white shadow rounded-xl flex items-center justify-center">
              {icon}
            </div>
          </div>

          <h3 className="text-4xl font-bold">{title}</h3>
          <p className="mt-6 text-lg text-gray-700">{description}</p>

          <ul className="mt-6 space-y-4">
            {bullets.map((b, i) => (
              <li key={i} className="flex gap-3 text-lg">
                <span className="text-white bg-[#1976f3] rounded-full h-6 w-6 flex items-center justify-center">
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
