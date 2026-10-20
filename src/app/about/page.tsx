import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Award, Clock, MapPin, Globe, CheckCircle2, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import { COMPANY_INFO } from '@/data/company';

export const metadata: Metadata = {
  title: 'About ABS Polymers | Plastic Recycling Machinery Manufacturer Coimbatore',
  description: 'Learn about ABS Polymers, based in Coimbatore, Tamil Nadu. 35+ years in plastic granules, 6+ years in machinery manufacturing, exporting to UAE.'
};

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <div className="bg-navy-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/15 px-3 py-1 rounded-full border border-brand-orange/30">
            About ABS Polymers
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mt-3">
            35+ Years Granules Mastery.<br />
            6+ Years Machinery Innovation.
          </h1>
          <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Headquartered in Coimbatore, Tamil Nadu, India, ABS Polymers bridges the vital gap between material science and heavy-duty recycling machinery engineering.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        {/* Company Background Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
              Our Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              From Polymer Trading to Industrial Machine Engineering
            </h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              ABS Polymers began more than <strong>35 years ago</strong> in Coimbatore as a dedicated supplier and reprocessor of plastic granules. Working across HDPE, LDPE, PP, ABS, HIPS, and GPPS taught us exactly what standard machines were getting wrong: excessive water consumption, oversized footprints that required huge industrial sheds, and frequent blade blunting on abrasive scrap.
            </p>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              <strong>6 years ago</strong>, we established our dedicated machinery manufacturing division. By applying our decades of hands-on polymer processing insight, our engineering team developed the <strong>10 FT compact plastic washing plant</strong> with closed-loop water recirculation and the <strong>G Series high-shear granulator</strong> with hardened EN41 knives.
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-navy-900 rounded-2xl p-8 border border-slate-700 text-white space-y-6 shadow-xl">
              <h3 className="text-xl font-bold border-b border-slate-700 pb-3">
                Verified Business Facts
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-brand-orange mr-3 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Manufacturing Base</strong>
                    <span className="text-slate-300">Coimbatore, Tamil Nadu, India</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-brand-orange mr-3 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Granules Track Record</strong>
                    <span className="text-slate-300">35+ years continuous experience in recycled polymers</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <Award className="w-5 h-5 text-brand-orange mr-3 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Machinery Engineering</strong>
                    <span className="text-slate-300">6+ years dedicated design and equipment fabrication</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <Globe className="w-5 h-5 text-emerald-400 mr-3 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Export Footprint</strong>
                    <span className="text-slate-300">United Arab Emirates (UAE) active export market; strategic plans for GCC and international expansion</span>
                  </div>
                </div>
              </div>

              {/* Data integrity notice */}
              <div className="bg-navy-950/80 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-start">
                <AlertCircle className="w-4 h-4 text-slate-400 mr-2 shrink-0 mt-0.5" />
                <span>
                  ABS Polymers adheres to strict documentation veracity. All specifications published on this website originate from factory testing and verified engineering datasheets.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Reach Focus */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
              International Trade
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Serving Recyclers Across India & the UAE
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Our plastic recycling lines are built with heavy stainless steel contact zones (SS 302) and 100% genuine Havells motors to ensure seamless operation even under the extreme ambient temperatures of the Middle East. With successful installations in the UAE, we are expanding our engineering presence internationally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold uppercase text-brand-orange">Domestic India</div>
              <div className="text-lg font-black text-slate-900">Pan-India Support</div>
              <p className="text-xs text-slate-600">Supplying recyclers across Tamil Nadu, Kerala, Karnataka, Maharashtra, and Gujarat.</p>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold uppercase text-emerald-600">Active Export</div>
              <div className="text-lg font-black text-slate-900">United Arab Emirates</div>
              <p className="text-xs text-slate-600">Dedicated export packaging, shipping through Jebel Ali, and on-site commissioning.</p>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-bold uppercase text-blue-600">Future Growth</div>
              <div className="text-lg font-black text-slate-900">Global Expansion</div>
              <p className="text-xs text-slate-600">Active inquiries from Middle East (Oman, KSA, Qatar) and East Africa.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
