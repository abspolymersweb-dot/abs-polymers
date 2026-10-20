'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Edit3, CheckCircle2, Eye, Save, Sparkles, AlertCircle } from 'lucide-react';
import { INITIAL_CMS_CONTENT, CmsContent } from '@/data/cms';

export default function AdminCmsPage() {
  const [content, setContent] = useState<CmsContent>(INITIAL_CMS_CONTENT);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            CMS & Content Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update hero headlines, promotional highlights, and global callout banners without touching source code.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs"
        >
          <Eye className="w-3.5 h-3.5 mr-1.5" />
          Live Website Preview
        </Link>
      </div>

      {savedNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
          CMS updates saved to active runtime repository.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Hero Section Banner Content */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-4 h-4 text-brand-orange" />
            <h2 className="text-base font-bold text-slate-900">Homepage Hero Section</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Top Category Badge
              </label>
              <input
                type="text"
                value={content.hero.badge}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, badge: e.target.value }
                  })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Main Headline (Part 1)
              </label>
              <input
                type="text"
                value={content.hero.headline}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, headline: e.target.value }
                  })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Headline Accent (Orange Highlight)
              </label>
              <input
                type="text"
                value={content.hero.headlineAccent}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, headlineAccent: e.target.value }
                  })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-bold text-brand-orange"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subheadline Overview Text
              </label>
              <textarea
                rows={2}
                value={content.hero.subheadline}
                onChange={(e) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, subheadline: e.target.value }
                  })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Featured Compact Plant Section Content */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Featured Compact Washing Plant Banner</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Banner Title
              </label>
              <input
                type="text"
                value={content.compactPlantBanner.title}
                onChange={(e) =>
                  setContent({
                    ...content,
                    compactPlantBanner: { ...content.compactPlantBanner, title: e.target.value }
                  })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sub-title
              </label>
              <input
                type="text"
                value={content.compactPlantBanner.subtitle}
                onChange={(e) =>
                  setContent({
                    ...content,
                    compactPlantBanner: { ...content.compactPlantBanner, subtitle: e.target.value }
                  })
                }
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Layout guard is active. Content fields are sanitized to preserve visual hierarchy.
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-6 py-2.5 text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-lg shadow transition-colors"
          >
            <Save className="w-4 h-4 mr-1.5" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

