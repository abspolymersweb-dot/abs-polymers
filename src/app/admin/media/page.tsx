'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  Search,
  Filter,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Image as ImageIcon,
  FolderOpen,
  Info,
  RefreshCw,
  Plus,
  AlertCircle
} from 'lucide-react';

interface MediaAsset {
  id: string;
  filename: string;
  original_name: string;
  url: string;
  mime_type: string;
  size_bytes: number;
  width?: number;
  height?: number;
  alt_text?: string;
  category: string;
  created_at: string;
}

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [uploadCategory, setUploadCategory] = useState('machinery');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const url = category === 'all' ? '/api/media' : `/api/media?category=${category}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setAssets(data.media || []);
      }
    } catch (err) {
      console.error('Failed to load media assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [category]);

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setNotification(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append('category', uploadCategory);

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      setNotification({
        type: 'success',
        message: `Successfully uploaded ${data.assets?.length || 1} image(s)!`
      });

      // Clear input
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Reload assets
      fetchAssets();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'File upload encountered an error.'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/media?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAssets((prev) => prev.filter((a) => a.id !== id));
        if (selectedAsset?.id === id) setSelectedAsset(null);
        setNotification({
          type: 'success',
          message: `Asset "${name}" deleted successfully.`
        });
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Failed to delete asset.'
      });
    }
  };

  const filteredAssets = assets.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.filename.toLowerCase().includes(q) ||
      a.original_name.toLowerCase().includes(q) ||
      (a.alt_text && a.alt_text.toLowerCase().includes(q))
    );
  });

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Media Library & Image Management
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-navy-950 text-white rounded-full">
              {assets.length} Assets
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Store, preview, organize, and copy persistent URLs for machinery photos, factory banners, and logos.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchAssets()}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 transition-colors"
            title="Refresh assets"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <label
            htmlFor="media-upload-input"
            className="cursor-pointer inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-brand-orange hover:bg-orange-600 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <UploadCloud className="w-4 h-4 mr-2" />
            Upload New Images
          </label>
          <input
            id="media-upload-input"
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-4 font-bold">
            ×
          </button>
        </div>
      )}

      {/* Quick Upload Panel & Category Selection */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider shrink-0">
            Upload Category:
          </span>
          <select
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          >
            <option value="machinery">Machinery & Equipment</option>
            <option value="brand">Brand & Identity (Logo)</option>
            <option value="granules">Polymer Granules</option>
            <option value="factory">Factory & Infrastructure</option>
            <option value="general">General / Content</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500 w-full md:w-auto justify-end">
          <Info className="w-4 h-4 text-brand-orange shrink-0" />
          <span>Uploaded files persist in <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">public/uploads/</code> & SQLite <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">media_assets</code></span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto pb-1">
          {['all', 'machinery', 'brand', 'granules', 'factory', 'general'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                category === cat
                  ? 'bg-navy-950 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by filename or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>
      </div>

      {/* Uploading indicator */}
      {uploading && (
        <div className="p-4 bg-brand-orange/10 border border-brand-orange/30 rounded-xl flex items-center justify-center space-x-3 text-brand-orange text-xs font-bold animate-pulse">
          <div className="w-4 h-4 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
          <span>Writing file buffer to disk & indexing in SQLite database...</span>
        </div>
      )}

      {/* Media Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Querying media_assets table in SQLite...</p>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No media assets found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {search ? 'No images match your search criteria.' : 'Upload machinery photos, brochures, or factory images using the button above.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAssets.map((asset) => {
            const isWhiteLogo = asset.filename.includes('logo');
            return (
              <div
                key={asset.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                {/* Thumbnail Container */}
                <div
                  onClick={() => setSelectedAsset(asset)}
                  className={`relative aspect-4/3 cursor-pointer overflow-hidden ${
                    isWhiteLogo ? 'bg-navy-950 p-4' : 'bg-slate-100'
                  }`}
                >
                  <Image
                    src={asset.url}
                    alt={asset.alt_text || asset.original_name}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className={`object-contain transition-transform duration-200 group-hover:scale-105 ${
                      isWhiteLogo ? 'brightness-0 invert' : ''
                    }`}
                  />
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 text-[9px] font-bold uppercase bg-black/60 text-white rounded backdrop-blur-xs">
                    {asset.category}
                  </span>
                </div>

                {/* Details */}
                <div className="p-3 border-t border-slate-100 flex flex-col justify-between flex-1">
                  <div>
                    <h4
                      className="text-xs font-bold text-slate-900 truncate"
                      title={asset.original_name}
                    >
                      {asset.original_name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                      {formatSize(asset.size_bytes)} • {asset.filename}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                    <button
                      onClick={() => handleCopyUrl(asset.url, asset.id)}
                      className={`inline-flex items-center px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                        copiedId === asset.id
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-brand-orange hover:text-white'
                      }`}
                      title="Copy URL to clipboard"
                    >
                      {copiedId === asset.id ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy URL
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(asset.id, asset.original_name)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Asset Preview Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedAsset.original_name}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedAsset.url}</p>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg p-1"
              >
                ×
              </button>
            </div>

            {/* Modal Image Display */}
            <div
              className={`relative h-72 sm:h-96 w-full ${
                selectedAsset.filename.includes('logo') ? 'bg-navy-950 p-8' : 'bg-slate-900'
              }`}
            >
              <Image
                src={selectedAsset.url}
                alt={selectedAsset.alt_text || selectedAsset.original_name}
                fill
                className={`object-contain ${
                  selectedAsset.filename.includes('logo') ? 'brightness-0 invert' : ''
                }`}
              />
            </div>

            {/* Modal Details */}
            <div className="p-5 space-y-3 bg-white text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-600">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Category</span>
                  <span className="font-semibold text-slate-800 capitalize">{selectedAsset.category}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">File Size</span>
                  <span className="font-semibold text-slate-800">{formatSize(selectedAsset.size_bytes)}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">MIME Type</span>
                  <span className="font-semibold text-slate-800">{selectedAsset.mime_type}</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Asset ID</span>
                  <span className="font-mono text-[10px] text-slate-800 truncate block">{selectedAsset.id}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Public URL (Use in CMS or Machinery Pages)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedAsset.url}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-800"
                  />
                  <button
                    onClick={() => handleCopyUrl(selectedAsset.url, selectedAsset.id)}
                    className="px-3 py-1.5 text-xs font-bold bg-brand-orange hover:bg-orange-600 text-white rounded-lg shrink-0 flex items-center"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Copy
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={selectedAsset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-brand-orange hover:underline font-bold text-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1" />
                  Open in New Tab
                </a>

                <button
                  onClick={() => setSelectedAsset(null)}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

