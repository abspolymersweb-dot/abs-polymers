'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
} from 'lucide-react';

interface ScrollVideoHeroProps {
  customHero?: {
    headline?: string;
    headlineAccent?: string;
    subheadline?: string;
    primaryCtaText?: string;
    primaryCtaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    highlights?: string[];
  };
}

export default function ScrollVideoHero({ customHero }: ScrollVideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay may be restricted in low power modes; poster will remain visible
      });
    }
  }, []);

  const headline = customHero?.headline || 'Industrial Plastic Recycling Machinery &';
  const headlineAccent = customHero?.headlineAccent || 'Complete Plant Engineering';
  const subheadline =
    customHero?.subheadline ||
    'Manufacturer of space-saving 10 FT compact washing plants, high-torque granulators with hardened EN41 knives, and turnkey polymer size reduction lines engineered in Coimbatore, Tamil Nadu.';

  const primaryCta = {
    text: customHero?.primaryCtaText || 'Explore Machinery',
    href: customHero?.primaryCtaLink || '/machineries',
  };

  const secondaryCta = {
    text: customHero?.secondaryCtaText || 'Request a Quote',
    href: customHero?.secondaryCtaLink || '#quote-section',
  };

  const trustHighlights = customHero?.highlights || [
    '10 FT Compact Footprint (~65% Space Saving)',
    'Closed-Loop Multi-Cycle Water Recycling',
    'Heavy-Duty Havells 3-Phase Electric Drives',
  ];

  return (
    <section className="relative w-full min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-navy-950 text-white">
      {/* ── Background Video & Poster Layer ── */}
      <div className="absolute inset-0 z-0 bg-navy-950">
        {/* Instant Frame 1 Poster Fallback — zero delay on load */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 pointer-events-none z-[1] ${
            isVideoLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ backgroundImage: `url('/videos/hero-poster.jpg')` }}
          aria-hidden="true"
        />

        {/* Cinematic Factory Tour Video Stream */}
        <video
          ref={videoRef}
          src="/videos/hero-scroll-1080p.mp4"
          poster="/videos/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          className="w-full h-full object-cover object-center filter brightness-[0.68] contrast-[1.12] relative z-[2]"
        />

        {/* Industrial Dark Vignette & Tech Grid Overlay — guarantees WCAG AAA text contrast */}
        <div className="absolute inset-0 z-[3] bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/80 pointer-events-none" />
        <div className="absolute inset-0 z-[4] bg-tech-grid opacity-15 pointer-events-none" />
      </div>

      {/* ── Main Hero Editorial Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-16 sm:pt-36 sm:pb-20 flex flex-col justify-center">
        <div className="max-w-4xl space-y-6 sm:space-y-7">
          {/* Subtle Industrial Brand Badge */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center space-x-2.5 bg-navy-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/80 shadow-md"
          >
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Coimbatore Machine Works • Exporting to UAE & Worldwide
            </span>
          </motion.div>

          {/* Primary High-Impact Headline */}
          <motion.h1
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-white"
          >
            {headline}{' '}
            <span className="text-brand-orange block sm:inline">
              {headlineAccent}
            </span>
          </motion.h1>

          {/* Concise Supporting Description */}
          <motion.p
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="text-base sm:text-lg md:text-xl text-slate-200 leading-relaxed font-normal max-w-3xl drop-shadow-sm"
          >
            {subheadline}
          </motion.p>

          {/* Three Key Technical Highlights */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs sm:text-sm text-slate-200"
          >
            {trustHighlights.map((point, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-2.5 bg-navy-900/85 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-700/70 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                <span className="font-semibold text-slate-100">{point}</span>
              </div>
            ))}
          </motion.div>

          {/* Clean Primary and Secondary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
            className="flex flex-wrap items-center gap-4 pt-3"
          >
            <Link
              href={primaryCta.href}
              className="inline-flex items-center justify-center px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-brand-orange hover:bg-orange-600 rounded-lg shadow-xl shadow-brand-orange/25 hover:shadow-brand-orange/40 transition-all duration-200 transform hover:-translate-y-0.5 min-h-[48px]"
            >
              <span>{primaryCta.text}</span>
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            <Link
              href={secondaryCta.href}
              className="inline-flex items-center justify-center px-6 py-3.5 text-sm sm:text-base font-bold text-slate-100 hover:text-white bg-navy-900/85 hover:bg-navy-800 border border-slate-700/90 rounded-lg shadow-md transition-all duration-200 min-h-[48px]"
            >
              <span>{secondaryCta.text}</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Minimal Bottom Scroll Indicator (No clutter, non-intrusive) ── */}
      <div className="absolute bottom-6 inset-x-0 z-10 flex justify-center pointer-events-none">
        <a
          href="#feature-bar"
          aria-label="Scroll down to inspect machinery highlights"
          className="pointer-events-auto inline-flex items-center justify-center p-2 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronDown className="w-6 h-6 animate-bounce text-slate-400" />
        </a>
      </div>
    </section>
  );
}
