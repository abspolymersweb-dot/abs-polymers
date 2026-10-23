'use client';

import React, { useState, useEffect } from 'react';
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
  X
} from 'lucide-react';
import ImagePickerModal from '@/components/admin/ImagePickerModal';

export default function AdminMachineriesPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
      }
    } catch (err) {
      console.error('Failed to toggle publish status:', err);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save product');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);

      // Update state
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
      );
      setEditingProduct(null);
    } catch (err: any) {
      alert(`Error saving to SQLite: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Machinery & Specification Management
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-navy-950 text-white rounded-full">
              SQLite Persistent
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain verified technical parameters, model variants, electrical ratings, and replace machinery hero images.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchProducts}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 transition-colors"
            title="Refresh from database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <a
            href="/docs/abs-polymers-machinery-specifications.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-brand-orange" />
            PDF Source Master
          </a>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center">
          <Check className="w-4 h-4 mr-2" />
          Product specifications and images saved successfully to SQLite database!
        </div>
      )}

      {/* Machinery Products List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500">
          <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading products from SQLite database...
        </div>
      ) : (
        <div className="space-y-6">
          {products.map((prod) => (
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
                    onClick={() => setEditingProduct(prod)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-xs transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5 mr-1.5 text-brand-orange" />
                    Edit Specs & Image
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
                    Live Preview
                  </Link>
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
                          <td className="py-2.5 px-3 font-semibold text-[#04294a]">{v.capacityKgHr} kg/h</td>
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

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">
                Edit Product: {editingProduct.name}
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
                  <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Series Designation</label>
                  <input
                    type="text"
                    value={editingProduct.series || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, series: e.target.value })}
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
                <label className="block font-bold text-slate-700 mb-1">Highlight Badge</label>
                <input
                  type="text"
                  value={editingProduct.highlightBadge || editingProduct.highlight_badge || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, highlightBadge: e.target.value, highlight_badge: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                  placeholder="e.g. 10 FT Compact Design"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.shortDescription || editingProduct.short_description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value, short_description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Technical Overview</label>
                <textarea
                  rows={4}
                  value={editingProduct.overview || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, overview: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-lg shadow-md flex items-center disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-1.5" />
                  {saving ? 'Saving to SQLite...' : 'Save to SQLite Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Picker Modal */}
      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        currentValue={editingProduct?.heroImage || editingProduct?.hero_image}
        categoryFilter="machinery"
        onSelect={(newUrl) => {
          if (editingProduct) {
            setEditingProduct({
              ...editingProduct,
              heroImage: newUrl,
              hero_image: newUrl
            });
          }
        }}
      />
    </div>
  );
}
