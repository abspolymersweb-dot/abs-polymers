import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CheckCircle2, ChevronRight, ArrowRight, Factory, Settings, Wrench, Package, Headphones } from 'lucide-react';
import { SERVICES_DATA } from '@/data/services';
import InquiryForm from '@/components/common/InquiryForm';

const iconMap: Record<string, React.ElementType> = {
  Factory,
  Settings,
  Wrench,
  Package,
  Headphones
};

export async function generateStaticParams() {
  return SERVICES_DATA.map((srv) => ({
    slug: srv.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES_DATA.find((s) => s.slug === slug);

  if (!service) {
    return { title: 'Service Not Found' };
  }

  return {
    title: `${service.title} | ABS Polymers Coimbatore`,
    description: service.shortDescription
  };
}

export default async function ServiceDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const service = SERVICES_DATA.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const Icon = iconMap[service.iconName] || Factory;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header with Integrated Breadcrumbs */}
      <div className="bg-navy-950 text-white pt-28 pb-14 sm:pt-32 sm:pb-18 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          {/* Breadcrumbs Navigation */}
          <nav className="flex items-center space-x-2 text-xs font-medium text-slate-400 mb-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-brand-orange truncate font-semibold">{service.title}</span>
          </nav>

          <div className="w-12 h-12 rounded-xl bg-brand-orange/20 flex items-center justify-center text-brand-orange">
            <Icon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            {service.title}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            {service.shortDescription}
          </p>
          <div className="pt-2">
            <a
              href="#inquiry-form-section"
              className="inline-flex items-center px-6 py-3 text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-lg shadow-md transition-all"
            >
              <span>{service.slug.includes('spare-parts') ? 'Order Replacement Parts' : 'Request Service Quotation'}</span>
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Service Scope & Capabilities
            </h2>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              {service.fullDescription}
            </p>

            {/* Detailed Process Steps */}
            <div className="space-y-4 pt-4">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
                Step-by-Step Delivery Process
              </h3>
              <div className="space-y-3">
                {service.processSteps.map((step) => (
                  <div key={step.step} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-[#04294a] text-white text-xs font-bold flex items-center justify-center">
                        {step.step}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                    </div>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 pl-8 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Key Deliverables
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {service.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div id="inquiry-form-section" className="scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
              Engineering Consultation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Inquire About {service.title}
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Direct factory engineering support and rapid component dispatch from Coimbatore.
            </p>
          </div>

          <InquiryForm
            initialInquiryType={service.slug.includes('spare-parts') ? 'spare_parts' : 'plant_turnkey'}
            initialProductName={service.title}
            initialPart={service.slug.includes('spare-parts') ? 'Replacement Knife Parts (EN41 Alloy Steel)' : ''}
          />
        </div>
      </div>
    </div>
  );
}

