'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, ArrowRight, CheckCircle2, Sparkles, Package } from 'lucide-react';
import { GRANULE_PRODUCTS, GRANULE_CATEGORIES } from '@/data/granules';
import { COMPANY_INFO } from '@/data/company';

export default function GranulesPage() {
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = GRANULE_PRODUCTS.filter((prod) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      prod.name.toLowerCase().includes(q) ||
      prod.materialType.toLowerCase().includes(q) ||
      prod.grade.toLowerCase().includes(q) ||
      prod.applications.some((a) => a.toLowerCase().includes(q));

    const matchMat = selectedMaterial === 'all' || prod.materialType.toUpperCase() === selectedMaterial.toUpperCase();

    return matchSearch && matchMat;
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>35+ Years Granule Industry Leadership</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Recycled & Reprocessed Plastic Granules
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Supplying consistent, lab-tested recycled HDPE, PP, LDPE, ABS, and HIPS granules from Coimbatore. Double-mesh filtered and washed in our proprietary washing plants for exceptional moulding stability.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search and Material Filter Bar */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200/90 shadow-xs mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by polymer type, grade (e.g. HDPE, Blow Moulding, PP, Injection)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1" />
              Polymer Category:
            </span>
            <button
              onClick={() => setSelectedMaterial('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                selectedMaterial === 'all'
                  ? 'bg-[#04294a] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Polymers ({GRANULE_PRODUCTS.length})
            </button>
            {GRANULE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedMaterial(cat.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                  selectedMaterial.toLowerCase() === cat.id.toLowerCase()
                    ? 'bg-[#04294a] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-white bg-[#04294a] px-3 py-1 rounded">
                    {prod.materialType}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Grade: {prod.grade}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-orange transition-colors">
                  {prod.name}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {prod.shortDescription}
                </p>

                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <div><strong>Appearance:</strong> {prod.appearance}</div>
                  <div><strong>Colors:</strong> {prod.colorsAvailable.join(', ')}</div>
                  {prod.meltFlowIndex && <div><strong>MFI:</strong> {prod.meltFlowIndex}</div>}
                  <div><strong>Min Order Quantity:</strong> {prod.minOrderQuantity}</div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/granules/${prod.slug}`}
                  className="text-xs sm:text-sm font-bold text-brand-orange hover:underline inline-flex items-center"
                >
                  <span>Technical Specs</span>
                  <ArrowRight className="ml-1 w-3.5 h-3.5" />
                </Link>

                <Link
                  href={`/contact?intent=quote&product=${prod.id}`}
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-md transition-colors shadow"
                >
                  Request Sample & Price
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

