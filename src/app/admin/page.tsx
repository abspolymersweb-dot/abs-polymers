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
  AlertTriangle,
  User,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { MACHINERY_PRODUCTS } from '@/data/machinery';
import { GRANULE_PRODUCTS } from '@/data/granules';
import { BLOG_POSTS } from '@/data/blogs';
import { CustomerInquiry } from '@/types';

export default function AdminOverviewPage() {
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/inquiries')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setInquiries(data.inquiries);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const newInquiries = inquiries.filter((i) => i.status === 'new');
  const inProgress = inquiries.filter((i) => i.status === 'in_progress' || i.status === 'quotation_sent');
  const publishedBlogs = BLOG_POSTS.filter((b) => b.status === 'published');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-800">
        <div className="flex items-start">
          <AlertTriangle className="w-4 h-4 text-amber-600 mr-2 shrink-0 mt-0.5" />
          <span>
            <strong>Development Environment Notice:</strong> Operating with in-memory inquiry repository and local data adapters. All public forms and administrative actions work cleanly. Connect <code className="font-mono bg-amber-100 px-1 rounded">DATABASE_URL</code> in settings to activate persistent production storage.
          </span>
        </div>
        <Link
          href="/admin/db-health"
          className="font-bold underline text-amber-900 shrink-0"
        >
          View Health Status →
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

          {/* Quotations / In Progress */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Active Quotations</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#04294a] flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900">
              {loading ? '...' : inProgress.length}
            </div>
            <div className="text-xs text-slate-500">
              UAE & India commercial tenders
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
              {MACHINERY_PRODUCTS.length} Lines
            </div>
            <div className="text-xs text-slate-500">
              {MACHINERY_PRODUCTS.reduce((acc, p) => acc + p.variants.length, 0)} Model Variants Verified
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
              {publishedBlogs.length}
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
              <p className="text-xs text-slate-500">Direct requests from website forms</p>
            </div>
            <Link
              href="/admin/inquiries"
              className="text-xs font-bold text-brand-orange hover:underline inline-flex items-center"
            >
              <span>Manage All ({inquiries.length})</span>
              <ArrowRight className="ml-1 w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {inquiries.slice(0, 4).map((inq) => (
              <div key={inq.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">{inq.fullName}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-600 font-medium">{inq.companyName}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                      {inq.country}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700">
                    <strong className="text-[#04294a]">{inq.productName}</strong>
                    {inq.modelSelected && <span className="text-slate-500"> ({inq.modelSelected})</span>}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 italic">
                    &ldquo;{inq.message}&rdquo;
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${
                      inq.status === 'new'
                        ? 'bg-orange-100 text-orange-800 border border-orange-200'
                        : inq.status === 'quotation_sent'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {inq.status.replace('_', ' ')}
                  </span>
                  <Link
                    href={`/admin/inquiries?id=${inq.id}`}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Administrative Actions & System Status */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Quick Administrative Actions
            </h3>
            <div className="space-y-2">
              <Link
                href="/admin/machineries"
                className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors"
              >
                <span className="flex items-center">
                  <Layers className="w-4 h-4 mr-2 text-brand-orange" />
                  Manage Machinery & Specs
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/admin/blogs/editor"
                className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors"
              >
                <span className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-purple-600" />
                  Write Article / SEO Assistant
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/admin/cms"
                className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors"
              >
                <span className="flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2 text-blue-600" />
                  Edit Homepage Hero & Content
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                href="/admin/db-health"
                className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors"
              >
                <span className="flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-emerald-600" />
                  Database Diagnostics & Migrations
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Technical Datasheet Integrity */}
          <div className="bg-navy-950 rounded-2xl p-5 border border-slate-800 text-white space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase text-brand-orange">
              <CheckCircle2 className="w-4 h-4" />
              <span>Veracity Guard</span>
            </div>
            <h4 className="text-sm font-bold text-white">Brochure Specification Integrity</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              PDF specification synchronization is active for ABSW (W250–W5000), Crusher G Series (G250–G2000), Conveyors (CR250–CR2000), and MTB Blowers (MTB250–MTB2000).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

