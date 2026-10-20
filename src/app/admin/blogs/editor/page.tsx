'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowLeft,
  Eye,
  Bot,
  Lightbulb,
  Cpu
} from 'lucide-react';
import { BLOG_POSTS } from '@/data/blogs';

function BlogEditorContent() {
  const searchParams = useSearchParams();
  const slugParam = searchParams.get('slug');
  const router = useRouter();

  const existingPost = BLOG_POSTS.find((p) => p.slug === slugParam);

  const [title, setTitle] = useState(existingPost?.title || 'High-Throughput Plastic Washing Plant Selection Guide for Recyclers');
  const [slug, setSlug] = useState(existingPost?.slug || 'high-throughput-plastic-washing-plant-selection-guide');
  const [excerpt, setExcerpt] = useState(existingPost?.excerpt || 'A comprehensive guide on evaluating washing tank capacity, water recycling circuits, and heating requirements.');
  const [content, setContent] = useState(existingPost?.content || `
# High-Throughput Plastic Washing Plant Selection Guide for Recyclers

When designing or upgrading a plastic recycling facility, selecting the right washing machinery is crucial to ensuring high flake purity, minimal water consumption, and low power usage.

## 1. Footprint and Layout Considerations

Traditional washing lines often require 30 feet of floor space. Compact 10 FT washing machines from ABS Polymers allow recyclers to operate high-capacity washing in standard workshop layouts.

## 2. Closed-Loop Water Recycling

Recycling water through continuous filtration reduces freshwater demand, limits effluent discharge, and lowers caustic soda operating costs.

## 3. High Temperature Friction Washing

Operating at 60°C to 80°C hot washing removes labels, mud, grease, and bacteria, preparing flakes for clean extrusion into premium granules.
  `.trim());

  const [category, setCategory] = useState(existingPost?.category || 'Plastic Washing Technology');
  const [authorName, setAuthorName] = useState(existingPost?.author.name || 'ABS Engineering Team');
  const [status, setStatus] = useState(existingPost?.status || 'published');

  // SEO Fields
  const [primaryKeyword, setPrimaryKeyword] = useState(existingPost?.seo.primaryKeyword || 'plastic washing plant');
  const [secondaryKeywords, setSecondaryKeywords] = useState(existingPost?.seo.secondaryKeywords.join(', ') || 'compact washing machine, water recycling, plastic recycling Coimbatore');
  const [metaTitle, setMetaTitle] = useState(existingPost?.seo.metaTitle || 'Plastic Washing Plant Selection Guide | ABS Polymers');
  const [metaDescription, setMetaDescription] = useState(existingPost?.seo.metaDescription || 'Evaluate plastic washing machine footprint, closed-loop water recirculation, and heating elements. Expert guide from ABS Polymers Coimbatore.');
  const [searchIntent, setSearchIntent] = useState<'informational' | 'commercial' | 'transactional'>(existingPost?.seo.searchIntent || 'commercial');
  const [targetLocation, setTargetLocation] = useState(existingPost?.seo.targetLocation || 'India & UAE');

  const [saveAlert, setSaveAlert] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  // Real-time SEO Analysis Engine
  const seoAnalysis = useMemo(() => {
    const checks: { label: string; passed: boolean; tip: string }[] = [];
    let score = 0;

    const kw = primaryKeyword.toLowerCase().trim();
    const titleLower = title.toLowerCase();
    const metaTitleLower = metaTitle.toLowerCase();
    const metaDescLower = metaDescription.toLowerCase();
    const contentLower = content.toLowerCase();

    // 1. Keyword in Title
    const inTitle = kw.length > 0 && titleLower.includes(kw);
    checks.push({
      label: 'Primary keyword in main article title',
      passed: inTitle,
      tip: inTitle ? 'Excellent keyword placement in title.' : `Include "${primaryKeyword}" in the article title.`
    });
    if (inTitle) score += 20;

    // 2. Keyword in Meta Description
    const inMetaDesc = kw.length > 0 && metaDescLower.includes(kw);
    checks.push({
      label: 'Primary keyword in meta description',
      passed: inMetaDesc,
      tip: inMetaDesc ? 'Meta description contains primary keyword.' : `Add "${primaryKeyword}" naturally in the meta description.`
    });
    if (inMetaDesc) score += 15;

    // 3. Meta Description Length (120-160 characters)
    const metaLen = metaDescription.length;
    const metaLenOk = metaLen >= 110 && metaLen <= 165;
    checks.push({
      label: `Meta description length (${metaLen} chars)`,
      passed: metaLenOk,
      tip: metaLenOk ? 'Optimal length for search snippets.' : 'Target 120 to 160 characters for best Google display.'
    });
    if (metaLenOk) score += 15;

    // 4. Keyword in Content Body
    const inBody = kw.length > 0 && contentLower.includes(kw);
    checks.push({
      label: 'Primary keyword present in article body',
      passed: inBody,
      tip: inBody ? 'Keyword integrated into body copy.' : `Mention "${primaryKeyword}" in the opening sections.`
    });
    if (inBody) score += 20;

    // 5. Heading Structure (H2 Headings)
    const hasH2 = content.includes('## ');
    checks.push({
      label: 'Structured subheadings (H2)',
      passed: hasH2,
      tip: hasH2 ? 'Content properly segmented with subheadings.' : 'Use ## headings to organize major sections.'
    });
    if (hasH2) score += 15;

    // 6. Word count
    const words = content.trim().split(/\s+/).length;
    const wordCountOk = words >= 150;
    checks.push({
      label: `Article depth (${words} words)`,
      passed: wordCountOk,
      tip: wordCountOk ? 'Substantive article depth.' : 'Aim for at least 150-300 technical words.'
    });
    if (wordCountOk) score += 15;

    return { score, checks, wordCount: words };
  }, [title, metaTitle, metaDescription, content, primaryKeyword]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/blogs"
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              SEO Writing Assistant & Blog Editor
            </h1>
            <p className="text-xs text-slate-500">
              Live industrial keyword validation, readability score, and structured data preparation.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setAiAssistantOpen(true)}
            className="inline-flex items-center px-3.5 py-2 text-xs font-bold text-[#04294a] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
          >
            <Bot className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            AI Content Assist
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-lg shadow transition-colors"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            Save & Publish
          </button>
        </div>
      </div>

      {saveAlert && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
          Article and SEO metadata saved successfully.
        </div>
      )}

      {/* Editor & SEO Side-by-Side */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Article Content Editor */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Article Title (H1) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 text-base font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  URL Slug
                </label>
                <div className="flex items-center">
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-2 border border-r-0 border-slate-300 rounded-l-lg font-mono">
                    /blog/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-r-lg font-mono focus:ring-2 focus:ring-brand-orange focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-semibold"
                >
                  <option value="Plastic Washing Technology">Plastic Washing Technology</option>
                  <option value="Machinery Guides">Machinery Guides</option>
                  <option value="Industrial Engineering">Industrial Engineering</option>
                  <option value="Granules & Materials">Granules & Materials</option>
                  <option value="Sustainability">Sustainability</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Excerpt (Summary)
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Main Content (Markdown format with ## Headings, - Lists)
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {seoAnalysis.wordCount} words
                </span>
              </div>
              <textarea
                rows={14}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 font-mono text-xs leading-relaxed bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right: Real-Time SEO Assistant Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Readiness Score Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                SEO Readiness Score
              </span>
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl font-black text-emerald-600">
                  {seoAnalysis.score}
                </span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5">
              {seoAnalysis.checks.map((chk, idx) => (
                <div key={idx} className="flex items-start text-xs">
                  {chk.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500 mr-2 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className={chk.passed ? 'font-semibold text-slate-800' : 'font-semibold text-amber-900'}>
                      {chk.label}
                    </div>
                    <div className="text-[10px] text-slate-500">{chk.tip}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords & Intent Configuration */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
              Target Keyword & Search Intent
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Keyword *
              </label>
              <input
                type="text"
                value={primaryKeyword}
                onChange={(e) => setPrimaryKeyword(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Secondary Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={secondaryKeywords}
                onChange={(e) => setSecondaryKeywords(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Search Intent
                </label>
                <select
                  value={searchIntent}
                  onChange={(e) => setSearchIntent(e.target.value as any)}
                  className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-medium"
                >
                  <option value="commercial">Commercial</option>
                  <option value="informational">Informational</option>
                  <option value="transactional">Transactional</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Market
                </label>
                <input
                  type="text"
                  value={targetLocation}
                  onChange={(e) => setTargetLocation(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Meta Description ({metaDescription.length} chars)
              </label>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg leading-snug"
              />
            </div>
          </div>
        </div>
      </form>

      {/* AI Assistant Modal (Provider-Independent Interface) */}
      {aiAssistantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">AI Writing Assistant Integration</h3>
              </div>
              <button
                onClick={() => setAiAssistantOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 space-y-2">
              <div className="font-bold flex items-center">
                <Cpu className="w-4 h-4 mr-1.5 text-blue-600" />
                Provider Interface Ready
              </div>
              <p>
                The AI writing assistance layer is prepared to connect with any LLM provider (OpenAI, Gemini, Anthropic, or local MCP server). To activate live generation, configure <code className="bg-blue-100 px-1 rounded font-mono">MCP_SERVER_URL</code> or AI credentials in settings.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase">Suggested Topic Outlines:</div>
              <div className="p-2.5 bg-slate-50 rounded border text-xs text-slate-700">
                1. <strong>Water recycling dynamics:</strong> Quantifying soap and caustic soda reduction in compact tanks.
              </div>
              <div className="p-2.5 bg-slate-50 rounded border text-xs text-slate-700">
                2. <strong>UAE climate adaptability:</strong> Running Havells 3-phase motors in high ambient desert temperatures.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setAiAssistantOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BlogEditorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Blog Editor...</div>}>
      <BlogEditorContent />
    </Suspense>
  );
}

