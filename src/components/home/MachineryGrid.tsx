'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

interface MachineryItem {
  id: string;
  name: string;
  series: string;
  slug: string;
  category: string;
  shortDesc: string;
  image: string;
  imageFit: 'contain' | 'cover';
  keySpecs: { label: string; value: string }[];
  highlightBadge?: string;
}

const FEATURED_MACHINERY: MachineryItem[] = [
  {
    id: 'washing-plants',
    name: 'Plastic Washing Plants',
    series: 'ABSW Series (W250 – W5000)',
    slug: 'absw-plastic-washing-plant',
    category: 'Flagship Washing System',
    shortDesc: 'Innovative 10 FT compact design with closed-loop water recycling, hot friction wash (60°C–80°C), and continuous dewatering for rigid and film plastic scrap.',
    image: '/images/products/washing-plant-line.png',
    imageFit: 'contain',
    highlightBadge: '10 FT Compact Footprint',
    keySpecs: [
      { label: 'Capacity Range', value: '250 – 5,000 kg/h' },
      { label: 'Material Contact', value: 'SS 302 Stainless Steel' },
      { label: 'Drive & Electrics', value: 'Havells 3-Phase Motors' },
      { label: 'Recycling Loop', value: 'Closed-Loop Water System' },
    ],
  },
  {
    id: 'crushers-granulators',
    name: 'Plastic Crushers & Granulators',
    series: 'G Series (G250 – G2000)',
    slug: 'g-series-plastic-crusher-machine',
    category: 'Size Reduction Technology',
    shortDesc: 'Heavy-duty size reduction machinery engineered with precision-hardened EN41 alloy steel knives, solid rotor construction, and high-torque Havells motors.',
    image: '/images/products/crusher-granulator.jpg',
    imageFit: 'contain',
    highlightBadge: 'EN41 Steel Knives',
    keySpecs: [
      { label: 'Output Capacity', value: '250 – 2,000 kg/h' },
      { label: 'Blade Metallurgy', value: 'EN41 High-Carbon Alloy' },
      { label: 'Motor Range', value: '20 HP – 60 HP (Havells)' },
      { label: 'Rotor Speed', value: '480 RPM Low Noise' },
    ],
  },
  {
    id: 'screw-conveyors',
    name: 'Screw Conveyors',
    series: 'CR Series (CR250 – CR2000)',
    slug: 'cr-series-screw-conveyor',
    category: 'Material Handling & Feed',
    shortDesc: 'Heavy-gauge continuous screw conveyors with 5400 mm span, dust-tight trough enclosure, and wear-resistant spiral flights for continuous washing & extruder feed.',
    image: '/images/hero-reference.jpg',
    imageFit: 'cover',
    highlightBadge: '5400 mm Length',
    keySpecs: [
      { label: 'Conveyor Length', value: '5,400 mm Continuous' },
      { label: 'Throughput', value: '250 – 2,000 kg/h' },
      { label: 'Flight Speed', value: '55 – 105 RPM Variable' },
      { label: 'Drive Unit', value: 'Havells Helical Gearmotor' },
    ],
  },
  {
    id: 'transport-blowers',
    name: 'Material Transport Blowers',
    series: 'MTB Series (MTB250 – MTB2000)',
    slug: 'mtb-material-transport-blower',
    category: 'Pneumatic Conveying',
    shortDesc: 'High-static pneumatic blowers with 2880 RPM high-speed Havells motor drives, designed for gentle, clog-free transfer of dried flakes, regrind, and polymer granules.',
    image: '/images/hero-reference.jpg',
    imageFit: 'cover',
    highlightBadge: '2880 RPM Havells Motor',
    keySpecs: [
      { label: 'Blower Speed', value: '2,880 RPM High Velocity' },
      { label: 'Air Flow Rating', value: 'High Static Pressure' },
      { label: 'Conveying Medium', value: 'Dry Flakes & Pellets' },
      { label: 'Power Supply', value: '380V / 415V 50Hz 3-Phase' },
    ],
  },
];

export default function MachineryGrid({ initialProducts }: { initialProducts?: any[] }) {
  const shouldReduceMotion = useReducedMotion();

  const displayMachinery = useMemo(() => {
    if (initialProducts && Array.isArray(initialProducts) && initialProducts.length > 0) {
      const published = initialProducts.filter((p: any) => p.published !== false);
      if (published.length > 0) {
        return published.slice(0, 4).map((p: any) => ({
          id: p.id,
          name: p.name,
          series: p.series || '',
          slug: p.slug,
          category: p.category || 'Recycling Machine',
          shortDesc: p.shortDescription || '',
          image: p.heroImage || '/images/products/washing-plant-line.png',
          imageFit: ((p.heroImage || '').includes('washing') || (p.heroImage || '').includes('crusher') ? 'contain' : 'cover') as 'contain' | 'cover',
          highlightBadge: p.highlightBadge || '',
          keySpecs: (p.verifiedSpecs && p.verifiedSpecs.length > 0)
            ? p.verifiedSpecs.slice(0, 4).map((s: any) => ({ label: s.label, value: s.value }))
            : [
                { label: 'Capacity Range', value: (p.variants && p.variants[0]?.capacityKgHr) ? `${p.variants[0].capacityKgHr} kg/h` : 'Industrial' },
                { label: 'Electric Drive', value: 'Havells 3-Phase Motors' },
                { label: 'Metallurgy', value: 'SS 302 / EN41 Knives' },
                { label: 'Duty Cycle', value: '24/7 Heavy Continuous' }
              ]
        }));
      }
    }
    return FEATURED_MACHINERY;
  }, [initialProducts]);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: shouldReduceMotion ? 0 : index * 0.12,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <section id="machinery-showcase" className="py-20 sm:py-28 bg-slate-50 border-b border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with high-contrast text */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-brand-orange uppercase tracking-wider mb-3 px-3 py-1 bg-brand-orange/10 rounded-full border border-brand-orange/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Engineered Machinery Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight">
              Precision Plastic Recycling Machinery
            </h2>
            <p className="mt-4 text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
              Designed and manufactured in Coimbatore for industrial recyclers across India, UAE, and international corridors. Every machine features heavy structural steel frames, certified Havells electricals, and verified throughput ratings.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/machineries"
              className="inline-flex items-center text-sm font-bold text-navy-950 hover:text-brand-orange transition-colors group"
            >
              <span>Explore All Machinery Catalogue</span>
              <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Machinery Editorial Grid — 2x2 Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {displayMachinery.map((item, idx) => (
            <motion.div
              key={item.id}
              custom={idx}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:border-slate-300"
            >
              {/* Product Visual Container */}
              <div className="relative h-64 sm:h-72 w-full bg-slate-100/90 p-4 sm:p-6 overflow-hidden flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src={item.image}
                    alt={`${item.name} by ABS Polymers Coimbatore`}
                    fill
                    className={`${
                      item.imageFit === 'contain'
                        ? 'object-contain object-center'
                        : 'object-cover object-center rounded-lg'
                    } group-hover:scale-105 transition-transform duration-500`}
                  />
                </div>

                {/* Badge Overlay */}
                {item.highlightBadge && (
                  <div className="absolute top-4 left-4 bg-navy-950 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-md border border-slate-700/60">
                    {item.highlightBadge}
                  </div>
                )}

                <div className="absolute top-4 right-4 bg-white text-slate-800 text-xs font-bold px-2.5 py-1 rounded shadow-sm border border-slate-200">
                  {item.series}
                </div>
              </div>

              {/* Product Card Details — All Headings Dark Slate */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <div className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-1">
                    {item.category}
                  </div>
                  <h3 className="text-2xl font-black text-slate-950 group-hover:text-brand-orange transition-colors">
                    <Link href={`/machineries/${item.slug}`}>
                      {item.name}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm text-slate-700 leading-relaxed font-normal">
                    {item.shortDesc}
                  </p>
                </div>

                {/* Key Technical Specs Grid — Clear Dark Text */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {item.keySpecs.map((spec: any, sIdx: number) => (
                    <div key={sIdx} className="space-y-0.5">
                      <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        {spec.label}
                      </div>
                      <div className="text-xs sm:text-sm font-extrabold text-slate-950">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Links */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <Link
                    href={`/machineries/${item.slug}`}
                    className="inline-flex items-center text-sm font-bold text-brand-orange hover:text-orange-600 transition-colors"
                  >
                    <span>View Specifications</span>
                    <ArrowRight className="ml-1.5 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href={`/contact`}
                    className="inline-flex items-center px-4 py-2 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-brand-orange hover:text-white rounded-lg transition-colors border border-slate-200"
                  >
                    Contact Factory
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
