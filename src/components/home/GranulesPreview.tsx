'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { GRANULE_PRODUCTS } from '@/data/granules';

export default function GranulesPreview({ initialGranules }: { initialGranules?: any[] }) {
  const shouldReduceMotion = useReducedMotion();

  const displayGranules = React.useMemo(() => {
    if (initialGranules && Array.isArray(initialGranules) && initialGranules.length > 0) {
      const published = initialGranules.filter((g: any) => g.published !== false);
      if (published.length > 0) {
        return published.slice(0, 4);
      }
    }
    return GRANULE_PRODUCTS;
  }, [initialGranules]);

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: shouldReduceMotion ? 0 : i * 0.1,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <section id="granules" className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-brand-orange uppercase tracking-wider mb-3 px-3 py-1 bg-brand-orange/10 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>35+ Years Polymer Granules Mastery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Premium Recycled Plastic Granules
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
              Before machinery engineering, ABS Polymers built a 35-year foundation in polymer trading and recycled granules in Coimbatore. We supply consistent, double-screen filtered recycled granules with lab-verified melt flow index.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/contact?intent=granules"
              className="inline-flex items-center px-6 py-3.5 text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>Enquire About Granules</span>
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 4 Core Material Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayGranules.map((prod, idx) => (
            <motion.div
              key={prod.id}
              custom={idx}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 hover:bg-white hover:border-brand-orange/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Header tags */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-white bg-navy-950 px-3 py-1 rounded-md">
                    {prod.materialType}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {prod.status === 'available' ? 'Verified Supply' : 'Made to Order'}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-orange transition-colors">
                    <Link href={`/granules/${prod.slug}`}>
                      {prod.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {prod.shortDescription}
                  </p>
                </div>

                {/* Specs Box */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/70 space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-semibold">Grade</span>
                    <span className="font-bold text-slate-900">{prod.grade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-semibold">Melt Flow Index</span>
                    <span className="font-bold text-slate-900">{prod.meltFlowIndex?.split(' ')[0] || 'Lab Tested'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 font-semibold">Colors</span>
                    <span className="font-bold text-slate-900 truncate max-w-[130px]">{prod.colorsAvailable.slice(0, 2).join(', ')}</span>
                  </div>
                </div>

                {/* Feature checklist */}
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange mr-2 shrink-0" />
                    <span>Double 80/100 mesh filtered</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange mr-2 shrink-0" />
                    <span>Uniform degreased pellets</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-slate-200/70 flex items-center justify-between">
                <Link
                  href={`/granules/${prod.slug}`}
                  className="text-xs font-bold text-navy-900 hover:text-brand-orange inline-flex items-center transition-colors"
                >
                  <span>Datasheet</span>
                  <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href={`/contact?intent=granules&product=${prod.id}`}
                  className="px-3 py-1.5 text-xs font-bold text-brand-orange bg-orange-50 hover:bg-brand-orange hover:text-white rounded-md transition-colors"
                >
                  Sample Request
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-slate-700 text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Need customized polymer grades or continuous monthly container supply to UAE / overseas?</span>
          </div>
          <Link
            href="/granules"
            className="text-xs font-bold text-brand-orange hover:underline shrink-0 inline-flex items-center"
          >
            <span>View All Granule Categories</span>
            <ArrowRight className="ml-1 w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
