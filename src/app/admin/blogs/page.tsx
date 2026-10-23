'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Plus, Eye, Edit, Clock, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { BlogPost } from '@/types';

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/blogs');
      const data = await res.json();
      if (data.success) {
        setPosts(data.blogs || []);
      }
    } catch (err) {
      console.error('Failed to load blogs from SQLite:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Blogs & Knowledge Centre Management
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-navy-950 text-white rounded-full">
              SQLite Persistent
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Author and optimize industrial technical articles with real-time SEO scoring and keyword intent analysis.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchBlogs}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 transition-colors"
            title="Refresh from SQLite"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/admin/blogs/editor"
            className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-brand-orange hover:bg-orange-600 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Write New Article
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500">Loading articles from SQLite...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Article Title</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Category</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Primary Keyword</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">SEO Readiness</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Status</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm max-w-md line-clamp-1">{post.title}</div>
                      <div className="text-[11px] text-slate-400 font-mono">/blog/{post.slug}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {post.category}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono text-[11px]">
                        {post.seo?.primaryKeyword || 'plastic recycling'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center border border-emerald-200">
                          {post.seo?.score || 90}
                        </div>
                        <span className="text-[10px] text-slate-400">/ 100</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                        {post.status || 'published'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="inline-block p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100"
                        title="Preview Live Page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/blogs/editor?slug=${post.slug}`}
                        className="inline-block p-1.5 text-slate-400 hover:text-brand-orange rounded hover:bg-slate-100"
                        title="Edit in SEO Assistant"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
