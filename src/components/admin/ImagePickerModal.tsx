'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, Check, X, Search, Image as ImageIcon } from 'lucide-react';

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentValue?: string;
  categoryFilter?: string;
}

export default function ImagePickerModal({
  isOpen,
  onClose,
  onSelect,
  currentValue,
  categoryFilter
}: ImagePickerModalProps) {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'library' | 'upload'>('library');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const url = categoryFilter ? `/api/media?category=${categoryFilter}` : '/api/media';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setAssets(data.media || []);
      }
    } catch (err) {
      console.error('Failed to load media in picker:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAssets();
    }
  }, [isOpen, categoryFilter]);

  if (!isOpen) return null;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', categoryFilter || 'general');

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.asset) {
        onSelect(data.asset.url);
        onClose();
      }
    } catch (err) {
      console.error('Picker upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const filteredAssets = assets.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.filename.toLowerCase().includes(q) ||
      a.original_name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-4">
            <h3 className="text-sm font-bold text-slate-900">Select or Upload Image</h3>
            <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setTab('library')}
                className={`px-3 py-1 rounded-md transition-all ${
                  tab === 'library' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Media Library ({assets.length})
              </button>
              <button
                onClick={() => setTab('upload')}
                className={`px-3 py-1 rounded-md transition-all ${
                  tab === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Upload File
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto">
          {tab === 'upload' ? (
            <div className="p-8 border-2 border-dashed border-slate-300 rounded-2xl text-center flex flex-col items-center justify-center space-y-3 bg-slate-50 hover:bg-slate-100 transition-colors">
              <UploadCloud className="w-12 h-12 text-brand-orange" />
              <div>
                <p className="text-sm font-bold text-slate-800">Upload new image file</p>
                <p className="text-xs text-slate-500 mt-0.5">PNG, JPG, WEBP, SVG up to 25MB</p>
              </div>
              <label className="cursor-pointer px-4 py-2 bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all">
                {uploading ? 'Writing to /uploads & database...' : 'Browse Local Files'}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter images..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-slate-500">Loading media assets...</div>
              ) : filteredAssets.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">No assets found in library.</div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {filteredAssets.map((asset) => {
                    const isSelected = currentValue === asset.url;
                    const isLogo = asset.filename.includes('logo');
                    return (
                      <div
                        key={asset.id}
                        onClick={() => {
                          onSelect(asset.url);
                          onClose();
                        }}
                        className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-brand-orange ring-2 ring-brand-orange/40'
                            : 'border-slate-200 hover:border-slate-400'
                        } ${isLogo ? 'bg-navy-950 p-2' : 'bg-slate-100'}`}
                      >
                        <Image
                          src={asset.url}
                          alt={asset.original_name}
                          fill
                          className={`object-contain transition-transform group-hover:scale-105 ${
                            isLogo ? 'brightness-0 invert' : ''
                          }`}
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-brand-orange text-white p-0.5 rounded-full shadow-xs">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate text-center">
                          {asset.original_name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Current image: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">{currentValue || 'None'}</code></span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

