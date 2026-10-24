import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Factory,
  Settings,
  Wrench,
  Package,
  Headphones,
  Phone,
  MessageSquare,
  Mail,
  MapPin
} from 'lucide-react';
import { dataService } from '@/services/dataService';
import { COMPANY_INFO } from '@/data/company';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const iconMap: Record<string, React.ElementType> = {
  Factory,
  Settings,
  Wrench,
  Package,
  Headphones
};

export async function generateStaticParams() {
  const services = await dataService.getServices();
  return (services || [])
    .filter((srv: any) => srv.isActive !== false)
    .map((srv: any) => ({
      slug: srv.slug
    }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await dataService.getServices(slug);

  if (!service || service.isActive === false) {
    return { title: 'Service Not Found | ABS Polymers' };
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
  const [service, companyInfo] = await Promise.all([
    dataService.getServices(slug),
    dataService.getCompanyInfo()
  ]);

  if (!service || service.isActive === false) {
    notFound();
  }

  const Icon = iconMap[service.iconName] || Factory;
  const cleanWhatsApp = companyInfo.contact.whatsapp.replace(/\D/g, '');
  const waUrl = `https://wa.me/${cleanWhatsApp}?text=Hello%20ABS%20Polymers,%20I%20am%20inquiring%20about%20your%20service:%20${encodeURIComponent(service.title)}.`;
  const mailtoUrl = `mailto:${companyInfo.contact.salesEmail}?subject=Service%20Consultation%20Request:%20${encodeURIComponent(service.title)}&body=Dear%20ABS%20Polymers%20Team,%0A%0AI%20would%20like%20to%20consult%20regarding%20${encodeURIComponent(service.title)}.%0A%0ACompany%20Name:%0ARequirement%20Details:%0ALocation:%0APhone%20Number:`;

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
              href="#factory-desk"
              className="inline-flex items-center px-6 py-3 text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-lg shadow-md transition-all"
            >
              <span>{service.slug.includes('spare-parts') ? 'Order Replacement Parts' : 'Consult Engineering Desk'}</span>
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
            {service.processSteps && service.processSteps.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
                  Step-by-Step Delivery Process
                </h3>
                <div className="space-y-3">
                  {service.processSteps.map((step: any, sIdx: number) => (
                    <div key={step.step || sIdx} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-[#04294a] text-white text-xs font-bold flex items-center justify-center">
                          {step.step || sIdx + 1}
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
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            {service.deliverables && service.deliverables.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Key Deliverables
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {service.deliverables.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3 text-xs text-slate-600">
              <div className="font-bold text-slate-900 uppercase tracking-wider">Service Benchmarks</div>
              <div><strong>Lead Time:</strong> {service.leadTimeWeeks || '2-4 weeks'}</div>
              <div><strong>Warranty:</strong> {service.warrantyYears || '1 year comprehensive'}</div>
              <div><strong>Engineering Base:</strong> Coimbatore Works & UAE Export Desk</div>
            </div>
          </div>
        </div>

        {/* Dedicated Factory Engineering Desk */}
        <div id="factory-desk" className="scroll-mt-24 bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 text-white rounded-2xl p-8 sm:p-10 border border-slate-800 shadow-2xl">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
            <span className="text-xs font-black uppercase tracking-wider text-brand-orange bg-brand-orange/15 px-3 py-1 rounded-full border border-brand-orange/30">
              Factory Engineering Desk
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Consult on {service.title}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Speak directly with our Coimbatore manufacturing engineers for custom design, turn-key line integrations, plant layout assessments, and genuine spare parts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Phone Call */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center flex flex-col justify-between space-y-4 hover:border-brand-orange/50 transition-colors">
              <div>
                <div className="w-12 h-12 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-3 text-brand-orange">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="text-xs uppercase font-bold text-slate-400">Direct Factory Hotline</div>
                <div className="text-base font-bold text-white mt-1">{companyInfo.contact.phoneDisplay}</div>
                <div className="text-xs text-slate-400 mt-1">{companyInfo.contact.workingHours || 'Mon-Sat, 9:00 AM – 7:00 PM IST'}</div>
              </div>
              <a
                href={`tel:${companyInfo.contact.phone.replace(/\s+/g, '')}`}
                className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-lg transition-colors"
              >
                Call Engineer
              </a>
            </div>

            {/* WhatsApp */}
            <div className="bg-white/5 border border-emerald-500/30 rounded-xl p-6 text-center flex flex-col justify-between space-y-4 hover:border-emerald-500/60 transition-colors">
              <div>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-400">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="text-xs uppercase font-bold text-slate-400">Instant WhatsApp Desk</div>
                <div className="text-base font-bold text-white mt-1">{companyInfo.contact.whatsappDisplay || companyInfo.contact.whatsapp}</div>
                <div className="text-xs text-emerald-400 mt-1">Fast Response & Drawings</div>
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors shadow-lg shadow-emerald-900/30"
              >
                Chat on WhatsApp
              </a>
            </div>

            {/* Sales Email */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center flex flex-col justify-between space-y-4 hover:border-brand-orange/50 transition-colors">
              <div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="text-xs uppercase font-bold text-slate-400">Engineering Inquiry Email</div>
                <div className="text-base font-bold text-white mt-1">{companyInfo.contact.salesEmail}</div>
                <div className="text-xs text-slate-400 mt-1">Formal Proforma & Scope</div>
              </div>
              <a
                href={mailtoUrl}
                className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-lg transition-colors"
              >
                Email Service Request
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-wrap items-center justify-center gap-4">
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 text-brand-orange mr-1" />
              Works: Coimbatore, Tamil Nadu, India
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>Global Technical Commissioning & Support</span>
          </div>
        </div>
      </div>
    </div>
  );
}
