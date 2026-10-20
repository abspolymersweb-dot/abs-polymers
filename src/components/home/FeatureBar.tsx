import React from 'react';
import { Maximize2, Zap, DollarSign, Award, Factory, Wrench, Headphones } from 'lucide-react';

export default function FeatureBar() {
  const features = [
    { icon: Maximize2, title: 'Compact Design' },
    { icon: Zap, title: 'Low Power Consumption' },
    { icon: DollarSign, title: 'Cost Efficient Investment' },
    { icon: Award, title: 'High Cleaning Performance' },
    { icon: Factory, title: 'Complete Plant Solutions' },
    { icon: Wrench, title: 'Custom-Built Machinery' },
    { icon: Headphones, title: 'Installation & After-Sales' },
  ];

  return (
    <div className="bg-white border-b border-slate-200 shadow-xs py-5 px-4 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between min-w-[760px] gap-6">
        {features.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center space-x-2.5 text-slate-700 whitespace-nowrap group">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#04294a] group-hover:bg-brand-orange group-hover:text-white transition-colors duration-200">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold tracking-tight text-slate-800">
                {item.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
