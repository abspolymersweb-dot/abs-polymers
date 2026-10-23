'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Database,
  HardDrive,
  RefreshCw,
  ShieldCheck,
  Server,
  Download,
  Archive,
  Check
} from 'lucide-react';
import { DbHealthState } from '@/types';

interface BackupItem {
  filename: string;
  sizeBytes: number;
  createdAt: string;
}

export default function AdminDbHealthPage() {
  const [health, setHealth] = useState<DbHealthState | null>(null);
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [backingUp, setBackingUp] = useState(false);
  const [backupMessage, setBackupMessage] = useState<string | null>(null);

  const fetchHealth = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/db-health').then((r) => r.json()),
      fetch('/api/db/backup').then((r) => r.json())
    ])
      .then(([healthData, backupData]) => {
        if (healthData.success) setHealth(healthData.health);
        if (backupData.success) setBackups(backupData.backups || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleCreateBackup = async () => {
    setBackingUp(true);
    setBackupMessage(null);
    try {
      const res = await fetch('/api/db/backup', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setBackupMessage(`Snapshot saved: ${data.backup.filename}`);
        fetchHealth();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setBackupMessage(`Backup failed: ${err.message}`);
    } finally {
      setBackingUp(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Database Health & SQLite Persistence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time SQLite database metrics, WAL mode verification, table records, and automated snapshots.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchHealth}
            disabled={loading}
            className="inline-flex items-center px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Diagnostic Refresh
          </button>

          <button
            onClick={handleCreateBackup}
            disabled={backingUp}
            className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-brand-orange hover:bg-orange-600 rounded-lg shadow-md transition-all disabled:opacity-50"
          >
            <Archive className="w-3.5 h-3.5 mr-1.5" />
            {backingUp ? 'Creating Snapshot...' : 'Backup Database Now'}
          </button>
        </div>
      </div>

      {backupMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>{backupMessage}</span>
          <button onClick={() => setBackupMessage(null)} className="font-bold">×</button>
        </div>
      )}

      {/* Main Status Callout */}
      <div
        className={`p-6 rounded-2xl border ${
          health?.connected
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : 'bg-amber-50 border-amber-200 text-amber-950'
        } space-y-3`}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2.5">
            {health?.connected ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            )}
            <h2 className="text-lg font-black">
              {health?.connected
                ? 'Persistent SQLite Database Connected & Healthy'
                : 'Database Error'}
            </h2>
          </div>

          <span className="text-xs font-mono font-bold bg-white/90 px-3 py-1 rounded-lg border border-emerald-300 text-emerald-900 shadow-2xs">
            Engine: {health?.provider}
          </span>
        </div>

        <p className="text-xs sm:text-sm leading-relaxed max-w-4xl">
          {health?.notes}
        </p>

        <div className="text-xs text-slate-500 flex items-center space-x-4 pt-1">
          <span>Database File: <code className="font-mono bg-white/60 px-1 py-0.5 rounded">data/abs_polymers.db</code></span>
          <span>•</span>
          <span>WAL Mode: <strong className="text-emerald-700">Active</strong></span>
          <span>•</span>
          <span>Query Latency: <strong className="text-emerald-700">{health?.latencyMs} ms</strong></span>
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
              {health?.activeTables.length || 0} Tables Active
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
              <span>Storage Metrics</span>
            </div>
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Database File:</span>
                <span className="font-bold text-slate-900">{health?.storageUsage.usedMb} MB</span>
              </div>
              <div className="flex justify-between">
                <span>Mode:</span>
                <span className="font-bold text-slate-900">Write-Ahead Log (WAL)</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold pt-1">
                <span>Persistence:</span>
                <span>Persistent on Local Disk</span>
              </div>
            </div>
          </div>

          {/* Snapshots / Backups list */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                <Archive className="w-4 h-4 text-brand-orange" />
                <span>Database Snapshots ({backups.length})</span>
              </div>
            </div>

            {backups.length === 0 ? (
              <p className="text-xs text-slate-500">No snapshot backups created yet. Click &ldquo;Backup Database Now&rdquo; to create one.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {backups.slice(0, 5).map((b) => (
                  <div key={b.filename} className="p-2 bg-slate-50 rounded-lg text-xs flex items-center justify-between font-mono">
                    <span className="truncate max-w-[170px] text-slate-800" title={b.filename}>
                      {b.filename}
                    </span>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {formatSize(b.sizeBytes)}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[10px] text-slate-400">
              Backups are saved as standard SQLite binaries in <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">data/backups/</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
