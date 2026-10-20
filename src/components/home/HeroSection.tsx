'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  customHeroImage?: string;
}

export default function HeroSection({ customHeroImage }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const heroImageSrc = customHeroImage || '/images/hero-factory.jpg';

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
          {/* Main Hero Copy (unwanted tagline completely removed, layout balanced) */}
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
              Engineering Solutions for a{' '}
              <span className="text-brand-orange block sm:inline underline decoration-brand-orange/40 decoration-wavy decoration-1 underline-offset-8">
                Cleaner, Greener Tomorrow.
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl font-normal"
            >
              Plastic recycling machinery and integrated processing solutions engineered to help businesses transform plastic waste into reusable resources.
            </motion.p>

            {/* Key Value Highlights */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs sm:text-sm text-slate-300"
            >
              <div className="flex items-center space-x-2 bg-navy-900/80 backdrop-blur-md px-3.5 py-2.5 rounded-lg border border-slate-700/70 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                <span className="font-medium text-slate-200">10 FT Compact Footprint</span>
              </div>
              <div className="flex items-center space-x-2 bg-navy-900/80 backdrop-blur-md px-3.5 py-2.5 rounded-lg border border-slate-700/70 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                <span className="font-medium text-slate-200">Closed-Loop Water Recycling</span>
              </div>
              <div className="flex items-center space-x-2 bg-navy-900/80 backdrop-blur-md px-3.5 py-2.5 rounded-lg border border-slate-700/70 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                <span className="font-medium text-slate-200">Active UAE & Export Despatch</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                href="/contact?intent=quote"
                className="inline-flex items-center px-7 py-3.5 text-base font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-lg shadow-xl shadow-brand-orange/20 hover:shadow-brand-orange/30 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Request a Quote</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="/machineries"
                className="inline-flex items-center px-7 py-3.5 text-base font-bold text-white bg-white/10 hover:bg-white/20 border border-white/25 rounded-lg backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Explore Our Machinery</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Floating Quick Metric Panel */}
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
          >
            <div className="bg-navy-900/90 backdrop-blur-xl border border-slate-700/90 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5">
              <div className="border-b border-slate-700/80 pb-4">
                <div className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                  Manufacturing Benchmarks
                </div>
                <div className="text-lg font-bold text-white mt-1">
                  Built for Heavy Industrial Duty
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start justify-between">
                  <span className="text-slate-400">Polymer Experience</span>
                  <span className="font-extrabold text-white text-right">35+ Years in Granules</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-400">Machine Engineering</span>
                  <span className="font-extrabold text-white text-right">6+ Years Machinery</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-400">Motor Reliability</span>
                  <span className="font-extrabold text-white text-right">Havells 3-Phase Motors</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-400">Cutting Blades</span>
                  <span className="font-extrabold text-white text-right">EN41 High-Carbon Steel</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-400">Plant Design</span>
                  <span className="font-extrabold text-white text-right">10 FT Compact SS 302</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/machineries/absw-plastic-washing-plant"
                  className="w-full flex items-center justify-center py-2.5 px-4 bg-navy-800 hover:bg-navy-700 text-slate-200 hover:text-white rounded-lg text-xs font-bold border border-slate-600/70 transition-colors"
                >
                  View ABSW Washing Plant Specs →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Restrained Scroll Down Indicator */}
      <div className="absolute bottom-6 inset-x-0 z-20 hidden md:flex justify-center pointer-events-none">
        <div className="flex flex-col items-center text-slate-400 text-xs tracking-wider space-y-1.5 opacity-80">
          <span>SCROLL TO EXPLORE</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-brand-orange" />
        </div>
      </div>
    </section>
  );
}
