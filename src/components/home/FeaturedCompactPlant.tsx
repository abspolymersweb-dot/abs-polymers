'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Droplets, Zap, ShieldCheck, Maximize2, FileText, Sparkles } from 'lucide-react';

export default function FeaturedCompactPlant() {
  const shouldReduceMotion = useReducedMotion();

  const plantBenefits = [
    {
      title: '10 FT Space-Saving Footprint',
      desc: 'Saves up to 65% floor space compared to 30 FT conventional lines, allowing high-capacity installation in compact factory sheds.',
      icon: Maximize2,
    },
    {
      title: 'Closed-Loop Water Filtration',
      desc: 'Multiple reuses of washing water with integrated settlement, drastically cutting freshwater bills and minimizing effluent treatment.',
      icon: Droplets,
    },
    {
      title: 'Dual Temperature Zones',
      desc: '60°C–80°C hot friction washing removes stubborn grease and adhesives; 120°C–140°C heating prepares clean flakes for direct extrusion.',
      icon: Zap,
    },
    {
      title: 'SS 302 Stainless Steel',
      desc: 'All internal contact surfaces and washing tanks built from heavy-gauge SS 302 stainless steel for decades of corrosion resistance.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-navy-950 text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-navy-700/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual Artwork */}
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-navy-900 shadow-2xl group">
              <div className="relative h-80 sm:h-96 w-full bg-slate-900/60 p-6 flex items-center justify-center">
                <Image
                  src="/images/products/washing-plant-line.png"
                  alt="ABS Polymers 10 FT Compact Plastic Washing Plant"
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Water & Eco-Stewardship Floating Card */}
              <div className="p-5 bg-navy-900/95 border-t border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Closed-Loop Water Recycling</div>
                    <div className="text-xs text-slate-400">Recovers wash water & lowers chemical consumption</div>
                  </div>
                </div>

                <span className="shrink-0 text-xs font-bold px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                  Eco Efficient
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Key Details & Features */}
          <motion.div
            className="lg:col-span-6 space-y-6"
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div>
              <span className="inline-flex items-center px-3 py-1 text-xs font-bold tracking-wider uppercase text-brand-orange bg-brand-orange/15 border border-brand-orange/30 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Featured Flagship Innovation
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Compact Plastic Washing Machine{' '}
                <span className="text-brand-orange">(10 FT Design)</span>
              </h2>
              <p className="mt-3 text-slate-300 text-base leading-relaxed">
                Traditional plastic washing lines span 30 feet or more, consuming enormous plant space and millions of litres of water. ABS Polymers re-engineered the process into a compact 10 FT continuous washing, dewatering, and heating line.
              </p>
            </div>

            {/* 4 Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {plantBenefits.map((b, idx) => {
                const Icon = b.icon;
                return (
                  <div key={idx} className="bg-navy-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5 hover:border-slate-700 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center text-brand-orange">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-sm font-bold text-white">{b.title}</div>
                    <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-800">
              <Link
                href="/contact?intent=quote&product=absw-washing-plant"
                className="inline-flex items-center px-6 py-3.5 text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-lg shadow-lg shadow-brand-orange/20 transition-all transform hover:-translate-y-0.5"
              >
                <span>Request Washing Plant Quote</span>
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>

              <Link
                href="/machineries/absw-plastic-washing-plant"
                className="inline-flex items-center px-5 py-3.5 text-sm font-semibold text-slate-200 bg-navy-850 hover:bg-navy-800 border border-slate-700 rounded-lg transition-colors"
              >
                <FileText className="mr-2 w-4 h-4 text-slate-400" />
                <span>View Full Technical Datasheet</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
