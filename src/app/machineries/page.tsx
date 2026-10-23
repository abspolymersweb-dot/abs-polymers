'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Filter,
  ArrowRight,
  CheckCircle2,
  FileText,
  Sparkles,
  Layers,
  SlidersHorizontal,
  Workflow,
  Factory,
  Scissors,
  Waves,
  Wind,
  PackageCheck
} from 'lucide-react';
import { MACHINERY_PRODUCTS, MACHINERY_CATEGORIES } from '@/data/machinery';

const SOLUTION_STAGES = [
  {
    step: '01',
    title: 'Plastic Collection & Feeding',
    subtitle: 'Raw Scrap Infeed',
    desc: 'Heavy-duty infeed hoppers and bulk conveyors to receive baled bottles, hollow-ware drums, and rigid industrial scrap.',
    compatible: 'CR Series Screw Conveyors',
    icon: Factory,
  },
  {
    step: '02',
    title: 'Sorting & Material Preparation',
    subtitle: 'De-baling & Metal Separation',
    desc: 'Manual inspection belts and cross-belt magnetic separators ensuring zero metallic contamination enters granulator chambers.',
    compatible: 'Turnkey Infeed Conveyors',
    icon: Layers,
  },
  {
    step: '03',
    title: 'High-Torque Crushing',
    subtitle: 'EN41 Size Reduction',
    desc: 'G Series crushers with high-carbon EN41 knives shearing scrap into uniform 1 mm–25 mm regrind flakes at 480 RPM.',
    compatible: 'G Series Crushers (250–2,000 kg/h)',
    icon: Scissors,
  },
  {
    step: '04',
    title: 'Hot-Friction Washing',
    subtitle: '60°C – 80°C Dynamic Cleaning',
    desc: 'ABSW 10 FT compact washer removing oils, adhesives, chemical labels, and germs through intensive high-speed friction wash.',
    compatible: 'ABSW 10 FT Washing Plants (W250–W5000)',
    icon: Waves,
  },
  {
    step: '05',
    title: 'Separation & Dewatering',
    subtitle: 'Centrifugal Moisture Extraction',
    desc: 'Closed-loop water settlement circuit and high-speed centrifugal spin drying ensuring minimal residual flake moisture.',
    compatible: 'Integrated ABSW Dewatering Spinners',
    icon: Waves,
  },
  {
    step: '06',
    title: 'Flake Drying & Transport',
    subtitle: 'Pneumatic Conveying',
    desc: 'MTB series 2880 RPM blowers pneumatically moving clean dried polymer flakes directly into storage holding silos.',
    compatible: 'MTB Series Material Transport Blowers',
    icon: Wind,
  },
  {
    step: '07',
    title: 'Granule Compounding & Pellets',
    subtitle: 'Circular Polymer Granules',
    desc: 'Clean flakes melted and double-mesh filtered through compounding extruders into reprocessed HDPE/PP/LDPE/ABS pellets.',
    compatible: 'ABS Polymers Polymer Granules Division',
    icon: PackageCheck,
  },
];

export default function MachineryCataloguePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [activeStage, setActiveStage] = useState(0);

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
      <div className="bg-navy-950 text-white pt-28 pb-14 sm:pt-32 sm:pb-18 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Industrial Machinery & Processing Lines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Plastic Recycling Machinery Catalogue
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Engineered in Coimbatore, India. Designed for heavy-duty 24/7 continuous duty, low power consumption, and maximum polymer recovery. Explore verified technical datasheets for washing lines, crushers, conveyors, and blowers.
          </p>
        </div>
      </div>

      {/* 7 Integrated Process Solution Stages */}
      <div className="bg-white border-b border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-brand-orange uppercase tracking-wider mb-2 px-3 py-1 bg-brand-orange/10 rounded-full">
              <Workflow className="w-3.5 h-3.5" />
              <span>Modular Solution Stages</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Complete Plastic Recycling Process Stages
            </h2>
            <p className="mt-2 text-slate-600 text-sm leading-relaxed">
              ABS Polymers supplies standalone units as well as synchronized turnkey lines tailored to your incoming polymer scrap and floor space.
            </p>
          </div>

          {/* Stepper Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {SOLUTION_STAGES.map((stg, sIdx) => {
              const StageIcon = stg.icon;
              const isSelected = activeStage === sIdx;
              return (
                <button
                  key={stg.step}
                  onClick={() => setActiveStage(sIdx)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-navy-950 text-white border-navy-950 shadow-md scale-[1.02]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${isSelected ? 'bg-brand-orange text-white' : 'bg-slate-200 text-slate-600'}`}>
                      {stg.step}
                    </span>
                    <StageIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-brand-orange' : 'text-slate-400'}`} />
                  </div>
                  <div className="text-xs font-bold truncate">{stg.title.split('. ')[1] || stg.title}</div>
                  <div className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {stg.subtitle}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Callout Box */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                Stage {SOLUTION_STAGES[activeStage].step}: {SOLUTION_STAGES[activeStage].title}
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                {SOLUTION_STAGES[activeStage].desc}
              </p>
              <div className="text-xs font-semibold text-navy-900 pt-1">
                <strong>Configured Equipment:</strong> {SOLUTION_STAGES[activeStage].compatible}
              </div>
            </div>

            <Link
              href="/contact?intent=plant_turnkey"
              className="shrink-0 inline-flex items-center px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              Inquire for Complete Turnkey Plant
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filter Controls */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200 shadow-xs mb-8 space-y-4">
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
              Filter:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-navy-950 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Machinery ({MACHINERY_PRODUCTS.length})
            </button>
            {MACHINERY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-navy-950 text-white'
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProducts.map((product) => {
              const isContainImage =
                product.heroImage.includes('washing-plant') ||
                product.heroImage.includes('crusher-granulator');

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:border-slate-300"
                >
                  {/* Visual Header */}
                  <div className={`relative h-64 sm:h-72 w-full p-6 overflow-hidden flex items-center justify-center ${isContainImage ? 'bg-slate-100' : 'bg-slate-900'}`}>
                    <div className="relative w-full h-full">
                      <Image
                        src={product.heroImage}
                        alt={product.name}
                        fill
                        className={`${
                          isContainImage
                            ? 'object-contain object-center'
                            : 'object-cover object-center rounded-lg'
                        } group-hover:scale-105 transition-transform duration-500`}
                      />
                    </div>

                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {product.highlightBadge && (
                        <span className="bg-navy-950/90 text-white text-xs font-extrabold px-3 py-1 rounded shadow border border-slate-700/60">
                          {product.highlightBadge}
                        </span>
                      )}
                      <span className="bg-white/95 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded shadow-xs border border-slate-200">
                        {product.series}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-4 bg-navy-950/85 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded">
                      {product.variants.length} Capacity Models
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-brand-orange transition-colors">
                        <Link href={`/machineries/${product.slug}`}>
                          {product.name}
                        </Link>
                      </h3>

                      <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                        {product.shortDescription}
                      </p>

                      {/* Quick Specs Pill Box */}
                      <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Verified Technical Benchmarks
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                          {product.verifiedSpecs.slice(0, 4).map((spec, sIdx) => (
                            <div key={sIdx} className="flex items-start">
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-orange mr-1.5 shrink-0 mt-0.5" />
                              <span><strong>{spec.label}:</strong> {spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Model numbers quick pills */}
                      <div className="mt-4 flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-500 mr-1">Available Models:</span>
                        {product.variants.map((v) => (
                          <span
                            key={v.modelNumber}
                            className="text-[11px] font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200"
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
                        className="inline-flex items-center px-5 py-2.5 text-xs font-bold text-white bg-navy-950 hover:bg-navy-900 rounded-lg transition-colors group"
                      >
                        <span>Full Datasheet & Specs</span>
                        <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>

                      {/* Preselects product in quotation form */}
                      <Link
                        href={`/contact?intent=machinery_quotation&product=${product.id}`}
                        className="inline-flex items-center px-4 py-2.5 text-xs font-bold text-brand-orange bg-orange-50 hover:bg-brand-orange hover:text-white rounded-lg transition-colors"
                      >
                        Request Quotation
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
