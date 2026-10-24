'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Layers,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Plus,
  Eye,
  Edit,
  Save,
  Download,
  Image as ImageIcon,
  Check,
  RefreshCw,
  X,
  Trash2,
  Search,
  Filter
} from 'lucide-react';
import ImagePickerModal from '@/components/admin/ImagePickerModal';

export default function AdminMachineriesPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Editing state
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Deletion modal state
  const [productToDelete, setProductToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const togglePublish = async (prod: any) => {
    const updated = { ...prod, published: !prod.published };
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.map((p) => (p.id === prod.id ? updated : p)));
        showToast(`Machine "${prod.name}" ${updated.published ? 'published' : 'unpublished'}.`);
      }
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
    }
  };

  const handleStartCreate = () => {
    setEditingProduct({
      id: `prod-${Date.now().toString(36)}`,
      slug: '',
      name: '',
      series: '',
      category: 'plastic-washing-plant',
      shortDescription: '',
      overview: '',
      featured: false,
      highlightBadge: '',
      heroImage: '/images/products/washing-plant-line.png',
      compatibleMaterials: ['HDPE', 'PP'],
      variants: [
        {
          modelNumber: 'W1000',
          capacityKgHr: '1000',
          motorPower: '40 HP (Havells)',
          voltage: '380V/415V 50Hz 3-Phase',
          weightKg: '2800'
        }
      ],
      published: true
    });
    setIsCreating(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    // Validate required fields
    if (!editingProduct.name.trim()) {
      alert('Machine name is required.');
      return;
    }

    // Auto-generate slug if blank
    let slug = editingProduct.slug?.trim();
    if (!slug) {
      slug = editingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    // Check duplicate slug
    const duplicate = products.find((p) => p.slug === slug && p.id !== editingProduct.id);
    if (duplicate) {
      alert(`A machine with slug "${slug}" already exists. Please choose a unique slug.`);
      return;
    }

    const payload = {
      ...editingProduct,
      slug
    };

    setSaving(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save product');
      }

      showToast(`Machine "${payload.name}" saved successfully to database!`);

      if (isCreating) {
        setProducts((prev) => [payload, ...prev]);
      } else {
        setProducts((prev) =>
          prev.map((p) => (p.id === payload.id ? payload : p))
        );
      }
      setEditingProduct(null);
      setIsCreating(false);
    } catch (err: any) {
      alert(`Error saving machine: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products?id=${productToDelete.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
        showToast(`Machine "${productToDelete.name}" deleted from database.`);
        setProductToDelete(null);
      } else {
        alert(data.error || 'Failed to delete machine');
      }
    } catch (err) {
      alert('Failed to delete machine.');
    } finally {
      setDeleting(false);
    }
  };

  // Filtered & searched products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.series?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q);

      const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, searchQuery, categoryFilter]);

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
              Machinery Catalogue Management
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-navy-950 text-white rounded-full">
              Production Database
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, edit, specify technical parameters, upload imagery, and publish recycling equipment lines.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchProducts}
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
            Add New Machine
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, series, or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-orange"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none font-semibold text-slate-700"
          >
            <option value="all">All Categories ({products.length})</option>
            <option value="plastic-washing-plant">Washing Plants</option>
            <option value="crushers-granulators">Crushers & Granulators</option>
            <option value="screw-conveyors">Screw Conveyors</option>
            <option value="transport-blowers">Transport Blowers</option>
          </select>
        </div>
      </div>

      {/* Machinery Products List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500">
          <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading products from database...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <Layers className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="text-sm font-bold text-slate-700">No machinery products match your search.</div>
          <p className="text-xs text-slate-400">Try adjusting your filters or click &quot;Add New Machine&quot; to create one.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
            >
              {/* Header banner for machine */}
              <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                    <Image
                      src={prod.heroImage || prod.hero_image || '/images/products/washing-plant-line.png'}
                      alt={prod.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-brand-orange uppercase">
                        {prod.series}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500 font-semibold capitalize">
                        {prod.category?.replace('-', ' ')}
                      </span>
                      {prod.highlightBadge && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          {prod.highlightBadge}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-black text-slate-900">{prod.name}</h2>
                    <div className="text-xs text-slate-500">
                      Slug: <code className="font-mono bg-slate-200 px-1 rounded">/machineries/{prod.slug}</code>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(prod);
                      setIsCreating(false);
                    }}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-xs transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5 mr-1.5 text-brand-orange" />
                    Edit Specs
                  </button>

                  <button
                    type="button"
                    onClick={() => togglePublish(prod)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                      prod.published
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                    }`}
                  >
                    {prod.published ? 'Published (Live)' : 'Draft (Hidden)'}
                  </button>

                  <Link
                    href={`/machineries/${prod.slug}`}
                    target="_blank"
                    className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Preview
                  </Link>

                  <button
                    type="button"
                    onClick={() => setProductToDelete(prod)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Machine"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Model Variants Breakdown */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {prod.variants?.length || 0} Registered Model Variants & Technical Benchmarks
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Havells 380V/415V 50Hz 3-Phase Standard
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-100 rounded-lg overflow-hidden min-w-[650px]">
                    <thead className="bg-slate-100 text-slate-600">
                      <tr>
                        <th className="py-2.5 px-3 font-bold">Model</th>
                        <th className="py-2.5 px-3 font-bold">Capacity (kg/h)</th>
                        <th className="py-2.5 px-3 font-bold">Motor & Electricals</th>
                        <th className="py-2.5 px-3 font-bold">Dimensions (L×W×H)</th>
                        <th className="py-2.5 px-3 font-bold">Weight</th>
                        <th className="py-2.5 px-3 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {prod.variants?.map((v: any, idx: number) => (
                        <tr key={v.modelNumber || idx} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-900">{v.modelNumber}</td>
                          <td className="py-2.5 px-3 font-semibold text-brand-orange">{v.capacityKgHr} kg/h</td>
                          <td className="py-2.5 px-3 text-slate-600">{v.motorPower || 'Havells'}</td>
                          <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                            {v.dimensionsMm ? `${v.dimensionsMm.length}×${v.dimensionsMm.width}×${v.dimensionsMm.height}mm` : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">{v.weightKg ? `${v.weightKg} kg` : '-'}</td>
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
                              Verified
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                {isCreating ? 'Add New Machine' : `Edit Machine: ${editingProduct.name}`}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Machine Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="e.g. 10 FT Compact Plastic Washing Plant"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL Slug (e.g. absw-plastic-washing-plant)</label>
                  <input
                    type="text"
                    value={editingProduct.slug || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                    placeholder="Leave blank to auto-generate from name"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-semibold"
                  >
                    <option value="plastic-washing-plant">Washing Plants</option>
                    <option value="crushers-granulators">Crushers & Granulators</option>
                    <option value="screw-conveyors">Screw Conveyors</option>
                    <option value="transport-blowers">Transport Blowers</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Series Designation</label>
                  <input
                    type="text"
                    value={editingProduct.series || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, series: e.target.value })}
                    placeholder="e.g. ABSW Series (W250–W5000)"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Highlight Badge</label>
                  <input
                    type="text"
                    value={editingProduct.highlightBadge || editingProduct.highlight_badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, highlightBadge: e.target.value, highlight_badge: e.target.value })}
                    placeholder="e.g. 10 FT Compact Footprint"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Hero Image</label>
                <div className="flex items-center space-x-3">
                  <div className="relative w-20 h-14 rounded-lg bg-slate-100 overflow-hidden border border-slate-300 shrink-0">
                    <Image
                      src={editingProduct.heroImage || editingProduct.hero_image || '/images/products/washing-plant-line.png'}
                      alt="Product preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <input
                    type="text"
                    value={editingProduct.heroImage || editingProduct.hero_image || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, heroImage: e.target.value, hero_image: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-mono text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={() => setIsImagePickerOpen(true)}
                    className="px-3 py-2 bg-brand-orange hover:bg-orange-600 text-white rounded-lg font-bold shrink-0 flex items-center"
                  >
                    <ImageIcon className="w-3.5 h-3.5 mr-1" />
                    Browse
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Description (Catalogue Card)</label>
                <textarea
                  rows={2}
                  value={editingProduct.shortDescription || editingProduct.short_description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value, short_description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Technical Overview</label>
                <textarea
                  rows={4}
                  value={editingProduct.overview || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, overview: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="prod-published"
                  checked={editingProduct.published !== false}
                  onChange={(e) => setEditingProduct({ ...editingProduct, published: e.target.checked })}
                  className="rounded border-slate-300 text-brand-orange focus:ring-brand-orange"
                />
                <label htmlFor="prod-published" className="font-bold text-slate-800">
                  Publish to Public Catalogue & Dynamic Sitemap
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-brand-orange hover:bg-orange-600 text-white rounded-lg font-bold flex items-center shadow-md disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  <span>{saving ? 'Saving...' : 'Save Machine'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">Confirm Machinery Deletion</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete <strong>{productToDelete.name}</strong> ({productToDelete.series})? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Machine'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Picker */}
      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onSelect={(imageUrl: string) => {
          if (editingProduct) {
            setEditingProduct({
              ...editingProduct,
              heroImage: imageUrl,
              hero_image: imageUrl
            });
          }
        }}
      />
    </div>
  );
}
