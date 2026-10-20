'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, ArrowRight, CheckCircle2, FileText, Sparkles, Layers, SlidersHorizontal } from 'lucide-react';
import { MACHINERY_PRODUCTS, MACHINERY_CATEGORIES } from '@/data/machinery';

export default function MachineryCataloguePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    return MACHINERY_PRODUCTS.filter((prod) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        prod.name.toLowerCase().includes(q) ||
        prod.series.toLowerCase().includes(q) ||
        prod.shortDescription.toLowerCase().includes(q) ||
        prod.variants.some((v) => v.modelNumber.toLowerCase().includes(q)) ||
        prod.compatibleMaterials.some((m) => m.toLowerCase().includes(q));

      const matchCat = selectedCategory === 'all' || prod.category === selectedCategory;

      return matchQuery && matchCat;
    }).sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'variants') return b.variants.length - a.variants.length;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Industrial Machinery Catalogue</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Plastic Recycling Machinery
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Engineered in Coimbatore, India. Designed for heavy-duty 24/7 continuous duty, low power consumption, and maximum recovery. Explore our verified technical datasheets for washing lines, crushers, conveyors, and blowers.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Filter Controls */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200/90 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search machine name or model number (e.g. W1000, G500, CR250, MTB1500)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="name">Product Name (A-Z)</option>
                <option value="variants">Most Capacity Variants</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1" />
              Category:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#04294a] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Machinery ({MACHINERY_PRODUCTS.length})
            </button>
            {MACHINERY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#04294a] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <p className="text-lg font-bold text-slate-700">No machinery matched your query.</p>
            <p className="text-sm text-slate-500 mt-1">Try clearing your search term or selecting &ldquo;All Machinery&rdquo;.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 text-xs font-bold text-white bg-brand-orange rounded-md"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Visual Header */}
                <div className="relative h-64 sm:h-72 w-full bg-slate-900 overflow-hidden">
                  <Image
                    src={product.heroImage}
                    alt={product.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent"></div>

                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {product.highlightBadge && (
                      <span className="bg-brand-orange text-white text-xs font-extrabold px-3 py-1 rounded shadow">
                        {product.highlightBadge}
                      </span>
                    )}
                    <span className="bg-navy-900/90 text-white text-xs font-semibold px-2.5 py-1 rounded backdrop-blur-xs">
                      {product.series}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs uppercase tracking-wider text-orange-300 font-bold">
                      {product.variants.length} Capacity Models Available
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black mt-0.5 group-hover:text-orange-200 transition-colors">
                      {product.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {product.shortDescription}
                    </p>

                    {/* Quick Specs Pill Box */}
                    <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Verified Technical Benchmarks
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                        {product.verifiedSpecs.slice(0, 4).map((spec, sIdx) => (
                          <div key={sIdx} className="flex items-start">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5 shrink-0 mt-0.5" />
                            <span><strong>{spec.label}:</strong> {spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Model numbers quick pills */}
                    <div className="mt-4 flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-500 mr-1">Models:</span>
                      {product.variants.map((v) => (
                        <span
                          key={v.modelNumber}
                          className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                        >
                          {v.modelNumber} ({v.capacityKgHr} kg/h)
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <Link
                      href={`/machineries/${product.slug}`}
                      className="inline-flex items-center px-5 py-2.5 text-sm font-bold text-white bg-[#04294a] hover:bg-navy-800 rounded-lg transition-colors group"
                    >
                      <span>Full Datasheet & Specs</span>
                      <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href={`/contact?intent=quote&product=${product.id}`}
                      className="inline-flex items-center px-4 py-2.5 text-sm font-bold text-brand-orange bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                    >
                      Request Quotation
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

