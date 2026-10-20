'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Plus,
  Eye,
  Edit,
  Sparkles,
  Download
} from 'lucide-react';
import { MACHINERY_PRODUCTS, MACHINERY_CATEGORIES } from '@/data/machinery';
import { MachineryProduct } from '@/types';

export default function AdminMachineriesPage() {
  const [products, setProducts] = useState<MachineryProduct[]>(MACHINERY_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<MachineryProduct | null>(null);

  const togglePublish = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p))
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Machinery & Specification Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain verified brochure technical parameters, model variants, electrical ratings, and published datasheets.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href="/docs/abs-polymers-machinery-specifications.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-brand-orange" />
            PDF Source Master
          </a>
        </div>
      </div>

      {/* Machinery Products List */}
      <div className="space-y-6">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
          >
            {/* Header banner for machine */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-brand-orange uppercase">
                    {prod.series}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-semibold capitalize">
                    {prod.category.replace('-', ' ')}
                  </span>
                  {prod.highlightBadge && (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      {prod.highlightBadge}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-black text-slate-900">{prod.name}</h2>
                <div className="text-xs text-slate-500">
                  Slug: <code className="font-mono bg-slate-200 px-1 rounded">/machineries/{prod.slug}</code>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => togglePublish(prod.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                    prod.published
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                  }`}
                >
                  {prod.published ? 'Published (Live)' : 'Draft (Hidden)'}
                </button>

                <Link
                  href={`/machineries/${prod.slug}`}
                  target="_blank"
                  className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  Live Preview
                </Link>
              </div>
            </div>

            {/* Model Variants Breakdown */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {prod.variants.length} Registered Model Variants & Technical Benchmarks
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  All motors: Havells 380V/415V 50Hz 3-Phase
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-100 rounded-lg overflow-hidden min-w-[650px]">
                  <thead className="bg-slate-100 text-slate-600">
                    <tr>
                      <th className="py-2.5 px-3 font-bold">Model</th>
                      <th className="py-2.5 px-3 font-bold">Capacity (kg/h)</th>
                      <th className="py-2.5 px-3 font-bold">Motor & Electricals</th>
                      <th className="py-2.5 px-3 font-bold">Dimensions (L×W×H)</th>
                      <th className="py-2.5 px-3 font-bold">Weight</th>
                      <th className="py-2.5 px-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {prod.variants.map((v) => (
                      <tr key={v.modelNumber} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-slate-900">{v.modelNumber}</td>
                        <td className="py-2.5 px-3 font-semibold text-[#04294a]">{v.capacityKgHr} kg/h</td>
                        <td className="py-2.5 px-3 text-slate-600">{v.motorPower || 'Havells'}</td>
                        <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                          {v.dimensionsMm ? `${v.dimensionsMm.length}×${v.dimensionsMm.width}×${v.dimensionsMm.height}mm` : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{v.weightKg ? `${v.weightKg} kg` : '-'}</td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
                            Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Verified vs Awaiting Confirmation Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                    Verified Parameters ({prod.verifiedSpecs.length})
                  </div>
                  <div className="text-[11px] text-emerald-800 space-y-0.5">
                    {prod.verifiedSpecs.slice(0, 3).map((s, idx) => (
                      <div key={idx}>• {s.label}: <strong>{s.value}</strong></div>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1 text-amber-600" />
                    Verification Checks ({prod.awaitingConfirmationSpecs?.length || 0})
                  </div>
                  <div className="text-[11px] text-amber-800 space-y-0.5">
                    {prod.awaitingConfirmationSpecs && prod.awaitingConfirmationSpecs.length > 0 ? (
                      prod.awaitingConfirmationSpecs.map((s, idx) => (
                        <div key={idx}>• {s.label}: {s.value}</div>
                      ))
                    ) : (
                      <div>All parameters verified against official PDF tables.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

