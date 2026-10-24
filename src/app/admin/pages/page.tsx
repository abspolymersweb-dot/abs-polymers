'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FileText,
  Save,
  Eye,
  CheckCircle2,
  AlertCircle,
  Home,
  Info,
  Layers,
  Sparkles,
  Wrench,
  BookOpen,
  Phone,
  LayoutTemplate,
  Plus,
  Trash2,
  Globe,
  Upload,
  RefreshCw,
  ExternalLink,
  Sliders,
  Check,
  ShieldAlert
} from 'lucide-react';
import { GlobalCmsStore, DEFAULT_CMS_STORE } from '@/types/cms';
import ImagePickerModal from '@/components/admin/ImagePickerModal';

type PageKey = 'home' | 'about' | 'machineries' | 'granules' | 'services' | 'blog' | 'contact' | 'footer';

interface PageMeta {
  key: PageKey;
  label: string;
  route: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const PAGE_NAV: PageMeta[] = [
  { key: 'home', label: 'Home Page', route: '/', icon: Home, description: 'Hero banner, feature strip, compact plant, recycling flow' },
  { key: 'about', label: 'About Us', route: '/about', icon: Info, description: '35-year company story, Coimbatore works, UAE reach' },
  { key: 'machineries', label: 'Machineries', route: '/machineries', icon: Layers, description: 'Catalogue header, 7 solution process stages' },
  { key: 'granules', label: 'Granules', route: '/granules', icon: Sparkles, description: 'Polymer materials, filtration specs, sample order' },
  { key: 'services', label: 'Solutions & Services', route: '/services', icon: Wrench, description: 'Turnkey plants, EN41 knife spares, commissioning' },
  { key: 'blog', label: 'Insights & Blog', route: '/blog', icon: BookOpen, description: 'Technical articles, machinery maintenance guides' },
  { key: 'contact', label: 'Contact Desk', route: '/contact', icon: Phone, description: 'Factory address, direct phones, quotation desk' },
  { key: 'footer', label: 'Footer & Global Elements', route: '/', icon: LayoutTemplate, description: 'Addresses, copyright, creator attribution (dawnexus.10)' },
];

export default function AdminPagesManager() {
  const [activePage, setActivePage] = useState<PageKey>('home');
  const [store, setStore] = useState<GlobalCmsStore>(DEFAULT_CMS_STORE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Active tab within the page editor (content vs seo)
  const [editorTab, setEditorTab] = useState<'content' | 'seo' | 'images'>('content');
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<{ section: string; field: string } | null>(null);

  // Load from real persistence layer
  useEffect(() => {
    fetchCmsData();
  }, []);

  const fetchCmsData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cms', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && data.store) {
        setStore(data.store);
      }
    } catch (err) {
      console.error('Error fetching CMS store:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentPageData = store.pages[activePage] || DEFAULT_CMS_STORE.pages[activePage];
  const activeMeta = PAGE_NAV.find((p) => p.key === activePage)!;

  // Handle section field updates
  const updateSectionField = (sectionName: string, fieldName: string, value: any) => {
    setStore((prev) => {
      const updatedPages = { ...prev.pages };
      const page = { ...updatedPages[activePage] };
      page.sections = { ...page.sections };
      page.sections[sectionName] = {
        ...page.sections[sectionName],
        [fieldName]: value
      };
      updatedPages[activePage] = page;
      return { ...prev, pages: updatedPages };
    });
    setHasUnsavedChanges(true);
  };

  // Handle SEO field updates
  const updateSeoField = (fieldName: keyof typeof currentPageData.seo, value: string) => {
    setStore((prev) => {
      const updatedPages = { ...prev.pages };
      const page = { ...updatedPages[activePage] };
      page.seo = {
        ...page.seo,
        [fieldName]: value
      };
      updatedPages[activePage] = page;
      return { ...prev, pages: updatedPages };
    });
    setHasUnsavedChanges(true);
  };

  // Save to disk through API
  const handleSavePage = async () => {
    try {
      setSaving(true);
      setStatusMessage(null);

      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageKey: activePage,
          pageData: store.pages[activePage]
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save changes.');
      }

      if (data.store) {
        setStore(data.store);
      }
      setHasUnsavedChanges(false);
      setStatusMessage({ type: 'success', text: `Changes to ${activeMeta.label} saved and published successfully to database.` });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error occurred while saving.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-orange" />
        <span className="text-sm font-semibold">Loading CMS Page Workspace...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pages & Content Management</h1>
            {hasUnsavedChanges && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 animate-pulse">
                ● Unsaved Changes
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Full visual & text control over all 7 public website pages and the global footer.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={activeMeta.route}
            target="_blank"
            className="inline-flex items-center px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            Preview {activeMeta.label}
          </Link>

          <button
            onClick={handleSavePage}
            disabled={saving}
            className={`inline-flex items-center px-5 py-2 text-xs font-bold text-white rounded-lg shadow-sm transition-all ${
              hasUnsavedChanges
                ? 'bg-brand-orange hover:bg-brand-orange-hover shadow-brand-orange/20 scale-[1.02]'
                : 'bg-navy-900 hover:bg-navy-800'
            } disabled:opacity-50`}
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Publish {activeMeta.label}
              </>
            )}
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-600 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Main Dual-Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Secondary Left Page Selector Sidebar */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xs p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            Site Pages ({PAGE_NAV.length})
          </div>

          {PAGE_NAV.map((page) => {
            const Icon = page.icon;
            const isSelected = activePage === page.key;
            return (
              <button
                key={page.key}
                onClick={() => {
                  if (hasUnsavedChanges) {
                    if (confirm('You have unsaved changes. Switch pages anyway?')) {
                      setActivePage(page.key);
                      setHasUnsavedChanges(false);
                    }
                  } else {
                    setActivePage(page.key);
                  }
                }}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start space-x-3 cursor-pointer ${
                  isSelected
                    ? 'bg-navy-950 text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-navy-850 text-brand-orange' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold truncate">{page.label}</div>
                  <div className={`text-[10px] truncate ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                    {page.route}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Central Content Editor Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Sub-tab Navigation (Content vs SEO vs Media) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex items-center justify-between">
            <div className="flex space-x-1">
              {[
                { id: 'content', label: 'Page Content & Sections' },
                { id: 'seo', label: 'SEO Metadata & OpenGraph' },
                { id: 'images', label: 'Media & Imagery Assets' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setEditorTab(tab.id as any)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    editorTab === tab.id
                      ? 'bg-navy-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] font-bold text-slate-400 px-3 hidden sm:inline">
              Route: <code className="text-brand-orange">{activeMeta.route}</code>
            </span>
          </div>

          {/* TAB 1: SEO METADATA */}
          {editorTab === 'seo' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">Search Engine Optimization (SEO)</h3>
                <p className="text-xs text-slate-500">Configure page title tags, meta descriptions, and social preview images.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700">Meta Title Tag</label>
                    <span className="text-[10px] text-slate-400">{currentPageData.seo.metaTitle.length}/65 chars</span>
                  </div>
                  <input
                    type="text"
                    value={currentPageData.seo.metaTitle}
                    onChange={(e) => updateSeoField('metaTitle', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700">Meta Description</label>
                    <span className="text-[10px] text-slate-400">{currentPageData.seo.metaDescription.length}/160 chars</span>
                  </div>
                  <textarea
                    rows={3}
                    value={currentPageData.seo.metaDescription}
                    onChange={(e) => updateSeoField('metaDescription', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">OpenGraph Social Share Image URL</label>
                  <input
                    type="text"
                    value={currentPageData.seo.ogImage || ''}
                    onChange={(e) => updateSeoField('ogImage', e.target.value)}
                    placeholder="/images/hero-factory.jpg"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEDIA & IMAGERY ASSETS */}
          {editorTab === 'images' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">Media & Photography Management</h3>
                <p className="text-xs text-slate-500">Assign high-resolution industrial photography to this page.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-800">Primary Hero / Feature Visual</div>
                  <div className="relative aspect-16/9 w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-300">
                    <Image
                      src={currentPageData.sections?.hero?.heroImage || currentPageData.sections?.compactPlant?.image || '/images/hero-factory.jpg'}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-2 pt-1">
                    <label className="text-[11px] font-semibold text-slate-600 block">Asset Path</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={currentPageData.sections?.hero?.heroImage || '/images/hero-factory.jpg'}
                        onChange={(e) => {
                          if (currentPageData.sections?.hero) {
                            updateSectionField('hero', 'heroImage', e.target.value);
                          }
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPickerTarget({ section: 'hero', field: 'heroImage' });
                          setIsImagePickerOpen(true);
                        }}
                        className="px-3 py-1.5 bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs rounded shadow-xs shrink-0"
                      >
                        Browse Media
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-800">Approved Project Assets Library</div>
                  <div className="space-y-2 text-xs">
                    {[
                      { path: '/images/hero-factory.jpg', name: 'Factory Interior (Cinematic Dark)' },
                      { path: '/images/products/washing-plant-line.png', name: '10 FT Washing Plant (Clean White BG)' },
                      { path: '/images/products/crusher-granulator.jpg', name: 'G Series Crusher (White BG)' },
                      { path: '/images/products/machines-collage.jpg', name: 'Machines & Spares Collage' },
                      { path: '/images/logo.png', name: 'Official ABS Polymers Logo' }
                    ].map((asset) => (
                      <div key={asset.path} className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                        <span className="font-semibold text-slate-800 truncate mr-2">{asset.name}</span>
                        <code className="text-[10px] text-slate-500 shrink-0">{asset.path}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTENT SECTIONS (PER ACTIVE PAGE) */}
          {editorTab === 'content' && (
            <div className="space-y-6">
              {/* HOME PAGE EDITOR */}
              {activePage === 'home' && (
                <>
                  {/* Hero Section */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                    <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                      Cinematic Hero Section
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Headline (Part 1)</label>
                        <input
                          type="text"
                          value={currentPageData.sections.hero.headline}
                          onChange={(e) => updateSectionField('hero', 'headline', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Headline Accent (Orange Highlight)</label>
                        <input
                          type="text"
                          value={currentPageData.sections.hero.headlineAccent}
                          onChange={(e) => updateSectionField('hero', 'headlineAccent', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-bold text-brand-orange"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Supporting Narrative</label>
                        <textarea
                          rows={2}
                          value={currentPageData.sections.hero.subheadline}
                          onChange={(e) => updateSectionField('hero', 'subheadline', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Primary CTA Button</label>
                        <input
                          type="text"
                          value={currentPageData.sections.hero.primaryCtaText}
                          onChange={(e) => updateSectionField('hero', 'primaryCtaText', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Primary CTA URL</label>
                        <input
                          type="text"
                          value={currentPageData.sections.hero.primaryCtaLink}
                          onChange={(e) => updateSectionField('hero', 'primaryCtaLink', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Compact Plant Feature */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                    <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                      10 FT Compact Washing Plant Spotlight
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Spotlight Title</label>
                        <input
                          type="text"
                          value={currentPageData.sections.compactPlant.title}
                          onChange={(e) => updateSectionField('compactPlant', 'title', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Highlight Accent</label>
                        <input
                          type="text"
                          value={currentPageData.sections.compactPlant.titleAccent}
                          onChange={(e) => updateSectionField('compactPlant', 'titleAccent', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-bold text-brand-orange"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description</label>
                        <textarea
                          rows={3}
                          value={currentPageData.sections.compactPlant.description}
                          onChange={(e) => updateSectionField('compactPlant', 'description', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ABOUT US PAGE EDITOR */}
              {activePage === 'about' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">Company Background & Pillars</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Page Hero Headline</label>
                      <input
                        type="text"
                        value={currentPageData.sections.hero.title}
                        onChange={(e) => updateSectionField('hero', 'title', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Full Company Narrative</label>
                      <textarea
                        rows={4}
                        value={currentPageData.sections.story.content}
                        onChange={(e) => updateSectionField('story', 'content', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Granules Heritage Track Record</label>
                        <input
                          type="text"
                          value={currentPageData.sections.pillars.granulesYears}
                          onChange={(e) => updateSectionField('pillars', 'granulesYears', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Machinery Fabrication Experience</label>
                        <input
                          type="text"
                          value={currentPageData.sections.pillars.machineryYears}
                          onChange={(e) => updateSectionField('pillars', 'machineryYears', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MACHINERIES PAGE EDITOR */}
              {activePage === 'machineries' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">Catalogue Header & Solution Stages</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Catalogue Main Title</label>
                      <input
                        type="text"
                        value={currentPageData.sections.hero.title}
                        onChange={(e) => updateSectionField('hero', 'title', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Catalogue Subtitle</label>
                      <textarea
                        rows={2}
                        value={currentPageData.sections.hero.subtitle}
                        onChange={(e) => updateSectionField('hero', 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* GRANULES PAGE EDITOR */}
              {activePage === 'granules' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">Granules Overview & Supply Standards</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Page Title</label>
                      <input
                        type="text"
                        value={currentPageData.sections.hero.title}
                        onChange={(e) => updateSectionField('hero', 'title', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Filtration Standard</label>
                        <input
                          type="text"
                          value={currentPageData.sections.supplyStandards.filtration}
                          onChange={(e) => updateSectionField('supplyStandards', 'filtration', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Minimum Order Quantity (Sample)</label>
                        <input
                          type="text"
                          value={currentPageData.sections.supplyStandards.moq}
                          onChange={(e) => updateSectionField('supplyStandards', 'moq', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTACT PAGE EDITOR */}
              {activePage === 'contact' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">Factory Contact Coordinates</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Factory Address</label>
                      <input
                        type="text"
                        value={currentPageData.sections.contactDetails.address}
                        onChange={(e) => updateSectionField('contactDetails', 'address', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Direct Sales Phone</label>
                      <input
                        type="text"
                        value={currentPageData.sections.contactDetails.phone}
                        onChange={(e) => updateSectionField('contactDetails', 'phone', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Fast-Track Number</label>
                      <input
                        type="text"
                        value={currentPageData.sections.contactDetails.whatsapp}
                        onChange={(e) => updateSectionField('contactDetails', 'whatsapp', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Commercial Sales Email</label>
                      <input
                        type="email"
                        value={currentPageData.sections.contactDetails.salesEmail}
                        onChange={(e) => updateSectionField('contactDetails', 'salesEmail', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* FOOTER & GLOBAL ELEMENTS EDITOR */}
              {activePage === 'footer' && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Global Footer & Creator Attribution
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Footer Corporate Summary</label>
                      <textarea
                        rows={3}
                        value={currentPageData.sections.companySummary}
                        onChange={(e) => updateSectionField('sections', 'companySummary', e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Copyright Line</label>
                        <input
                          type="text"
                          value={currentPageData.sections.copyrightText}
                          onChange={(e) => updateSectionField('sections', 'copyrightText', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Creator Attribution Text</label>
                        <input
                          type="text"
                          value={currentPageData.sections.creatorText}
                          onChange={(e) => updateSectionField('sections', 'creatorText', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-bold text-brand-orange"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Creator Official URL</label>
                        <input
                          type="url"
                          value={currentPageData.sections.creatorUrl}
                          onChange={(e) => updateSectionField('sections', 'creatorUrl', e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Picker Modal for Pages */}
      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onSelect={(url) => {
          if (pickerTarget) {
            updateSectionField(pickerTarget.section, pickerTarget.field, url);
          }
        }}
      />
    </div>
  );
}
