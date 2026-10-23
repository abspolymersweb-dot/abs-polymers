'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle2, Eye, Package, ArrowRight, RefreshCw, Edit, Save, X, Check } from 'lucide-react';
import { GranuleProduct } from '@/types';

export default function AdminGranulesPage() {
  const [granules, setGranules] = useState<GranuleProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchGranules = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/granules');
      const data = await res.json();
      if (data.success) {
        setGranules(data.granules || []);
      }
    } catch (err) {
      console.error('Failed to load granules from SQLite:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGranules();
  }, []);

  const toggleStatus = async (item: GranuleProduct) => {
    const nextStatus = (item.status === 'available' ? 'enquiry_only' : 'available') as 'available' | 'enquiry_only';
    const updated: GranuleProduct = {
      ...item,
      status: nextStatus
    };

    try {
      const res = await fetch('/api/granules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (data.success) {
        setGranules((prev) => prev.map((g) => (g.id === item.id ? updated : g)));
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setSaving(true);
    try {
      const res = await fetch('/api/granules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem)
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
        setGranules((prev) => prev.map((g) => (g.id === editingItem.id ? editingItem : g)));
        setEditingItem(null);
      }
    } catch (err) {
      console.error('Failed to save granule to SQLite:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Granules & Polymer Grade Management
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-navy-950 text-white rounded-full">
              SQLite Persistent
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage 35+ years product offerings: HDPE, LDPE, PP, ABS, HIPS, and GPPS technical grades, MFI, and inventory availability.
          </p>
        </div>

        <button
          onClick={fetchGranules}
          className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 transition-colors self-start sm:self-auto"
          title="Refresh from SQLite"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center">
          <Check className="w-4 h-4 mr-2" />
          Polymer grade details saved to SQLite database!
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500">Loading granules from SQLite...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {granules.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-white bg-[#04294a] px-2.5 py-1 rounded">
                    {prod.materialType} Polymer
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditingItem(prod)}
                      className="p-1 text-slate-500 hover:text-brand-orange rounded hover:bg-slate-100"
                      title="Edit grade parameters"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(prod)}
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border transition-colors ${
                        prod.status === 'available'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {prod.status === 'available' ? '● Available for Dispatch' : '○ Enquiry Only'}
                    </button>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-slate-900">{prod.name}</h2>
                <div className="text-xs text-slate-500">Grade: <strong>{prod.grade}</strong></div>
                <p className="text-xs text-slate-600 line-clamp-2">{prod.shortDescription}</p>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1 text-slate-600">
                  {prod.meltFlowIndex && <div><strong>MFI:</strong> {prod.meltFlowIndex}</div>}
                  <div><strong>Available Colors:</strong> {Array.isArray(prod.colorsAvailable) ? prod.colorsAvailable.join(', ') : prod.colorsAvailable}</div>
                  <div><strong>Min Order:</strong> {prod.minOrderQuantity}</div>
                  <div><strong>Packaging:</strong> {prod.packaging}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/granules/${prod.slug}`}
                  target="_blank"
                  className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-brand-orange"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  Preview Public Page
                </Link>
                <Link
                  href={`/contact?intent=quote&product=${prod.id}`}
                  className="text-xs font-bold text-brand-orange hover:underline"
                >
                  Test Inquiry Flow →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Granule Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Edit Granule Grade: {editingItem.name}</h3>
              <button onClick={() => setEditingItem(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Grade Code / Designation</label>
                <input
                  type="text"
                  value={editingItem.grade || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, grade: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Melt Flow Index (MFI)</label>
                <input
                  type="text"
                  value={editingItem.meltFlowIndex || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, meltFlowIndex: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Min Order Quantity</label>
                <input
                  type="text"
                  value={editingItem.minOrderQuantity || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, minOrderQuantity: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Packaging Specification</label>
                <input
                  type="text"
                  value={editingItem.packaging || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, packaging: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-lg"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
