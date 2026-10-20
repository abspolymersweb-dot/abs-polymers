import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, PackageCheck } from 'lucide-react';
import { GRANULE_PRODUCTS } from '@/data/granules';

export default function GranulesPreview() {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
              35+ Years Industry Experience
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Premium Recycled Plastic Granules
            </h2>
            <p className="mt-2 text-slate-600 max-w-2xl text-sm sm:text-base">
              Consistent melt flow index, washed and double-screen filtered recycled granules for injection, blow moulding, and extrusion.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/granules"
              className="inline-flex items-center text-sm font-bold text-[#04294a] hover:text-brand-orange transition-colors"
            >
              <span>Explore All Polymer Grades</span>
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Granules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GRANULE_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:bg-white hover:shadow-xl hover:border-brand-orange/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-white bg-[#04294a] px-2.5 py-1 rounded">
                    {prod.materialType}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {prod.status === 'available' ? 'In Stock / Supply' : 'Enquiry Only'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-orange transition-colors">
                  {prod.name}
                </h3>

                <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                  {prod.shortDescription}
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-500 border-t border-slate-200/60 pt-3">
                  <div><strong>Grade:</strong> {prod.grade}</div>
                  <div><strong>Colors:</strong> {prod.colorsAvailable.join(', ')}</div>
                  {prod.meltFlowIndex && <div><strong>MFI:</strong> {prod.meltFlowIndex}</div>}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/granules/${prod.slug}`}
                  className="text-xs font-bold text-brand-orange hover:underline inline-flex items-center"
                >
                  <span>Specifications</span>
                  <ArrowRight className="ml-1 w-3 h-3" />
                </Link>
                <Link
                  href={`/contact?intent=quote&product=${prod.id}`}
                  className="text-[11px] font-bold text-slate-700 bg-slate-200/80 hover:bg-brand-orange hover:text-white px-2.5 py-1 rounded transition-colors"
                >
                  Order Sample
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
