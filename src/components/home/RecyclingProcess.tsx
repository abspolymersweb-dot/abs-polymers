import React from 'react';
import { ArrowRight, Layers, Trash2, Scissors, Waves, Wind, Sparkles } from 'lucide-react';

export default function RecyclingProcess() {
  const steps = [
    {
      num: '01',
      title: 'Collection',
      desc: 'Plastic scrap and post-consumer materials collected and pre-sorted.',
      icon: Trash2
    },
    {
      num: '02',
      title: 'Shredding',
      desc: 'Heavy-duty G Series grinders reduce scrap to uniform 1 mm–25 mm regrind.',
      icon: Scissors
    },
    {
      num: '03',
      title: 'Hot Washing',
      desc: '60°C–80°C hot friction washing cleans dirt, grease, and dissolves chemical adhesives.',
      icon: Waves
    },
    {
      num: '04',
      title: 'Dewatering',
      desc: 'High-speed centrifugal drying extracts water and prepares flakes for heating.',
      icon: Wind
    },
    {
      num: '05',
      title: 'Clean Flakes',
      desc: 'Spotless, dry polymer flakes ready for direct extrusion or compounding pelletizing.',
      icon: Sparkles
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            From Plastic Waste to New Possibilities
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Our machinery transforms heavily contaminated plastic scrap into clean, high-value reusable materials through an efficient, continuous industrial process.
          </p>
        </div>

        {/* 5-Step Process Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;
            return (
              <div
                key={step.num}
                className="bg-slate-50 hover:bg-white rounded-xl p-6 border border-slate-200/90 hover:border-brand-orange/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-300 group-hover:text-brand-orange transition-colors">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#04294a] group-hover:bg-brand-orange group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-orange transition-colors">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {!isLast && (
                  <div className="hidden lg:block text-slate-400 self-end mt-4">
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-orange group-hover:translate-x-1 transition-all" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
