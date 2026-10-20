'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Clock, BookOpen, Sparkles } from 'lucide-react';
import { BLOG_POSTS } from '@/data/blogs';

export default function BlogPreview() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="insights" className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-brand-orange uppercase tracking-wider mb-3 px-3 py-1 bg-brand-orange/10 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Engineering Knowledge & Insights</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Recycling Technology & Plant Insights
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
              In-depth technical guides, machinery maintenance best practices, and polymer processing engineering directly from our Coimbatore technical team.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm font-bold text-navy-900 hover:text-brand-orange transition-colors group"
            >
              <span>View All Technical Articles</span>
              <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.slice(0, 3).map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : idx * 0.1 }}
              className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-7 hover:bg-white hover:border-slate-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded-md">
                    {post.category}
                  </span>
                  <span className="flex items-center text-slate-400">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {post.readingTimeMinutes} min read
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-orange transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>

                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">By {post.author.name}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center font-bold text-brand-orange hover:text-brand-orange-hover"
                >
                  <span>Read Article</span>
                  <ArrowRight className="ml-1 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
