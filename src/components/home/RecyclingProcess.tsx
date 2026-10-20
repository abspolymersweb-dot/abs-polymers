'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Trash2, Scissors, Waves, Wind, Sparkles, CheckCircle2 } from 'lucide-react';

interface Stage {
  num: string;
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  details: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const STAGES: Stage[] = [
  {
    num: '01',
    id: 'collection',
    title: 'Collection & Sorting',
    subtitle: 'Post-Consumer & Industrial Scrap',
    desc: 'Plastic scrap, rigid containers, drums, bottles, and scrap films are collected and categorized by polymer type (HDPE, PP, LDPE, ABS).',
    details: [
      'Segregation by polymer resin code',
      'Removal of bulk non-plastic contaminants',
      'Pre-sorting for optimized crusher throughput',
    ],
    icon: Trash2,
  },
  {
    num: '02',
    id: 'crushing',
    title: 'High-Torque Crushing',
    subtitle: 'G Series Size Reduction',
    desc: 'Heavy-duty G Series crushers equipped with hardened EN41 alloy steel knives chop scrap into uniform 1 mm to 25 mm regrind flakes at 480 RPM.',
    details: [
      'EN41 high-carbon alloy blades maintain sharp cutting edges',
      'Low dust generation and high bulk density regrind',
      'Powered by 20 HP to 60 HP Havells 3-phase electric motors',
    ],
    icon: Scissors,
  },
  {
    num: '03',
    id: 'washing',
    title: 'Hot Friction Washing',
    subtitle: '60°C – 80°C Dynamic Cleaning',
    desc: 'Regrind enters the ABSW 10 FT compact washer. Intensive hot friction cleaning strips away dirt, grease, chemical residues, paper labels, and adhesives.',
    details: [
      'Closed-loop water recycling conserves freshwater',
      'Dual-temperature zone (60°C–80°C washing & 120°C–140°C heating)',
      'SS 302 stainless steel contact surfaces eliminate rust',
    ],
    icon: Waves,
  },
  {
    num: '04',
    id: 'dewatering',
    title: 'Centrifugal Dewatering',
    subtitle: 'High-Speed Moisture Separation',
    desc: 'High-velocity centrifugal action rapidly extracts water from the washed flakes, ensuring minimal residual moisture before pneumatic transport.',
    details: [
      'Continuous automatic moisture extraction',
      'Dynamic balanced rotor reduces vibration and wear',
      'Direct pneumatic transfer via MTB series blowers',
    ],
    icon: Wind,
  },
  {
    num: '05',
    id: 'granules',
    title: 'Clean Flakes & Granules',
    subtitle: 'High-Purity Extrusion Ready',
    desc: 'Spotless, dried polymer flakes ready for direct moulding extrusion or compounding pelletization into certified recycled polymer granules.',
    details: [
      'Uniform melt flow index and consistent density',
      'Ready for pipe, blow moulding, or injection production',
      'Supports circular economy manufacturing standards',
    ],
    icon: Sparkles,
  },
];

export default function RecyclingProcess() {
  const [activeStage, setActiveStage] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const current = STAGES[activeStage];
  const IconComponent = current.icon;

  return (
    <section id="process" className="py-20 sm:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 rounded-full mb-3">
            Integrated Recycling Engineering
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            From Scrap Plastic to Reusable Granules
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            Our automated processing workflow transforms heavily contaminated post-consumer plastic waste into high-purity flakes and pellets through five coordinated stages.
          </p>
        </div>

        {/* 5-Stage Stepper Buttons with Connected Line */}
        <div className="relative mb-12">
          {/* Background Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />

          {/* Stepper Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 relative z-10">
            {STAGES.map((stage, idx) => {
              const StageIcon = stage.icon;
              const isActive = activeStage === idx;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(idx)}
                  className={`text-left p-4 rounded-xl border transition-all duration-300 relative group cursor-pointer ${
                    isActive
                      ? 'bg-navy-950 text-white border-navy-950 shadow-xl scale-[1.02]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded ${
                        isActive
                          ? 'bg-brand-orange text-white'
                          : 'bg-slate-200 text-slate-700 group-hover:bg-brand-orange group-hover:text-white transition-colors'
                      }`}
                    >
                      {stage.num}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-navy-850 text-brand-orange'
                          : 'bg-white text-slate-600 group-hover:text-brand-orange'
                      }`}
                    >
                      <StageIcon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="text-sm font-bold truncate">{stage.title}</div>
                  <div
                    className={`text-[11px] truncate mt-0.5 ${
                      isActive ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {stage.subtitle}
                  </div>

                  {/* Active Indicator Pip */}
                  {isActive && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-navy-950 rotate-45 hidden lg:block" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Detailed Panel */}
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Stage Details */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-black text-brand-orange">{current.num}</span>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{current.title}</h3>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {current.subtitle}
                  </div>
                </div>
              </div>

              <p className="text-slate-700 text-base leading-relaxed max-w-2xl">
                {current.desc}
              </p>

              {/* Technical bullet points */}
              <div className="space-y-2.5 pt-2">
                {current.details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-start text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-brand-orange mr-2.5 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Stage Visual Representation */}
            <div className="lg:col-span-4 bg-navy-950 text-white rounded-xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="w-12 h-12 rounded-xl bg-navy-850 flex items-center justify-center text-brand-orange mb-4">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                  Engineered Machinery Match
                </div>
                <div className="text-lg font-bold text-white mt-1">
                  {current.id === 'crushing'
                    ? 'G Series Plastic Crusher'
                    : current.id === 'washing' || current.id === 'dewatering'
                    ? 'ABSW Compact Washing Plant'
                    : current.id === 'granules'
                    ? 'ABS Recycled Polymer Granules'
                    : 'ABS Turnkey Plant Layout'}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Configured according to your incoming scrap contamination level, bulk density, and target hourly output.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() =>
                    setActiveStage((prev) => (prev + 1) % STAGES.length)
                  }
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-lg text-xs font-bold transition-colors"
                >
                  <span>Next Stage ({STAGES[(activeStage + 1) % STAGES.length].num})</span>
                  <ArrowRight className="ml-1.5 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Technical Notice */}
        <p className="text-center text-xs text-slate-500 mt-8 italic">
          *Note: Exact washing stage sequence and auxiliary components are customized depending on specific contamination levels, polymer type (HDPE/PP/LDPE), and plant footprint.
        </p>
      </div>
    </section>
  );
}
