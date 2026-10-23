'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, Clock, ArrowRight, Sparkles, BookOpen, User } from 'lucide-react';
import { BLOG_POSTS } from '@/data/blogs';
import { BlogPost } from '@/types';

export default function BlogListingPage() {
  const [posts, setPosts] = useState<BlogPost[]>(() =>
    BLOG_POSTS.filter((p) => p.status === 'published')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function loadPublished() {
      try {
        const res = await fetch('/api/blogs?publishedOnly=true');
        const data = await res.json();
        if (data.success && Array.isArray(data.blogs)) {
          setPosts(data.blogs);
        }
      } catch (err) {
        // Fallback already populated
      }
    }
    loadPublished();
  }, []);

  const categories = Array.from(new Set(posts.map((p) => p.category)));

  const filteredPosts = posts.filter((post) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      (post.tags && post.tags.some((t) => t.toLowerCase().includes(q)));

    const matchCat = selectedCategory === 'all' || post.category === selectedCategory;

    return matchSearch && matchCat;
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white pt-28 pb-14 sm:pt-32 sm:pb-18 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Industrial Engineering & Sustainability Knowledge</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Plastic Recycling Technical Guides & Insights
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Expert engineering articles, machinery maintenance benchmarks, water recycling technologies, and export market analysis from ABS Polymers Coimbatore.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Categories Bar */}
        <div className="bg-white rounded-xl p-4 sm:p-6 border border-slate-200/90 shadow-xs mb-10 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles, keywords (e.g. compact washing, EN41 blades, UAE export)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center">
              <Filter className="w-3.5 h-3.5 mr-1" />
              Category:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#04294a] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Topics ({BLOG_POSTS.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#04294a] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
            >
              <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-brand-orange text-white text-[11px] font-bold px-2.5 py-1 rounded">
                  {post.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readingTimeMinutes} min read
                    </span>
                    <span>•</span>
                    <span>{post.publishedAt}</span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-brand-orange transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500 flex items-center">
                    <User className="w-3.5 h-3.5 mr-1 text-brand-orange" />
                    <span>{post.author.name}</span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-brand-orange hover:underline inline-flex items-center"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

