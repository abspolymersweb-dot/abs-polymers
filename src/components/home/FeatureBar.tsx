import React from 'react';
import { Cpu, Award, Zap, ShieldCheck, Layers, Globe } from 'lucide-react';

export default function FeatureBar() {
  const verifiedHighlights = [
    {
      icon: Cpu,
      title: 'Havells 3-Phase Motors',
      spec: 'Heavy-Duty 380V/415V Electric Drives & Starters',
      tag: 'Motor Drive',
    },
    {
      icon: Award,
      title: 'Hardened EN41 Alloy Blades',
      spec: 'High-Tensile Precision Size-Reduction Knives',
      tag: 'Cutter Steel',
    },
    {
      icon: Zap,
      title: '10 FT Compact Footprint',
      spec: 'Saves ~65% Space vs 30 FT Conventional Lines',
      tag: 'Plant Layout',
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
      title: 'UAE & Middle East Export',
      spec: 'Verified International Container Dispatch',
      tag: 'Global Supply',
    },
  ];

  return (
    <div id="feature-bar" className="bg-navy-950 border-y border-slate-800/90 py-5 px-4 overflow-x-auto shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-between min-w-[980px] gap-6">
        {verifiedHighlights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center space-x-3 text-slate-300 group hover:text-white transition-colors shrink-0"
            >
              <div className="w-9 h-9 rounded-xl bg-navy-900 border border-slate-800 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white group-hover:border-brand-orange transition-all duration-300 shrink-0 shadow-xs">
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-white tracking-tight group-hover:text-brand-orange transition-colors">
                    {item.title}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-navy-900 px-1.5 py-0.5 rounded border border-slate-800">
                    {item.tag}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-normal tracking-wide">
                  {item.spec}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
