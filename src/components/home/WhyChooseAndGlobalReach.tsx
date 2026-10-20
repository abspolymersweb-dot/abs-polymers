import React from 'react';
import Link from 'next/link';
import { ArrowRight, Award, Clock, Users, Wrench, ShieldCheck, TrendingUp, Globe, MapPin } from 'lucide-react';
import { COMPANY_INFO } from '@/data/company';

export default function WhyChooseAndGlobalReach() {
  const whyPoints = [
    {
      title: '35+ Years',
      subtitle: 'in Granules Business',
      desc: 'Extensive knowledge of polymer melt index and purity standards.',
      icon: Clock
    },
    {
      title: '6+ Years',
      subtitle: 'in Machinery Manufacturing',
      desc: 'Precision machine design, SS 302 fabrication, and EN41 knives.',
      icon: Award
    },
    {
      title: 'Experienced',
      subtitle: 'Technical Team',
      desc: 'Factory-trained engineers and machinists based in Coimbatore.',
      icon: Users
    },
    {
      title: 'Reliable',
      subtitle: 'After-Sales Support',
      desc: 'Stock of genuine Havells motors, spare knives, and on-site service.',
      icon: Wrench
    },
    {
      title: 'Custom-Built',
      subtitle: 'Plant Solutions',
      desc: 'Engineered around your specific floor dimensions and scrap type.',
      icon: ShieldCheck
    },
    {
      title: 'Continuous',
      subtitle: 'Innovation',
      desc: 'Pioneered the 10 FT compact closed-loop water recycling line.',
      icon: TrendingUp
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-tech-grid opacity-15 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Why Choose ABS Polymers */}
          <div className="lg:col-span-5 bg-navy-950/80 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
                Engineering Excellence
              </span>
              <h3 className="text-2xl font-extrabold text-white tracking-tight mt-3 mb-6">
                Why Choose ABS Polymers
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {whyPoints.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="bg-navy-900/90 border border-slate-800/80 rounded-xl p-4 space-y-1">
                      <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center text-brand-orange mb-2">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-base font-black text-white">{item.title}</div>
                      <div className="text-xs font-semibold text-slate-300">{item.subtitle}</div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-tight">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Middle Column: Our Commitment to a Cleaner Planet */}
          <div className="lg:col-span-3 bg-gradient-to-br from-navy-900 to-navy-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
                Sustainability
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Our Commitment to a Cleaner Planet
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                We build innovative recycling machinery to help businesses reduce plastic waste, conserve natural resources, and create a cleaner, greener tomorrow.
              </p>
              <div className="p-3 bg-navy-850 rounded-lg border border-slate-700/60 text-xs text-slate-300">
                <span className="font-bold text-white">Water Stewardship:</span> Our closed-loop water treatment reduces chemical effluent and saves thousands of litres per operating day.
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/about"
                className="inline-flex items-center text-xs font-bold text-brand-orange hover:text-white transition-colors"
              >
                <span>Read Our Story</span>
                <ArrowRight className="ml-1.5 w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Global Reach (India & UAE) */}
          <div className="lg:col-span-4 bg-navy-950/90 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30">
                Global Reach
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight mt-3">
                Serving India and Global Markets
              </h3>
              <p className="mt-2 text-slate-400 text-xs sm:text-sm leading-relaxed">
                Supplying plastic recycling machinery across India and exporting to the UAE, with plans for further international expansion.
              </p>

              {/* Geographic hubs */}
              <div className="mt-6 space-y-3">
                <div className="p-3.5 bg-navy-900 rounded-xl border border-slate-700/70 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Coimbatore, India</div>
                      <div className="text-[11px] text-slate-400">Headquarters & Engineering Plant</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-brand-orange/20 text-brand-orange px-2 py-0.5 rounded">
                    HQ
                  </span>
                </div>

                <div className="p-3.5 bg-navy-900 rounded-xl border border-slate-700/70 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">United Arab Emirates (UAE)</div>
                      <div className="text-[11px] text-slate-400">Export Market & Commissioned Lines</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                    Active Export
                  </span>
                </div>

                <div className="p-3.5 bg-navy-900/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Planned Future Expansion</span>
                  <span className="text-slate-300 font-semibold">Middle East & Africa</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <Link
                href="/contact?intent=quote"
                className="w-full inline-flex items-center justify-center py-2.5 text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-md transition-colors shadow"
              >
                Inquire for UAE / Export Dispatch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
