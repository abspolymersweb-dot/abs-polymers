'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle2, Eye, Package, ArrowRight } from 'lucide-react';
import { GRANULE_PRODUCTS, GRANULE_CATEGORIES } from '@/data/granules';
import { GranuleProduct } from '@/types';

export default function AdminGranulesPage() {
  const [granules, setGranules] = useState<GranuleProduct[]>(GRANULE_PRODUCTS);

  const toggleStatus = (id: string) => {
    setGranules((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, status: g.status === 'available' ? 'enquiry_only' : 'available' }
          : g
      )
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Granules & Polymer Grade Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage 35+ years product offerings: HDPE, LDPE, PP, ABS, HIPS, and GPPS technical grades, MFI, and inventory availability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {granules.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-white bg-[#04294a] px-2.5 py-1 rounded">
                  {prod.materialType} Polymer
                </span>
                <button
                  type="button"
                  onClick={() => toggleStatus(prod.id)}
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border transition-colors ${
                    prod.status === 'available'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {prod.status === 'available' ? '● Available for Dispatch' : '○ Enquiry Only'}
                </button>
              </div>

              <h2 className="text-lg font-bold text-slate-900">{prod.name}</h2>
              <div className="text-xs text-slate-500">Grade: <strong>{prod.grade}</strong></div>
              <p className="text-xs text-slate-600 line-clamp-2">{prod.shortDescription}</p>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1 text-slate-600">
                {prod.meltFlowIndex && <div><strong>MFI:</strong> {prod.meltFlowIndex}</div>}
                <div><strong>Available Colors:</strong> {prod.colorsAvailable.join(', ')}</div>
                <div><strong>Min Order:</strong> {prod.minOrderQuantity}</div>
                <div><strong>Packaging:</strong> {prod.packaging}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={`/granules/${prod.slug}`}
                target="_blank"
                className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-brand-orange"
              >
                <Eye className="w-3.5 h-3.5 mr-1" />
                Preview Public Page
              </Link>
              <Link
                href={`/contact?intent=quote&product=${prod.id}`}
                className="text-xs font-bold text-brand-orange hover:underline"
              >
                Test Inquiry Flow →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

