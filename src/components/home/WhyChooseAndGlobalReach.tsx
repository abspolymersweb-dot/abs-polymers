'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, MapPin, Globe, Shield, CheckCircle2, Sparkles, Building, Send } from 'lucide-react';
import { COMPANY_INFO } from '@/data/company';

export default function WhyChooseAndGlobalReach() {
  const shouldReduceMotion = useReducedMotion();

  const corePillars = [
    {
      metric: '35+',
      unit: 'Years',
      title: 'Polymer Granules Experience',
      desc: 'Decades of deep knowledge in polymer grades, contamination thresholds, melt flow index, and compounding purity standards.',
    },
    {
      metric: '6+',
      unit: 'Years',
      title: 'Precision Machinery Engineering',
      desc: 'Purpose-built industrial recycling machinery manufactured with SS 302 contact tanks and EN41 high-tensile rotor blades.',
    },
    {
      metric: '10 FT',
      unit: 'Design',
      title: 'Space-Saving Innovation',
      desc: 'Pioneered compact washing lines that reduce plant footprint by 65% while maintaining high continuous hourly output.',
    },
    {
      metric: 'UAE',
      unit: 'Export',
      title: 'Active International Reach',
      desc: 'Proven international track record supplying continuous recycling machinery to the United Arab Emirates and Middle East recyclers.',
    },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 bg-navy-950 text-white relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-brand-orange uppercase tracking-wider mb-3 px-3 py-1 bg-brand-orange/15 rounded-full border border-brand-orange/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Industrial Heritage & Global Vision</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Built on Real Recycling Experience
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
            ABS Polymers did not begin as an external machinery reseller. We started as hands-on plastic recyclers and polymer compounders in Coimbatore, Tamil Nadu. We build machinery that solves the real operational frustrations of everyday plant managers.
          </p>
        </div>

        {/* 4 Clean Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {corePillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : idx * 0.1 }}
              className="bg-navy-900/80 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl sm:text-4xl font-black text-brand-orange">{pillar.metric}</span>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{pillar.unit}</span>
              </div>
              <h3 className="text-base font-bold text-white">{pillar.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Global Reach & Facility Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-navy-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10">
          {/* Facility Location Details */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <Building className="w-4 h-4" />
              <span>Manufacturing Headquarters & Export Desk</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Supplying Recyclers Across India & the UAE
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Operating from our dedicated machinery fabrication works in Coimbatore, Tamil Nadu, we provide full technical support, spare parts dispatch, and direct container shipping to clients in India, the UAE, and expanding Middle East territories.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-navy-950/80 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center text-xs font-bold text-white">
                  <MapPin className="w-4 h-4 text-brand-orange mr-1.5 shrink-0" />
                  <span>Coimbatore, Tamil Nadu, India</span>
                </div>
                <div className="text-xs text-slate-400">Headquarters, Engineering & Testing Works</div>
              </div>

              <div className="p-4 bg-navy-950/80 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center text-xs font-bold text-white">
                  <Globe className="w-4 h-4 text-emerald-400 mr-1.5 shrink-0" />
                  <span>United Arab Emirates (UAE)</span>
                </div>
                <div className="text-xs text-slate-400">Established Export Market & Commissioned Lines</div>
              </div>
            </div>
          </div>

          {/* Direct CTA card */}
          <div className="lg:col-span-5 bg-navy-950 rounded-xl p-6 sm:p-8 border border-slate-700/80 space-y-5">
            <div className="text-xs font-bold uppercase tracking-wider text-brand-orange">
              International & Domestic Orders
            </div>
            <div className="text-lg font-bold text-white">
              Planning a Plant Setup or Capacity Expansion?
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Contact our engineering team with your required hourly capacity (250 kg/h to 5000 kg/h) and plastic waste stream for custom layout designs and commercial proposals.
            </p>
            <div className="pt-1 flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact?intent=quote"
                className="inline-flex items-center justify-center px-5 py-3 text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-lg transition-colors"
              >
                <span>Request Project Proposal</span>
                <ArrowRight className="ml-1.5 w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center px-4 py-3 text-xs font-bold text-slate-300 hover:text-white bg-navy-850 hover:bg-navy-800 rounded-lg border border-slate-700 transition-colors"
              >
                <span>About Our History</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
