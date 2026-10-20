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
  RefreshCw
} from 'lucide-react';
import { McpConnectionStatus } from '@/services/mcpService';

export default function AdminSettingsPage() {
  const [mcpStatus, setMcpStatus] = useState<McpConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  // Test adapter state
  const [testModel, setTestModel] = useState('W1000');
  const [testResult, setTestResult] = useState<any>(null);
  const [testLoading, setTestLoading] = useState(false);

  useEffect(() => {
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
          System Settings & AI / MCP Integration
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure external adapters, AI model tool registry, environment credentials, and automated integrations.
        </p>
      </div>

      {/* AI MCP Integration Status Card */}
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
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {mcpStatus?.isConfigured ? '● Server Connected' : '○ Standby / Local Adapter Active'}
            </span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
          <p>{mcpStatus?.message}</p>
        </div>

        {/* Registered MCP Tools */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Approved MCP Capability Tools ({mcpStatus?.registeredTools.length || 0})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mcpStatus?.registeredTools.map((tool) => (
              <div key={tool.name} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <code className="text-xs font-bold text-[#04294a] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono">
                    {tool.name}
                  </code>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Ready
                  </span>
                </div>
                <p className="text-xs text-slate-600 pt-1">{tool.description}</p>
              </div>
            ))}
          </div>
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
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-lg transition-colors"
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

      {/* Environment Variable Blueprint */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Configured Environment Variables Specification
        </h3>
        <p className="text-xs text-slate-600">
          The following environment variables can be provided in your production <code className="bg-slate-100 px-1 rounded font-mono">.env.production</code> or server environment:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead className="bg-slate-50 text-slate-500 font-bold">
              <tr>
                <th className="py-2.5 px-3">Variable Name</th>
                <th className="py-2.5 px-3">Purpose</th>
                <th className="py-2.5 px-3">Current Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">DATABASE_URL</td>
                <td className="py-2.5 px-3 font-sans text-slate-600">PostgreSQL / Supabase connection string</td>
                <td className="py-2.5 px-3 text-amber-600 font-sans font-semibold">Unset (Mock Mode Active)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">MCP_SERVER_URL</td>
                <td className="py-2.5 px-3 font-sans text-slate-600">HTTP/WebSocket endpoint for external MCP daemon</td>
                <td className="py-2.5 px-3 text-slate-500 font-sans">Optional / Local Fallback Active</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">MCP_API_KEY</td>
                <td className="py-2.5 px-3 font-sans text-slate-600">Authorization bearer token for MCP server</td>
                <td className="py-2.5 px-3 text-slate-500 font-sans">Optional</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">NEXT_PUBLIC_GA_ID</td>
                <td className="py-2.5 px-3 font-sans text-slate-600">Google Analytics 4 measurement tag</td>
                <td className="py-2.5 px-3 text-slate-500 font-sans">Unset</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

