import React from 'react';
import Link from 'next/link';
import { Factory, Settings, Wrench, Package, Headphones, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { dataService } from '@/services/dataService';

const iconMap: Record<string, React.ElementType> = {
  Factory,
  Settings,
  Wrench,
  Package,
  Headphones
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ServicesPage() {
  const [allServices, servicesCms] = await Promise.all([
    dataService.getServices(),
    dataService.getPage('services')
  ]);
  const services = (allServices || []).filter((s: any) => s.isActive !== false);

  const hero = servicesCms?.sections?.hero || {
    title: 'Services & Complete Recycling Solutions',
    subtitle: 'From preliminary factory space layout and custom equipment fabrication to on-site commissioning across India and export destinations in the UAE, ABS Polymers delivers end-to-end turnkey machinery solutions.'
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white pt-28 pb-14 sm:pt-32 sm:pb-18 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Industrial Engineering Capabilities</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            {hero.title || 'Services & Complete Recycling Solutions'}
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            {hero.subtitle || 'From preliminary factory space layout and custom equipment fabrication to on-site commissioning across India and export destinations in the UAE, ABS Polymers delivers end-to-end turnkey machinery solutions.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service: any) => {
            const Icon = iconMap[service.iconName] || Factory;
            return (
              <div
                key={service.id || service.slug}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center mb-5 group-hover:bg-brand-orange group-hover:text-white transition-colors duration-200">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-orange transition-colors">
                    {service.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {service.processSteps && service.processSteps.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Process Steps
                      </div>
                      {service.processSteps.slice(0, 2).map((s: any, idx: number) => (
                        <div key={s.step || idx} className="flex items-start text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                          <span><strong>Step {s.step || idx + 1}:</strong> {s.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-xs sm:text-sm font-bold text-brand-orange hover:underline inline-flex items-center"
                  >
                    <span>View Full Service Scope</span>
                    <ArrowRight className="ml-1 w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/contact?intent=service&product=${service.id}`}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                  >
                    Inquire
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
