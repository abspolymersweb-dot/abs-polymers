'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, CheckCircle2, ChevronDown, Layers, Zap, Droplet, Sparkles } from 'lucide-react';
import { INITIAL_CMS_CONTENT } from '@/data/cms';

interface HeroSectionProps {
  customHeroImage?: string;
}

export default function HeroSection({ customHeroImage }: HeroSectionProps) {
  const content = INITIAL_CMS_CONTENT.hero;
  const heroImageSrc = customHeroImage || content.heroImage;
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <section className="relative bg-navy-950 text-white overflow-hidden">
      {/* Background Tech Grid & Ambient Lighting */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-navy-700/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24">
        {/* Top Tagline / Category Badge */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="inline-flex items-center px-3.5 py-1 text-xs font-bold tracking-wider text-brand-orange bg-brand-orange/10 border border-brand-orange/30 rounded-full uppercase">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            {content.badge}
          </span>
        </div>

        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-6 space-y-6 z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight leading-[1.12]">
              {content.headline}{' '}
              <span className="text-brand-orange block sm:inline">
                {content.headlineAccent}
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              {content.subheadline}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/contact?intent=quote"
                className="inline-flex items-center px-7 py-3.5 text-base font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-md shadow-lg shadow-brand-orange/20 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>{content.primaryCtaText}</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>

              <button
                type="button"
                onClick={() => setVideoModalOpen(true)}
                className="inline-flex items-center px-6 py-3.5 text-base font-semibold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/20 rounded-md backdrop-blur-xs transition-colors group"
              >
                <div className="w-7 h-7 rounded-full bg-brand-orange/20 flex items-center justify-center mr-2.5 group-hover:bg-brand-orange/30 transition-colors">
                  <Play className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
                </div>
                <span>Watch Video</span>
              </button>
            </div>

            {/* Scroll down hint */}
            <div className="pt-6 hidden sm:flex items-center text-xs text-slate-400 space-x-2">
              <div className="w-4 h-7 border-2 border-slate-600 rounded-full flex justify-center pt-1">
                <div className="w-1 h-2 bg-brand-orange rounded-full animate-bounce"></div>
              </div>
              <span>Scroll to explore technical specifications</span>
            </div>
          </div>

          {/* Right Column: Visual Machinery Artwork with Interactive Callouts */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-navy-900 shadow-2xl group">
              {/* Main Machine Image */}
              <div className="relative aspect-4/3 sm:aspect-16/10 w-full">
                <Image
                  src={heroImageSrc}
                  alt="ABS Polymers Plastic Washing Plant - Coimbatore"
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-[1.01] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-60"></div>
              </div>

              {/* Floating 10 FT Compact Design Overlay Badge */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-navy-950/90 backdrop-blur-md border border-brand-orange/40 p-4 rounded-xl shadow-xl max-w-xs">
                <div className="text-xl sm:text-2xl font-black text-brand-orange tracking-tight">
                  10 FT
                </div>
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Compact Design
                </div>
                <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
                  <li className="flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1.5 shrink-0" />
                    <span>65% Less Space</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1.5 shrink-0" />
                    <span>Low Power Draw</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1.5 shrink-0" />
                    <span>Continuous High Output</span>
                  </li>
                </ul>
              </div>

              {/* Process Stages Pin Callouts on Machine Visual */}
              <div className="absolute bottom-4 left-4 right-4 bg-navy-950/85 backdrop-blur-md border border-slate-700/60 p-3 rounded-lg flex items-center justify-between text-[11px] text-slate-300 overflow-x-auto gap-2">
                <div className="flex items-center shrink-0">
                  <span className="w-4 h-4 rounded-full bg-brand-orange text-white text-[10px] font-bold flex items-center justify-center mr-1">1</span>
                  <span>Feeding</span>
                </div>
                <span className="text-slate-600">→</span>
                <div className="flex items-center shrink-0">
                  <span className="w-4 h-4 rounded-full bg-brand-orange text-white text-[10px] font-bold flex items-center justify-center mr-1">2</span>
                  <span>Hot Wash</span>
                </div>
                <span className="text-slate-600">→</span>
                <div className="flex items-center shrink-0">
                  <span className="w-4 h-4 rounded-full bg-brand-orange text-white text-[10px] font-bold flex items-center justify-center mr-1">3</span>
                  <span>Separation</span>
                </div>
                <span className="text-slate-600">→</span>
                <div className="flex items-center shrink-0">
                  <span className="w-4 h-4 rounded-full bg-brand-orange text-white text-[10px] font-bold flex items-center justify-center mr-1">4</span>
                  <span>Dewatering</span>
                </div>
                <span className="text-slate-600">→</span>
                <div className="flex items-center shrink-0">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center mr-1">5</span>
                  <span className="text-white font-semibold">Clean Flakes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal Placeholder */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-navy-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold">ABS Polymers Industrial Plant Walkthrough</h3>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-navy-950 rounded-xl flex flex-col items-center justify-center text-center p-6 border border-slate-800">
              <div className="w-14 h-14 rounded-full bg-brand-orange/20 flex items-center justify-center mb-3">
                <Play className="w-6 h-6 text-brand-orange fill-brand-orange" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                ABS Polymers Factory Demonstration Video
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Brochure video demonstration is ready for connection to your official YouTube / MP4 video link.
              </p>
              <div className="mt-4 flex gap-2">
                <a
                  href={`https://wa.me/919842212345?text=Hello%20ABS%20Polymers,%20please%20send%20me%20the%20washing%20machine%20video.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-bold bg-brand-orange rounded text-white"
                >
                  Request Video on WhatsApp
                </a>
                <button
                  onClick={() => setVideoModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-800 rounded text-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
