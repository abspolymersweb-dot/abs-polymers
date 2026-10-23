'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  customHeroImage?: string;
  customHero?: {
    headline?: string;
    headlineAccent?: string;
    subheadline?: string;
    primaryCtaText?: string;
    primaryCtaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    heroImage?: string;
    highlights?: string[];
  };
}

export default function HeroSection({ customHeroImage, customHero }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const heroImageSrc = customHero?.heroImage || customHeroImage || '/images/hero-factory.jpg';
  const headline = customHero?.headline || 'Engineering Solutions for a';
  const headlineAccent = customHero?.headlineAccent || 'Cleaner, Greener Tomorrow.';
  const subheadline = customHero?.subheadline || 'Plastic recycling machinery and integrated processing solutions engineered to help businesses transform plastic waste into reusable resources.';
  const primaryCtaText = customHero?.primaryCtaText || 'Request a Quote';
  const primaryCtaLink = customHero?.primaryCtaLink || '/contact?intent=quote';
  const secondaryCtaText = customHero?.secondaryCtaText || 'Explore Our Machinery';
  const secondaryCtaLink = customHero?.secondaryCtaLink || '/machineries';
  const highlights = customHero?.highlights || [
    '10 FT Compact Footprint',
    'Closed-Loop Water Recycling',
    'Active UAE & Middle East Export'
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.15,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative min-h-[92vh] lg:min-h-screen flex items-center bg-navy-950 text-white overflow-hidden pt-20">
      {/* Background Cinematic Image with Slow Ambient Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="relative w-full h-full"
          initial={{ scale: 1 }}
          animate={shouldReduceMotion ? { scale: 1 } : { scale: 1.05 }}
          transition={{ duration: 24, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        >
          <Image
            src={heroImageSrc}
            alt="ABS Polymers Plastic Recycling Machinery Plant"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter brightness-[0.72] contrast-[1.08]"
          />
        </motion.div>

        {/* Multi-stop Navy Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/60 z-10" />

        {/* Industrial Grid Overlay */}
        <div className="absolute inset-0 bg-tech-grid opacity-25 z-10 pointer-events-none" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy */}
          <motion.div
            className="lg:col-span-8 space-y-7"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.12] text-white pt-2"
            >
              {headline}{' '}
              <span className="text-brand-orange block sm:inline underline decoration-brand-orange/40 decoration-wavy decoration-1 underline-offset-8">
                {headlineAccent}
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl font-normal"
            >
              {subheadline}
            </motion.p>

            {/* Key Value Highlights */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs sm:text-sm text-slate-300"
            >
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center space-x-2 bg-navy-900/80 backdrop-blur-md px-3.5 py-2.5 rounded-lg border border-slate-700/70 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                  <span className="font-medium text-slate-200">{h}</span>
                </div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                href={primaryCtaLink}
                className="inline-flex items-center px-7 py-3.5 text-base font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-lg shadow-xl shadow-brand-orange/20 hover:shadow-brand-orange/30 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>{primaryCtaText}</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href={secondaryCtaLink}
                className="inline-flex items-center px-6 py-3.5 text-base font-bold text-white bg-navy-900/80 hover:bg-navy-800/90 border border-slate-700 rounded-lg shadow-md transition-all duration-300"
              >
                <span>{secondaryCtaText}</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Quick Technical Summary Card */}
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="bg-navy-900/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-2xl pointer-events-none" />

              <div className="border-b border-slate-800 pb-4">
                <span className="text-[11px] font-bold text-brand-orange uppercase tracking-wider block mb-1">
                  Verified Manufacturing Baseline
                </span>
                <h3 className="text-xl font-black text-white">
                  Industrial Benchmark
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Footprint Efficiency</span>
                  <span className="text-emerald-400 font-bold">10 FT Compact Design</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Motor Power Supply</span>
                  <span className="text-white font-bold font-mono">380V/415V 50Hz (Havells)</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Cutting Blade Metallurgy</span>
                  <span className="text-white font-bold">EN41 Alloy Steel</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Contact Surfaces</span>
                  <span className="text-white font-bold">SS 302 Stainless Steel</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-400">Export Despatch</span>
                  <span className="text-brand-orange font-bold">UAE, GCC & Pan-India</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/machineries"
                  className="flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white p-3 rounded-xl bg-navy-950/70 border border-slate-800 hover:border-brand-orange/50 transition-all group"
                >
                  <span className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                    Browse Machinery Lines
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-orange group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
          Explore Infrastructure
        </span>
        <ChevronDown className="w-4 h-4 text-brand-orange animate-bounce" />
      </motion.div>
    </section>
  );
}
