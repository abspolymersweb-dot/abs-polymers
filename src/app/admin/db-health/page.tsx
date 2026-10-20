'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Database,
  HardDrive,
  RefreshCw,
  ShieldAlert,
  Server,
  FileText
} from 'lucide-react';
import { DbHealthState } from '@/types';

export default function AdminDbHealthPage() {
  const [health, setHealth] = useState<DbHealthState | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = () => {
    setLoading(true);
    fetch('/api/db-health')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setHealth(data.health);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Database Health & Migration Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time connection verification, storage quotas, table counts, and environment readiness.
          </p>
        </div>

        <button
          onClick={fetchHealth}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Run Health Check
        </button>
      </div>

      {/* Main Status Callout */}
      <div
        className={`p-6 rounded-2xl border ${
          health?.connected
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : 'bg-amber-50 border-amber-200 text-amber-950'
        } space-y-3`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            {health?.connected ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            )}
            <h2 className="text-lg font-black">
              {health?.connected
                ? 'Production Database Connected & Healthy'
                : 'Running in Local Development / In-Memory Mode (Mock Mode)'}
            </h2>
          </div>

          <span className="text-xs font-mono font-bold bg-white/80 px-2.5 py-1 rounded border border-amber-300">
            Provider: {health?.provider}
          </span>
        </div>

        <p className="text-xs sm:text-sm leading-relaxed max-w-4xl">
          {health?.notes}
        </p>

        <div className="text-xs text-slate-500 flex items-center space-x-4 pt-1">
          <span>Last Diagnostic Check: {health?.lastChecked ? new Date(health.lastChecked).toLocaleString() : 'Just now'}</span>
          <span>•</span>
          <span>Latency: {health?.latencyMs} ms</span>
        </div>
      </div>

      {/* Database Tables and Active Schemas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-brand-orange" />
              <h3 className="text-base font-bold text-slate-900">Application Tables & Registered Entities</h3>
            </div>
            <span className="text-xs font-bold text-slate-400">
              {health?.activeTables.length || 0} Models Registered
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="py-2.5 px-3 font-bold">Schema Table Name</th>
                  <th className="py-2.5 px-3 font-bold">Active Records</th>
                  <th className="py-2.5 px-3 font-bold">Storage Provider Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {health?.activeTables.map((tbl) => (
                  <tr key={tbl.name} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{tbl.name}</td>
                    <td className="py-2.5 px-3 text-[#04294a] font-bold">{tbl.recordCount}</td>
                    <td className="py-2.5 px-3 text-slate-600 font-sans text-xs">{tbl.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Media & Backup Diagnostics */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-2">
              <HardDrive className="w-4 h-4 text-blue-600" />
              <span>Media & Brochure Storage</span>
            </div>
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Allocated Quota:</span>
                <span className="font-bold text-slate-900">{health?.storageUsage.totalMb} MB</span>
              </div>
              <div className="flex justify-between">
                <span>Used by PDF & Images:</span>
                <span className="font-bold text-slate-900">{health?.storageUsage.usedMb} MB</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold pt-1">
                <span>Status:</span>
                <span>{health?.storageUsage.status}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-2">
              <Server className="w-4 h-4 text-purple-600" />
              <span>Production Migration Plan</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When ready to deploy PostgreSQL or Supabase, run standard Prisma / Drizzle migrations to persist inquiries, users, and audit logs.
            </p>
            <div className="text-[11px] bg-slate-100 p-2.5 rounded font-mono text-slate-700">
              DATABASE_URL=postgresql://user:pass@host:5432/abspolymers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
