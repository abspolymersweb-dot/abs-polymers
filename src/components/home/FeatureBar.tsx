import React from 'react';
import { Cpu, Award, Zap, ShieldCheck, Layers, Globe } from 'lucide-react';

export default function FeatureBar() {
  const verifiedHighlights = [
    {
      icon: Cpu,
      title: 'Havells 3-Phase Motors',
      spec: 'Heavy-Duty 380V/415V Electric Drives',
      tag: 'Drive Unit',
    },
    {
      icon: Award,
      title: 'Hardened EN41 Blades',
      spec: 'High-Tensile Precision Size-Reduction Knives',
      tag: 'Cutter Steel',
    },
    {
      icon: Zap,
      title: '10 FT Compact Design',
      spec: 'Saves ~65% Space vs 30 FT Conventional Lines',
      tag: 'Plant Footprint',
    },
    {
      icon: ShieldCheck,
      title: 'SS 302 Contact Metallurgy',
      spec: 'Corrosion-Proof Stainless Contact Tanks',
      tag: 'Fabrication',
    },
    {
      icon: Layers,
      title: '5,400 mm Conveyor Length',
      spec: 'CR Series Continuous Bulk Spiral Flights',
      tag: 'Conveying',
    },
    {
      icon: Globe,
      title: 'UAE & Global Sea Freight',
      spec: 'Direct Container Despatch from Coimbatore',
      tag: 'Worldwide Export',
    },
  ];

  return (
    <div id="feature-bar" className="bg-navy-950 border-y border-slate-800/90 py-6 px-4 sm:px-6 lg:px-8 shadow-inner">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {verifiedHighlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex flex-col justify-between p-3.5 sm:p-4 rounded-xl bg-navy-900/70 border border-slate-800/80 hover:border-brand-orange/40 hover:bg-navy-900 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="w-8 h-8 rounded-lg bg-navy-950 border border-slate-700/80 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors duration-200">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-navy-950 px-2 py-0.5 rounded border border-slate-800">
                    {item.tag}
                  </span>
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white tracking-tight group-hover:text-brand-orange transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1 leading-snug">
                    {item.spec}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
