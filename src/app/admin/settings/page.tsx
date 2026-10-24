'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Key,
  Database,
  ExternalLink,
  Play,
  Terminal,
  ShieldCheck,
  RefreshCw,
  Save,
  Lock,
  Building
} from 'lucide-react';
import { McpConnectionStatus } from '@/services/mcpService';

export default function AdminSettingsPage() {
  const [mcpStatus, setMcpStatus] = useState<McpConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  // Settings from SQLite
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Test adapter state
  const [testModel, setTestModel] = useState('W1000');
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);

  const fetchSettings = () => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSettings(data.settings || {});
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchSettings();

    fetch('/api/mcp')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMcpStatus(data.mcp);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });
      const data = await res.json();
      if (data.success) {
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: 'Password must be at least 6 characters' });
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordStatus({ type: 'success', message: 'Admin password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        throw new Error(data.error || 'Failed to update password');
      }
    } catch (err: any) {
      setPasswordStatus({ type: 'error', message: err.message });
    } finally {
      setPasswordLoading(false);
    }
  };

  const runLocalAdapterTest = async () => {
    setTestLoading(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_specs',
          payload: { modelNumber: testModel }
        })
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ success: false, error: 'Test execution failed' });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          System Settings, Security & AI / MCP
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure company contact information, footer attribution, admin authentication, and AI model tools.
        </p>
      </div>

      {/* 1. Global Site & Company Settings (SQLite) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Company & Global Contact Parameters</h2>
              <p className="text-xs text-slate-500">Persistent in SQLite <code className="bg-slate-100 px-1 rounded font-mono">site_settings</code> table</p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg">
            SQLite Active
          </span>
        </div>

        {settingsSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Settings saved successfully to persistent SQLite database!
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                value={settings.company_name || 'ABS Polymers'}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Direct Sales Phone</label>
              <input
                type="text"
                value={settings.phone || '+91 9843940864'}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">WhatsApp Hotline</label>
              <input
                type="text"
                value={settings.whatsapp || '+91 9943105810'}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Sales & Quotations Email</label>
              <input
                type="email"
                value={settings.email || 'abspolymersweb@gmail.com'}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Factory Location & Address</label>
              <input
                type="text"
                value={settings.factory_address || 'Coimbatore, Tamil Nadu, India'}
                onChange={(e) => setSettings({ ...settings, factory_address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Primary Export Destinations</label>
              <input
                type="text"
                value={settings.export_destinations || 'United Arab Emirates (UAE), Oman, Saudi Arabia, GCC & Pan-India'}
                onChange={(e) => setSettings({ ...settings, export_destinations: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Footer Creator Attribution</label>
              <input
                type="text"
                value={settings.creator_attribution || 'Created by dawnexus'}
                onChange={(e) => setSettings({ ...settings, creator_attribution: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-brand-orange font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Creator URL</label>
              <input
                type="url"
                value={settings.creator_url || 'https://dawnexus.in'}
                onChange={(e) => setSettings({ ...settings, creator_url: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={savingSettings}
              className="px-5 py-2.5 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-lg shadow-md flex items-center transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {savingSettings ? 'Saving Settings...' : 'Save Site Settings to SQLite'}
            </button>
          </div>
        </form>
      </div>

      {/* 2. Admin Security & Password Change */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
            <Lock className="w-5 h-5 text-brand-orange" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Admin Security & Password</h2>
            <p className="text-xs text-slate-500">Update local administrator credentials (hashed with PBKDF2/SHA-512)</p>
          </div>
        </div>

        {passwordStatus && (
          <div
            className={`p-3 rounded-xl border text-xs font-semibold ${
              passwordStatus.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {passwordStatus.message}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3 text-xs max-w-xl">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
              placeholder="••••••••"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                placeholder="Min 6 characters"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={passwordLoading}
            className="px-4 py-2 bg-navy-950 hover:bg-slate-800 text-white font-bold rounded-lg transition-all"
          >
            {passwordLoading ? 'Updating Password...' : 'Update Admin Password'}
          </button>
        </form>
      </div>

      {/* 3. AI MCP Integration Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">AI / Local MCP Server Integration Boundary</h2>
              <p className="text-xs text-slate-500">Model Context Protocol interface for intelligent catalogue search and drafting</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                mcpStatus?.isConfigured
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              ● Local SQLite & MCP Tools Active
            </span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
          <p>{mcpStatus?.message || 'Local AI & MCP tool interfaces initialized.'}</p>
        </div>

        {/* Live Test Adapter Console */}
        <div className="p-5 bg-navy-950 text-white rounded-xl space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-orange">
            <Terminal className="w-4 h-4" />
            <span>Test MCP Adapter Execution</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter model (e.g. W1000, G500, CR750, MTB1500)..."
              value={testModel}
              onChange={(e) => setTestModel(e.target.value)}
              className="px-3 py-2 text-xs bg-navy-900 border border-slate-700 rounded-lg text-white font-mono flex-1 focus:outline-none"
            />
            <button
              type="button"
              onClick={runLocalAdapterTest}
              disabled={testLoading}
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-brand-orange hover:bg-orange-600 rounded-lg transition-colors"
            >
              <Play className="w-3.5 h-3.5 mr-1.5" />
              {testLoading ? 'Executing...' : 'Run Tool Test'}
            </button>
          </div>

          {testResult && (
            <div className="p-3 bg-navy-900 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48">
              <pre>{JSON.stringify(testResult, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
