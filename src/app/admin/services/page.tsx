'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Wrench,
  CheckCircle2,
  Eye,
  ArrowRight,
  RefreshCw,
  Plus,
  Edit,
  Save,
  Trash2,
  X,
  Search,
  AlertTriangle,
  Image as ImageIcon
} from 'lucide-react';
import { ServiceItem } from '@/types';
import ImagePickerModal from '@/components/admin/ImagePickerModal';

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Editing / Creation state
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Deletion modal state
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/services', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setServices(data.services || []);
      }
    } catch (err) {
      console.error('Failed to load services from database:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleActive = async (item: ServiceItem) => {
    const updated = { ...item, isActive: !item.isActive };
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (data.success) {
        setServices((prev) => prev.map((s) => (s.id === item.id ? updated : s)));
        showToast(`Service "${item.title}" ${updated.isActive ? 'activated' : 'deactivated'}.`);
      }
    } catch (err) {
      console.error('Failed to toggle service status:', err);
    }
  };

  const handleStartCreate = () => {
    setEditingItem({
      id: `srv-${Date.now().toString(36)}`,
      slug: '',
      title: '',
      shortDescription: '',
      fullDescription: '',
      iconName: 'Wrench',
      image: '/images/products/machines-collage.jpg',
      processSteps: [
        { step: 1, title: 'Engineering Survey', description: 'Factory layout and power calculation' },
        { step: 2, title: 'Fabrication & Trial', description: 'Machine assembly and testing in Coimbatore' }
      ],
      deliverables: ['CAD Layout Drawings', 'Havells Motor Certificates', 'On-Site Commissioning'],
      isActive: true
    });
    setIsCreating(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    if (!editingItem.title.trim()) {
      alert('Service title is required.');
      return;
    }

    let slug = editingItem.slug?.trim();
    if (!slug) {
      slug = editingItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const duplicate = services.find((s) => s.slug === slug && s.id !== editingItem.id);
    if (duplicate) {
      alert(`A service with slug "${slug}" already exists. Please choose a unique slug.`);
      return;
    }

    const payload = {
      ...editingItem,
      slug
    };

    setSaving(true);
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Service "${payload.title}" saved to database!`);
        if (isCreating) {
          setServices((prev) => [payload, ...prev]);
        } else {
          setServices((prev) => prev.map((s) => (s.id === payload.id ? payload : s)));
        }
        setEditingItem(null);
        setIsCreating(false);
      } else {
        alert(data.error || 'Failed to save service');
      }
    } catch (err: any) {
      alert(`Failed to save service: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/services?id=${itemToDelete.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setServices((prev) => prev.filter((s) => s.id !== itemToDelete.id));
        showToast(`Service "${itemToDelete.title}" deleted from database.`);
        setItemToDelete(null);
      } else {
        alert(data.error || 'Failed to delete service');
      }
    } catch (err) {
      alert('Failed to delete service.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        s.shortDescription?.toLowerCase().includes(q)
      );
    });
  }, [services, searchQuery]);

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
              Services & Turnkey Plant Solutions Management
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-navy-950 text-white rounded-full">
              Production Database
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure turnkey plant engineering scopes, installation milestones, and genuine spare parts delivery pipelines.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchServices}
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
            Add New Service
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search services by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-orange"
          />
        </div>
        <div className="text-xs font-bold text-slate-500">
          {filteredServices.length} Total Services
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500">
          <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading services from database...
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <Wrench className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="text-sm font-bold text-slate-700">No services found matching your query.</div>
          <p className="text-xs text-slate-400">Click &quot;Add New Service&quot; to configure a new industrial service.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-brand-orange uppercase bg-orange-50 px-2.5 py-1 rounded">
                    Industrial Service
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => toggleActive(service)}
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-md border transition-colors ${
                        service.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-200 text-slate-600 border-slate-300'
                      }`}
                    >
                      {service.isActive ? 'Active (Live)' : 'Draft (Hidden)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingItem(service);
                        setIsCreating(false);
                      }}
                      className="p-1 text-slate-500 hover:text-brand-orange rounded hover:bg-slate-100"
                      title="Edit service details"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemToDelete(service)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                      title="Delete service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-slate-900">{service.title}</h2>
                <div className="text-xs text-slate-500">
                  Slug: <code className="font-mono bg-slate-100 px-1 rounded">/services/{service.slug}</code>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{service.shortDescription}</p>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Process Stages ({service.processSteps?.length || 0} Steps)
                  </div>
                  {service.processSteps?.map((step: any) => (
                    <div key={step.step} className="flex items-start text-slate-600">
                      <span className="w-4 h-4 rounded-full bg-navy-950 text-white text-[10px] font-bold flex items-center justify-center mr-2 shrink-0 mt-0.5">
                        {step.step}
                      </span>
                      <span><strong>{step.title}:</strong> {step.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/services/${service.slug}`}
                  target="_blank"
                  className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-brand-orange"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  Preview Public Service Page
                </Link>
                <span className="text-[11px] text-slate-400 font-mono">
                  ID: {service.id}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Service Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl space-y-4">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {isCreating ? 'Add New Industrial Service' : `Edit Service: ${editingItem.title}`}
              </h3>
              <button onClick={() => setEditingItem(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 space-y-3 text-xs overflow-y-auto flex-1">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. Complete Plastic Recycling Plant Solutions"
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
                    placeholder="Auto-generated if blank"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Icon Style</label>
                  <select
                    value={editingItem.iconName}
                    onChange={(e) => setEditingItem({ ...editingItem, iconName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-semibold"
                  >
                    <option value="Wrench">Wrench (Engineering)</option>
                    <option value="Factory">Factory (Turnkey Plant)</option>
                    <option value="ShieldCheck">Shield (Maintenance & AMC)</option>
                    <option value="Zap">Zap (Electrical / Commissioning)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Summary</label>
                <textarea
                  rows={2}
                  value={editingItem.shortDescription || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, shortDescription: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Service Scope</label>
                <textarea
                  rows={4}
                  value={editingItem.fullDescription || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, fullDescription: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="srv-active"
                  checked={editingItem.isActive !== false}
                  onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                  className="rounded border-slate-300 text-brand-orange focus:ring-brand-orange"
                />
                <label htmlFor="srv-active" className="font-bold text-slate-800">
                  Publish to Public Services Listing & Sitemap
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
                  {saving ? 'Saving...' : 'Save Service'}
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
              <h3 className="text-base font-black text-slate-900">Confirm Service Deletion</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete <strong>{itemToDelete.title}</strong>?
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
                {deleting ? 'Deleting...' : 'Yes, Delete Service'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
