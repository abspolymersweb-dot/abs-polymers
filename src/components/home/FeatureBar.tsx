import React from 'react';
import { ShieldCheck, Award, Zap, Globe, Cpu } from 'lucide-react';

export default function FeatureBar() {
  const highlights = [
    { icon: Cpu, label: 'Havells 3-Phase Drives', sub: 'Tested Electricals' },
    { icon: Award, label: 'EN41 Alloy Knives', sub: 'High-Tensile Steel' },
    { icon: Zap, label: '10 FT Compact Design', sub: '65% Space Saved' },
    { icon: ShieldCheck, label: 'SS 302 Fabrication', sub: 'Corrosion Free' },
    { icon: Globe, label: 'Active UAE Export', sub: 'Middle East Dispatch' },
  ];

  return (
    <div className="bg-navy-900 border-y border-slate-800 py-4 px-4 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between min-w-[760px] gap-6">
        {highlights.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center space-x-3 text-slate-300">
              <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center text-brand-orange shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white tracking-tight">{item.label}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider">{item.sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
