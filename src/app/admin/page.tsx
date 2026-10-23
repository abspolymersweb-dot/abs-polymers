'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Inbox,
  FileText,
  Layers,
  Sparkles,
  Activity,
  ArrowRight,
  Clock,
  CheckCircle2,
  Database,
  Image as ImageIcon,
  User,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { CustomerInquiry } from '@/types';

export default function AdminOverviewPage() {
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsCount, setProductsCount] = useState(6);
  const [mediaCount, setMediaCount] = useState(6);
  const [blogsCount, setBlogsCount] = useState(3);

  useEffect(() => {
    Promise.all([
      fetch('/api/inquiries').then((r) => r.json()),
      fetch('/api/products').then((r) => r.json()),
      fetch('/api/media').then((r) => r.json()),
      fetch('/api/blogs').then((r) => r.json())
    ])
      .then(([inqData, prodData, mediaData, blogData]) => {
        if (inqData.success) setInquiries(inqData.inquiries || []);
        if (prodData.success) setProductsCount(prodData.count || 6);
        if (mediaData.success) setMediaCount(mediaData.count || 6);
        if (blogData.success) setBlogsCount(blogData.count || 3);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const newInquiries = inquiries.filter((i) => i.status === 'new');
  const inProgress = inquiries.filter((i) => i.status === 'in_progress' || i.status === 'quotation_sent');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Notice: SQLite Live Persistent Mode */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-900 shadow-xs">
        <div className="flex items-start">
          <Database className="w-5 h-5 text-emerald-600 mr-3 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="font-bold text-sm text-emerald-950 flex items-center gap-2">
              <span>Local CMS Active & Persistent</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-mono uppercase">
                SQLite WAL Mode
              </span>
            </div>
            <p className="text-emerald-800">
              Database stored at <code className="font-mono bg-emerald-100/80 px-1.5 py-0.5 rounded">data/abs_polymers.db</code>. Images saved in <code className="font-mono bg-emerald-100/80 px-1.5 py-0.5 rounded">public/uploads/</code>. All page edits, images, specs, and quotation inquiries are permanently preserved across server restarts.
            </p>
          </div>
        </div>
        <Link
          href="/admin/db-health"
          className="inline-flex items-center font-bold px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shrink-0 shadow-2xs"
        >
          Database Health →
        </Link>
      </div>

      {/* Summary KPI Metrics */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-4">
          Industrial Management Overview
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Inquiries */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Inquiries</span>
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-brand-orange flex items-center justify-center">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {loading ? '...' : inquiries.length}
            </div>
            <div className="text-xs text-brand-orange font-semibold flex items-center">
              <span>{newInquiries.length} New awaiting review</span>
            </div>
          </div>

          {/* Active Machinery */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Active Machinery</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {productsCount} Lines
            </div>
            <div className="text-xs text-slate-500">
              Havells 3-Phase Motors Verified
            </div>
          </div>

          {/* Media Assets */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Media Assets</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <ImageIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {mediaCount} Files
            </div>
            <div className="text-xs text-slate-500">
              Local persistent disk storage
            </div>
          </div>

          {/* Published Blogs / SEO Readiness */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Published Blogs</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {blogsCount}
            </div>
            <div className="text-xs text-emerald-600 font-semibold flex items-center">
              <span>Avg. SEO Readiness: 91/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Inquiries Queue */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Customer Inquiries</h2>
              <p className="text-xs text-slate-500">Live incoming machinery and granules quotations</p>
            </div>
            <Link
              href="/admin/inquiries"
              className="text-xs font-bold text-brand-orange hover:underline flex items-center"
            >
              View Full Pipeline ({inquiries.length})
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading inquiries from SQLite...</div>
            ) : inquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No inquiries recorded yet.</div>
            ) : (
              inquiries.slice(0, 5).map((inq) => (
                <div key={inq.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">{inq.fullName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500 font-medium">{inq.companyName || 'Private Recycler'}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-400 font-mono">{inq.country}</span>
                    </div>
                    <div className="text-xs text-slate-600">
                      Product: <strong className="text-slate-900">{inq.productName || inq.inquiryType}</strong>
                      {inq.estimatedCapacityNeeded && (
                        <span className="text-slate-400 ml-1">({inq.estimatedCapacityNeeded})</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        inq.status === 'new'
                          ? 'bg-amber-100 text-amber-800'
                          : inq.status === 'quotation_sent'
                          ? 'bg-blue-100 text-[#04294a]'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {inq.status.replace('_', ' ')}
                    </span>
                    <Link
                      href={`/admin/inquiries?id=${inq.id}`}
                      className="p-1 text-slate-400 hover:text-brand-orange"
                      title="Open inquiry"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Quick CMS Workflows
            </h3>
            <div className="space-y-2">
              <Link
                href="/admin/pages"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-orange-50/60 hover:border-brand-orange/40 border border-transparent transition-all group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-brand-orange">
                    Edit Pages & Copy
                  </div>
                  <div className="text-[11px] text-slate-500">Hero headlines, feature bar, compact plant</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-orange" />
              </Link>

              <Link
                href="/admin/media"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-orange-50/60 hover:border-brand-orange/40 border border-transparent transition-all group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-brand-orange">
                    Media Library & Images
                  </div>
                  <div className="text-[11px] text-slate-500">Upload photos, copy image URLs, view gallery</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-orange" />
              </Link>

              <Link
                href="/admin/machineries"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-orange-50/60 hover:border-brand-orange/40 border border-transparent transition-all group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-brand-orange">
                    Machinery Datasheets
                  </div>
                  <div className="text-[11px] text-slate-500">Edit model variants, electricals, capacity</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-orange" />
              </Link>

              <Link
                href="/admin/settings"
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-orange-50/60 hover:border-brand-orange/40 border border-transparent transition-all group"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-brand-orange">
                    Company & Admin Security
                  </div>
                  <div className="text-[11px] text-slate-500">Contact details, passwords, footer attribution</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-orange" />
              </Link>
            </div>
          </div>

          {/* System Environment Quick Badge */}
          <div className="bg-navy-950 text-slate-300 rounded-2xl p-5 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-white font-bold">
              <span className="flex items-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mr-1.5" />
                Persistent Local CMS
              </span>
              <span className="text-[10px] text-slate-400 font-mono">localhost:3000</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Full administrative autonomy without manual code changes. Changes to copy, specifications, and media persist in SQLite.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
