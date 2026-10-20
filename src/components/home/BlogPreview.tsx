import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, BookOpen } from 'lucide-react';
import { BLOG_POSTS } from '@/data/blogs';

export default function BlogPreview() {
  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
              Industry Insights
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Recycling Engineering & Knowledge
            </h2>
            <p className="mt-2 text-slate-600 max-w-2xl text-sm sm:text-base">
              Technical guides, machinery design benchmarks, and recycling industry analysis from our engineering team in Coimbatore.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm font-bold text-[#04294a] hover:text-brand-orange transition-colors"
            >
              <span>View All Articles</span>
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_POSTS.slice(0, 3).map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-500 mb-3">
                  <span className="text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded font-bold uppercase">
                    {post.category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {post.readingTimeMinutes} min read
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-orange transition-colors line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  By {post.author.name}
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-bold text-brand-orange hover:underline inline-flex items-center"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
