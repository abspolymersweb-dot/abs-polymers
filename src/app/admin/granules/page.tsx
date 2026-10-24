'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  CheckCircle2,
  Eye,
  Package,
  ArrowRight,
  RefreshCw,
  Edit,
  Save,
  X,
  Check,
  Plus,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';
import { GranuleProduct } from '@/types';
import ImagePickerModal from '@/components/admin/ImagePickerModal';

export default function AdminGranulesPage() {
  const [granules, setGranules] = useState<GranuleProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [materialFilter, setMaterialFilter] = useState('all');

  // Edit / Create state
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Delete state
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchGranules = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/granules', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setGranules(data.granules || []);
      }
    } catch (err) {
      console.error('Failed to load granules from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGranules();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
        showToast(`Status updated to "${nextStatus}".`);
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const togglePublish = async (item: GranuleProduct) => {
    const updated = { ...item, published: !item.published };
    try {
      const res = await fetch('/api/granules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (data.success) {
        setGranules((prev) => prev.map((g) => (g.id === item.id ? (updated as any) : g)));
        showToast(`Granule "${item.name}" ${updated.published ? 'published' : 'unpublished'}.`);
      }
    } catch (err) {
      console.error('Failed to toggle publish:', err);
    }
  };

  const handleStartCreate = () => {
    setEditingItem({
      id: `gran-${Date.now().toString(36)}`,
      slug: '',
      name: '',
      materialType: 'HDPE',
      grade: 'HDPE-BM-01',
      appearance: 'Uniform cylindrical granules',
      colorsAvailable: ['Natural White', 'Milky White', 'Black'],
      meltFlowIndex: '0.8 - 1.2 g/10 min',
      density: '0.955 g/cm³',
      tensileStrength: '24 MPa',
      shortDescription: '',
      overview: '',
      packaging: '25 kg PP Woven Bags with LDPE Liner',
      minOrderQuantity: '1,000 kg (1 Metric Ton)',
      status: 'available',
      image: '/images/hero-reference.jpg',
      published: true
    });
    setIsCreating(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.name.trim()) {
      alert('Granule name is required.');
      return;
    }

    let slug = editingItem.slug?.trim();
    if (!slug) {
      slug = editingItem.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    // Check duplicate slug
    const duplicate = granules.find((g) => g.slug === slug && g.id !== editingItem.id);
    if (duplicate) {
      alert(`A granule product with slug "${slug}" already exists. Please choose a unique slug.`);
      return;
    }

    const payload = {
      ...editingItem,
      slug,
      colorsAvailable: Array.isArray(editingItem.colorsAvailable)
        ? editingItem.colorsAvailable
        : String(editingItem.colorsAvailable).split(',').map((c) => c.trim()).filter(Boolean)
    };

    setSaving(true);
    try {
      const res = await fetch('/api/granules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Granule "${payload.name}" saved to database!`);
        if (isCreating) {
          setGranules((prev) => [payload, ...prev]);
        } else {
          setGranules((prev) => prev.map((g) => (g.id === payload.id ? payload : g)));
        }
        setEditingItem(null);
        setIsCreating(false);
      } else {
        alert(data.error || 'Failed to save granule');
      }
    } catch (err: any) {
      alert(`Failed to save granule: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/granules?id=${itemToDelete.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setGranules((prev) => prev.filter((g) => g.id !== itemToDelete.id));
        showToast(`Granule "${itemToDelete.name}" deleted from database.`);
        setItemToDelete(null);
      } else {
        alert(data.error || 'Failed to delete granule');
      }
    } catch (err) {
      alert('Failed to delete granule.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredGranules = useMemo(() => {
    return granules.filter((g) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.grade?.toLowerCase().includes(q) ||
        g.materialType?.toLowerCase().includes(q) ||
        g.slug?.toLowerCase().includes(q);

      const matchMat = materialFilter === 'all' || g.materialType === materialFilter;
      return matchSearch && matchMat;
    });
  }, [granules, searchQuery, materialFilter]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold border border-slate-700 shadow-2xl flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Granules & Polymer Grade Management
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-navy-950 text-white rounded-full">
              Production Database
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage 35+ years product offerings: HDPE, LDPE, PP, ABS, HIPS technical grades, MFI parameters, and inventory availability.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchGranules}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 transition-colors"
            title="Refresh database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleStartCreate}
            className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-brand-orange hover:bg-orange-600 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Granule Grade
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by grade, material, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-orange"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={materialFilter}
            onChange={(e) => setMaterialFilter(e.target.value)}
            className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none font-semibold text-slate-700"
          >
            <option value="all">All Materials ({granules.length})</option>
            <option value="HDPE">HDPE</option>
            <option value="PP">PP</option>
            <option value="LDPE">LDPE</option>
            <option value="ABS">ABS</option>
          </select>
        </div>
      </div>

      {/* Granules Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500">
          <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading granules from database...
        </div>
      ) : filteredGranules.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <Sparkles className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="text-sm font-bold text-slate-700">No granule grades match your criteria.</div>
          <p className="text-xs text-slate-400">Click &quot;Add Granule Grade&quot; to register a new polymer grade.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGranules.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-white bg-navy-950 px-2.5 py-1 rounded">
                    {prod.materialType} Polymer
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => togglePublish(prod)}
                      className={`text-xs font-bold px-2 py-0.5 rounded-md border transition-colors ${
                        prod.published !== false
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-200 text-slate-600 border-slate-300'
                      }`}
                    >
                      {prod.published !== false ? 'Published' : 'Draft'}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(prod)}
                      className={`text-xs font-bold px-2 py-0.5 rounded-md border transition-colors ${
                        prod.status === 'available'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {prod.status === 'available' ? 'Available' : 'Enquiry Only'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(prod);
                        setIsCreating(false);
                      }}
                      className="p-1 text-slate-500 hover:text-brand-orange rounded hover:bg-slate-100"
                      title="Edit grade parameters"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemToDelete(prod)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                      title="Delete grade"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-slate-900">{prod.name}</h2>
                <div className="text-xs text-slate-500">
                  Grade Code: <strong className="text-slate-800">{prod.grade}</strong> • Slug: <code className="font-mono text-[11px] bg-slate-100 px-1 rounded">/granules/{prod.slug}</code>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">{prod.shortDescription}</p>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1 text-slate-600">
                  {prod.meltFlowIndex && <div><strong>MFI:</strong> {prod.meltFlowIndex}</div>}
                  {prod.density && <div><strong>Density:</strong> {prod.density}</div>}
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
                <span className="text-[11px] text-slate-400 font-mono">
                  ID: {prod.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Granule Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl space-y-4">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {isCreating ? 'Add Granule Grade' : `Edit Grade: ${editingItem.name}`}
              </h3>
              <button onClick={() => setEditingItem(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 space-y-3 text-xs overflow-y-auto flex-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="e.g. HDPE Blow Moulding Recycled Granules"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL Slug</label>
                  <input
                    type="text"
                    value={editingItem.slug || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                    placeholder="Auto-generated if empty"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Polymer Material</label>
                  <select
                    value={editingItem.materialType}
                    onChange={(e) => setEditingItem({ ...editingItem, materialType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-semibold"
                  >
                    <option value="HDPE">HDPE</option>
                    <option value="PP">PP</option>
                    <option value="LDPE">LDPE</option>
                    <option value="ABS">ABS</option>
                    <option value="HIPS">HIPS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grade Code / Designation *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.grade || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, grade: e.target.value })}
                    placeholder="e.g. HDPE-BM-01"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Melt Flow Index (MFI)</label>
                  <input
                    type="text"
                    value={editingItem.meltFlowIndex || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, meltFlowIndex: e.target.value })}
                    placeholder="e.g. 0.8 - 1.2 g/10 min"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Density</label>
                  <input
                    type="text"
                    value={editingItem.density || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, density: e.target.value })}
                    placeholder="e.g. 0.955 g/cm³"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min Order Quantity</label>
                  <input
                    type="text"
                    value={editingItem.minOrderQuantity || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, minOrderQuantity: e.target.value })}
                    placeholder="e.g. 1,000 kg"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Available Colors (comma separated)</label>
                <input
                  type="text"
                  value={Array.isArray(editingItem.colorsAvailable) ? editingItem.colorsAvailable.join(', ') : (editingItem.colorsAvailable || '')}
                  onChange={(e) => setEditingItem({ ...editingItem, colorsAvailable: e.target.value })}
                  placeholder="e.g. Natural White, Milky White, Black, Blue"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingItem.shortDescription || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, shortDescription: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="gran-published"
                  checked={editingItem.published !== false}
                  onChange={(e) => setEditingItem({ ...editingItem, published: e.target.checked })}
                  className="rounded border-slate-300 text-brand-orange focus:ring-brand-orange"
                />
                <label htmlFor="gran-published" className="font-bold text-slate-800">
                  Publish to Public Catalogue & Sitemap
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-lg shadow-sm disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Grade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">Confirm Grade Deletion</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete <strong>{itemToDelete.name}</strong> ({itemToDelete.grade})?
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteItem}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Grade'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
