import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Clock, Calendar, ChevronRight, User, ArrowLeft, Share2, ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '@/data/blogs';
import { COMPANY_INFO } from '@/data/company';

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return { title: 'Article Not Found' };
  }

  return {
    title: `${post.seo.metaTitle} | ABS Polymers`,
    description: post.seo.metaDescription,
    keywords: [post.seo.primaryKeyword, ...post.seo.secondaryKeywords],
    openGraph: {
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [{ url: post.coverImage }]
    }
  };
}

export default async function BlogPostPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center space-x-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-brand-orange">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/blog" className="hover:text-brand-orange">Blog</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold truncate">{post.title}</span>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-brand-orange/15 text-brand-orange text-xs font-bold rounded-full uppercase tracking-wider border border-brand-orange/30">
              {post.category}
            </span>
            <span className="text-xs text-slate-500 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {post.readingTimeMinutes} min read
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">Published on {post.publishedAt}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center space-x-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-[#04294a] text-white flex items-center justify-center font-bold text-sm">
              ABS
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{post.author.name}</div>
              <div className="text-xs text-slate-500">{post.author.role} • ABS Polymers Coimbatore</div>
            </div>
          </div>
        </div>

        {/* Featured Cover Graphic */}
        <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-md">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            className="object-cover object-center"
          />
        </div>

        {/* Article Body Content */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
          <div className="prose prose-slate max-w-none space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
            {post.content.split('\n\n').map((paragraph, pIdx) => {
              if (paragraph.startsWith('# ')) {
                return null; // Skip H1 duplicate
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={pIdx} className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-8 mb-3">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('---')) {
                return <hr key={pIdx} className="my-6 border-slate-200" />;
              }
              if (paragraph.startsWith('- ')) {
                const items = paragraph.split('\n').filter((line) => line.startsWith('- '));
                return (
                  <ul key={pIdx} className="space-y-2 list-disc list-inside text-sm sm:text-base">
                    {items.map((item, iIdx) => (
                      <li key={iIdx} dangerouslySetInnerHTML={{ __html: item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    ))}
                  </ul>
                );
              }
              return (
                <p
                  key={pIdx}
                  dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                />
              );
            })}
          </div>

          {/* Tags */}
          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Tags:</span>
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-md font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-bold text-slate-900">
              Related Machinery Guides & Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-brand-orange transition-colors group block"
                >
                  <span className="text-[11px] font-bold text-brand-orange uppercase">{rel.category}</span>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-brand-orange transition-colors mt-1">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{rel.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

