import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, FileText, Droplets, Zap, ShieldCheck, Maximize2 } from 'lucide-react';
import { INITIAL_CMS_CONTENT } from '@/data/cms';

export default function FeaturedCompactPlant() {
  const content = INITIAL_CMS_CONTENT.compactPlantBanner;

  return (
    <section className="py-16 sm:py-24 bg-navy-950 text-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none"></div>
      <div className="absolute -top-24 right-0 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Visual Artwork */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-navy-900 shadow-2xl">
              <div className="relative aspect-16/10 w-full">
                <Image
                  src="/images/hero-reference.jpg"
                  alt="ABS Polymers Compact Washing Plant in operation"
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-50"></div>
              </div>

              {/* Water Splash & Cleaning Performance Indicator */}
              <div className="absolute bottom-4 left-4 bg-navy-900/90 backdrop-blur-md border border-slate-700 px-4 py-2.5 rounded-lg flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Closed-Loop Water Recycling</div>
                  <div className="text-[11px] text-slate-300">Minimizes freshwater & caustic soda consumption</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bullet Points & Features */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider uppercase text-brand-orange bg-brand-orange/10 border border-brand-orange/20 rounded-full mb-2">
                {content.badge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {content.title}
              </h2>
              <p className="mt-2 text-slate-300 text-sm sm:text-base">
                {content.subtitle}
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              {content.features.map((item, idx) => (
                <div key={idx} className="flex items-start text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-brand-orange mr-2.5 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* 4 Feature Badges Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-navy-900/80 border border-slate-800 p-3 rounded-lg flex items-center space-x-2.5">
                <Maximize2 className="w-4 h-4 text-brand-orange shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Compact Design</div>
                  <div className="text-[10px] text-slate-400">Less space, more output</div>
                </div>
              </div>
              <div className="bg-navy-900/80 border border-slate-800 p-3 rounded-lg flex items-center space-x-2.5">
                <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Efficient Washing</div>
                  <div className="text-[10px] text-slate-400">High friction cleaning</div>
                </div>
              </div>
              <div className="bg-navy-900/80 border border-slate-800 p-3 rounded-lg flex items-center space-x-2.5">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Energy Efficient</div>
                  <div className="text-[10px] text-slate-400">Lower operating cost</div>
                </div>
              </div>
              <div className="bg-navy-900/80 border border-slate-800 p-3 rounded-lg flex items-center space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">SS 302 Quality</div>
                  <div className="text-[10px] text-slate-400">Built for continuous duty</div>
                </div>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                href="/contact?intent=quote&product=absw-washing-plant"
                className="inline-flex items-center px-6 py-3 text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-md shadow-lg transition-transform transform hover:-translate-y-0.5"
              >
                <span>{content.ctaText}</span>
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/machineries/absw-plastic-washing-plant"
                className="inline-flex items-center px-5 py-3 text-sm font-semibold text-slate-200 bg-navy-850 hover:bg-navy-800 border border-slate-700 rounded-md transition-colors"
              >
                <FileText className="mr-2 w-4 h-4 text-slate-400" />
                <span>{content.specsCtaText}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
