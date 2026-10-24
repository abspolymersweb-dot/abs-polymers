'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Globe,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  ShieldAlert,
  Search,
  Filter
} from 'lucide-react';
import { Destination } from '@/types';

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Edit / Create Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<Partial<Destination> | null>(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/destinations', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setDestinations(data.destinations || []);
      }
    } catch (err) {
      console.error('Failed to load destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const showNotice = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingDest({
      id: `dest-${Date.now().toString(36)}`,
      slug: '',
      countryName: '',
      region: 'East Africa',
      status: 'target',
      flagCode: '🌐',
      heroImage: '/images/products/machines-collage.jpg',
      displayOrder: destinations.length + 1,
      published: true,
      introTitle: '',
      introContent: '',
      keyApplications: ['Rigid scrap size reduction', 'Continuous washing line installation'],
      recommendedMachinery: [
        { name: 'ABSW Compact Plastic Washing Plant', slug: 'absw-plastic-washing-plant', role: 'Compact washing line' },
        { name: 'G-Series Heavy-Duty Plastic Crusher', slug: 'g-series-plastic-crusher-machine', role: 'Granulation' }
      ],
      targetMaterials: ['HDPE Flakes', 'PP Polypropylene'],
      ctaText: 'Request Destination Quotation',
      ctaLink: '/contact?intent=quote',
      metaTitle: '',
      metaDescription: '',
      imageAlt: ''
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (dest: Destination) => {
    setEditingDest({ ...dest });
    setModalOpen(true);
  };

  const handleTogglePublish = async (dest: Destination) => {
    try {
      const updated = { ...dest, published: !dest.published };
      const res = await fetch('/api/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (data.success) {
        setDestinations((prev) => prev.map((d) => (d.id === dest.id ? updated : d)));
        showNotice(`${dest.countryName} is now ${updated.published ? 'Published' : 'Draft / Unpublished'}.`);
      }
    } catch (err) {
      showNotice('Failed to update publication status', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete destination "${name}"?`)) return;
    try {
      const res = await fetch(`/api/destinations?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setDestinations((prev) => prev.filter((d) => d.id !== id));
        showNotice(`Deleted destination "${name}".`);
      }
    } catch (err) {
      showNotice('Failed to delete destination', 'error');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDest || !editingDest.countryName?.trim()) {
      alert('Country name is required.');
      return;
    }

    try {
      setSaving(true);
      const payload: Partial<Destination> & { id: string; countryName: string; slug: string } = {
        ...editingDest,
        id: editingDest.id || `dest-${Date.now().toString(36)}`,
        countryName: editingDest.countryName.trim(),
        slug:
          editingDest.slug?.trim() ||
          editingDest.countryName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, ''),
        metaTitle:
          editingDest.metaTitle?.trim() ||
          `Plastic Recycling Machinery ${editingDest.countryName} | ABS Polymers`,
        metaDescription:
          editingDest.metaDescription?.trim() ||
          `Industrial plastic recycling plants, crushers, and washing systems exported from Coimbatore to ${editingDest.countryName}.`
      };

      const res = await fetch('/api/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showNotice(`Saved destination "${payload.countryName}" to SQLite.`);
        setModalOpen(false);
        fetchDestinations();
      } else {
        alert(data.error || 'Failed to save');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving destination to SQLite');
    } finally {
      setSaving(false);
    }
  };

  const filtered = destinations.filter((d) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      d.countryName.toLowerCase().includes(q) ||
      d.region.toLowerCase().includes(q) ||
      d.slug.toLowerCase().includes(q);

    const matchRegion = regionFilter === 'all' || d.region === regionFilter;
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;

    return matchSearch && matchRegion && matchStatus;
  });

  const regions = Array.from(new Set(destinations.map((d) => d.region)));

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-bold flex items-center space-x-2 ${
            notification.type === 'success'
              ? 'bg-emerald-950 text-emerald-200 border-emerald-800'
              : 'bg-red-950 text-red-200 border-red-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification.text}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Global Destinations & Export Markets
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-navy-950 text-white rounded-full">
              SQLite Persistent
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage target international markets, country landing pages, machinery recommendations, and export SEO.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchDestinations}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 transition-colors"
            title="Refresh from SQLite"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-brand-orange hover:bg-orange-600 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Destination
          </button>
        </div>
      </div>

      {/* Factual Integrity Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start space-x-3">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Editorial Guideline:</span> Target markets (Kenya, Nigeria, Mexico, Tanzania, Angola, Zambia, Mozambique) must be presented honestly as target export markets or prospective regions. Never publish fabricated customer installations, distributors, or certifications until officially verified by management.
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by country, slug, region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-orange"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none"
          >
            <option value="all">All Regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="established">Established Market</option>
            <option value="target">Target Export Market</option>
          </select>
        </div>
      </div>

      {/* Destinations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading destinations from SQLite...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Order</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Country & Flag</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Region</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Market Type</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Public Slug</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Status</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No destinations found matching filter.
                    </td>
                  </tr>
                ) : (
                  filtered.map((dest) => (
                    <tr key={dest.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-500">
                        #{dest.displayOrder}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2.5">
                          <span className="text-xl leading-none">{dest.flagCode || '🌐'}</span>
                          <div>
                            <div className="font-bold text-slate-900">{dest.countryName}</div>
                            <div className="text-[11px] text-slate-400 line-clamp-1">{dest.introTitle}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {dest.region}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            dest.status === 'established'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {dest.status === 'established' ? 'Established' : 'Target Market'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        /destinations/{dest.slug}
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(dest)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                            dest.published
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200'
                          }`}
                          title="Click to toggle published / draft state"
                        >
                          {dest.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {dest.published && (
                            <Link
                              href={`/destinations/${dest.slug}`}
                              target="_blank"
                              className="p-1.5 text-slate-500 hover:text-brand-orange hover:bg-slate-100 rounded-md"
                              title="View Public Page"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          )}
                          <button
                            onClick={() => handleOpenEdit(dest)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
                            title="Edit Destination"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(dest.id, dest.countryName)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit / Add Modal */}
      {modalOpen && editingDest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  {editingDest.countryName ? `Edit ${editingDest.countryName}` : 'Add New Destination'}
                </h2>
                <p className="text-xs text-slate-500">
                  Configure country details, target recycling solutions, and SEO metadata.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 text-xs">
              {/* Row 1: Country, Flag, Region, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Country Name *</label>
                  <input
                    type="text"
                    required
                    value={editingDest.countryName || ''}
                    onChange={(e) => setEditingDest({ ...editingDest, countryName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-orange"
                    placeholder="e.g. Kenya"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Flag Emoji / Code</label>
                  <input
                    type="text"
                    value={editingDest.flagCode || ''}
                    onChange={(e) => setEditingDest({ ...editingDest, flagCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-orange"
                    placeholder="e.g. 🇰🇪"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Region</label>
                  <select
                    value={editingDest.region || 'East Africa'}
                    onChange={(e) => setEditingDest({ ...editingDest, region: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="Middle East">Middle East</option>
                    <option value="East Africa">East Africa</option>
                    <option value="West Africa">West Africa</option>
                    <option value="Southern Africa">Southern Africa</option>
                    <option value="Latin America">Latin America</option>
                    <option value="South Asia">South Asia</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Slug, Market Type, Display Order, Published */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">URL Slug</label>
                  <div className="flex items-center">
                    <span className="bg-slate-100 text-slate-500 px-2 py-2 border border-r-0 border-slate-300 rounded-l-lg text-[11px]">
                      /destinations/
                    </span>
                    <input
                      type="text"
                      value={editingDest.slug || ''}
                      onChange={(e) => setEditingDest({ ...editingDest, slug: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-r-lg focus:outline-none focus:ring-1 focus:ring-brand-orange"
                      placeholder="kenya"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Market Status</label>
                  <select
                    value={editingDest.status || 'target'}
                    onChange={(e) => setEditingDest({ ...editingDest, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="target">Target Export Market</option>
                    <option value="established">Established Market</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingDest.displayOrder ?? 1}
                    onChange={(e) => setEditingDest({ ...editingDest, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              {/* Headline & Overview Content */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Introductory Headline</label>
                <input
                  type="text"
                  value={editingDest.introTitle || ''}
                  onChange={(e) => setEditingDest({ ...editingDest, introTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-orange"
                  placeholder="e.g. Machinery for Kenya’s Circular Plastics & Waste Recovery Sector"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Country Introduction Content</label>
                <textarea
                  rows={4}
                  value={editingDest.introContent || ''}
                  onChange={(e) => setEditingDest({ ...editingDest, introContent: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-orange"
                  placeholder="Explain the recycling dynamics and machinery suitability for this market..."
                />
              </div>

              {/* Image & Alt */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hero Image Path</label>
                  <input
                    type="text"
                    value={editingDest.heroImage || ''}
                    onChange={(e) => setEditingDest({ ...editingDest, heroImage: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Image Alt Text</label>
                  <input
                    type="text"
                    value={editingDest.imageAlt || ''}
                    onChange={(e) => setEditingDest({ ...editingDest, imageAlt: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              {/* SEO Title & Meta Description */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  SEO & Search Engine Optimization
                </span>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={editingDest.metaTitle || ''}
                    onChange={(e) => setEditingDest({ ...editingDest, metaTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none"
                    placeholder="Plastic Recycling Machinery Kenya | ABS Polymers"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Meta Description</label>
                  <textarea
                    rows={2}
                    value={editingDest.metaDescription || ''}
                    onChange={(e) => setEditingDest({ ...editingDest, metaDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none"
                    placeholder="Direct factory export quotation for plastic crushers and washing plants in Kenya..."
                  />
                </div>
              </div>

              {/* Publication Status & Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingDest.published !== false}
                    onChange={(e) => setEditingDest({ ...editingDest, published: e.target.checked })}
                    className="w-4 h-4 text-brand-orange rounded focus:ring-brand-orange"
                  />
                  <span className="font-bold text-slate-700">Publish immediately to public website</span>
                </label>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 bg-brand-orange hover:bg-orange-600 text-white rounded-lg font-bold shadow-sm disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save to SQLite'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

