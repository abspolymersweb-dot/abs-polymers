'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  Sparkles,
  Wrench,
  Globe,
  Activity,
  ArrowRight,
  CheckCircle2,
  Database,
  Image as ImageIcon,
  ExternalLink,
  Search,
  ShieldCheck,
  Settings
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [productsCount, setProductsCount] = useState(0);
  const [granulesCount, setGranulesCount] = useState(0);
  const [servicesCount, setServicesCount] = useState(0);
  const [destinationsCount, setDestinationsCount] = useState(0);
  const [mediaCount, setMediaCount] = useState(0);
  const [dbProvider, setDbProvider] = useState('Checking database...');

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/granules').then((r) => r.json()),
      fetch('/api/services').then((r) => r.json()),
      fetch('/api/destinations').then((r) => r.json()),
      fetch('/api/media').then((r) => r.json()),
      fetch('/api/db-health').then((r) => r.json())
    ])
      .then(([prodData, granData, srvData, destData, mediaData, healthData]) => {
        if (prodData.success) setProductsCount(prodData.count || 0);
        if (granData.success) setGranulesCount(granData.count || 0);
        if (srvData.success) setServicesCount(srvData.count || 0);
        if (destData.success) setDestinationsCount(destData.count || 0);
        if (mediaData.success) setMediaCount(mediaData.count || 0);
        if (healthData.success && healthData.health) {
          setDbProvider(healthData.health.provider);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Notice: Cloud Database Status */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-900 shadow-xs">
        <div className="flex items-start">
          <Database className="w-5 h-5 text-emerald-600 mr-3 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-bold text-sm text-emerald-950 flex items-center gap-2">
              <span>Production Database Active</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-mono uppercase font-bold">
                {dbProvider}
              </span>
            </div>
            <p className="text-emerald-800">
              Machinery specifications, polymer granule grades, turnkey services, and international export corridors persist across deployments with full RLS data protection.
            </p>
          </div>
        </div>
        <Link
          href="/admin/db-health"
          className="inline-flex items-center font-bold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shrink-0 shadow-xs"
        >
          Inspect DB Health →
        </Link>
      </div>

      {/* Summary KPI Metrics */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-4">
          Industrial Management Overview
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Machinery Products */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Machinery Catalogue</span>
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-brand-orange flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {loading ? '...' : productsCount}
            </div>
            <div className="text-xs text-emerald-600 font-semibold flex items-center">
              <span>Washing Plants, Crushers, Conveyors, Blowers</span>
            </div>
          </div>

          {/* Granules Catalog */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Granules & Polymers</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-navy-950 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {loading ? '...' : granulesCount}
            </div>
            <div className="text-xs text-slate-500">
              <span>HDPE, PP, LDPE, ABS Reprocessed</span>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Industrial Services</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <Wrench className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {loading ? '...' : servicesCount}
            </div>
            <div className="text-xs text-slate-500">
              <span>Turnkey lines, AMC, custom design</span>
            </div>
          </div>

          {/* Export Destinations */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Export Corridors</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {loading ? '...' : destinationsCount}
            </div>
            <div className="text-xs text-slate-500">
              <span>UAE, Kenya, Nigeria, Mexico, Tanzania...</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launch Control Centers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/machineries"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-brand-orange hover:shadow-md transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-colors">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 group-hover:text-brand-orange transition-colors">
            Machinery Management
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Add new recycling machines, update Havells motor kW and rotor knife specs, replace hero photos, and toggle publishing.
          </p>
          <div className="text-xs font-bold text-brand-orange inline-flex items-center pt-1">
            <span>Manage Machines</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>

        <Link
          href="/admin/granules"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-brand-orange hover:shadow-md transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-navy-950 flex items-center justify-center group-hover:bg-navy-950 group-hover:text-white transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 group-hover:text-brand-orange transition-colors">
            Granules Management
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Manage reprocessed polymer grades, melt flow index (MFI), colors, minimum order quantities, and packaging specifications.
          </p>
          <div className="text-xs font-bold text-brand-orange inline-flex items-center pt-1">
            <span>Manage Granules</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>

        <Link
          href="/admin/services"
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-brand-orange hover:shadow-md transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-700 group-hover:text-white transition-colors">
            <Wrench className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 group-hover:text-brand-orange transition-colors">
            Turnkey Services
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Configure recycling plant engineering scopes, installation deliverables, and genuine spare parts delivery pipelines.
          </p>
          <div className="text-xs font-bold text-brand-orange inline-flex items-center pt-1">
            <span>Manage Services</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>
      </div>

      {/* Operational Highlights */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Platform Health & Quick Links</h2>
            <p className="text-xs text-slate-500">Real-time status of production subsystems</p>
          </div>
          <a
            href="/"
            target="_blank"
            className="text-xs font-bold text-brand-orange hover:underline inline-flex items-center"
          >
            <span>Open Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" />
              Dynamic XML Sitemap
            </div>
            <p className="text-slate-500">Automatically reflects newly published machinery, granules, and services.</p>
            <div className="pt-1">
              <a href="/sitemap.xml" target="_blank" className="font-bold text-brand-orange hover:underline">
                /sitemap.xml →
              </a>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5" />
              Crawler Exclusion Directives
            </div>
            <p className="text-slate-500">Admin screens and private APIs are disallowed from public search indexation.</p>
            <div className="pt-1">
              <a href="/robots.txt" target="_blank" className="font-bold text-brand-orange hover:underline">
                /robots.txt →
              </a>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center">
              <Search className="w-4 h-4 text-emerald-600 mr-1.5" />
              Technical SEO Engine
            </div>
            <p className="text-slate-500">Real-time canonical tags, structured data, and metadata audits.</p>
            <div className="pt-1">
              <Link href="/admin/seo" className="font-bold text-brand-orange hover:underline">
                Launch SEO Engine →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
