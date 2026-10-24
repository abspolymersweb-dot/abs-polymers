import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  CheckCircle2,
  ChevronRight,
  Package,
  ArrowRight,
  ShieldCheck,
  Phone,
  MessageSquare,
  Mail,
  MapPin
} from 'lucide-react';
import { dataService } from '@/services/dataService';
import { COMPANY_INFO } from '@/data/company';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateStaticParams() {
  const granules = await dataService.getGranules();
  return (granules || [])
    .filter((prod: any) => prod.published !== false)
    .map((prod: any) => ({
      slug: prod.slug
    }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await dataService.getGranules(slug);

  if (!product || product.published === false) {
    return { title: 'Granule Product Not Found | ABS Polymers' };
  }

  return {
    title: product.metaTitle || `${product.name} | ABS Polymers Coimbatore`,
    description: product.metaDescription || product.shortDescription
  };
}

export default async function GranuleDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const [product, companyInfo] = await Promise.all([
    dataService.getGranules(slug),
    dataService.getCompanyInfo()
  ]);

  if (!product || product.published === false) {
    notFound();
  }

  const cleanWhatsApp = companyInfo.contact.whatsapp.replace(/\D/g, '');
  const waSampleUrl = `https://wa.me/${cleanWhatsApp}?text=Hello%20ABS%20Polymers,%20I%20would%20like%20to%20request%20samples%20and%20rates%20for%20${encodeURIComponent(product.name)}%20(${encodeURIComponent(product.grade)}).`;
  const mailtoUrl = `mailto:${companyInfo.contact.salesEmail}?subject=Granule%20Supply%20Quotation:%20${encodeURIComponent(product.name)}&body=Dear%20ABS%20Polymers%20Team,%0A%0APlease%20provide%20a%20commercial%20quotation%20for%20${encodeURIComponent(product.name)}%20(${encodeURIComponent(product.grade)}).%0A%0AMonthly%20Volume%20(MT):%0AColor/Specification:%0ADelivery%20Destination:%0ACompany%20Name:`;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Banner with Integrated Breadcrumbs */}
      <div className="bg-navy-950 text-white pt-28 pb-14 sm:pt-32 sm:pb-18 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          {/* Breadcrumbs Navigation */}
          <nav className="flex items-center space-x-2 text-xs font-medium text-slate-400 mb-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link href="/granules" className="hover:text-white transition-colors">Granules</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-brand-orange truncate font-semibold">{product.name}</span>
          </nav>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-brand-orange text-white text-xs font-black rounded uppercase">
              {product.materialType} Polymer
            </span>
            <span className="px-3 py-1 bg-navy-850 text-slate-300 text-xs font-semibold rounded border border-slate-700">
              Grade: {product.grade}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            {product.name}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            {product.shortDescription}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Overview & Tech Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Material Overview & Processing Quality
            </h2>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              {product.overview}
            </p>

            {product.verifiedSpecs && product.verifiedSpecs.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Verified Technical Benchmarks
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.verifiedSpecs.map((spec: any, sIdx: number) => (
                    <div key={sIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                      <span className="font-bold text-slate-900 block">{spec.label}</span>
                      <span className="text-slate-600 mt-0.5">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.applications && product.applications.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Recommended End-Product Applications
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
                  {product.applications.map((app: string, aIdx: number) => (
                    <li key={aIdx} className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Commercial & Packaging Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Packaging & Supply Terms
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                <div>
                  <span className="font-semibold block text-slate-500">Packaging</span>
                  <span>{product.packaging}</span>
                </div>
                <div>
                  <span className="font-semibold block text-slate-500">Minimum Order</span>
                  <span>{product.minOrderQuantity}</span>
                </div>
                {product.colorsAvailable && product.colorsAvailable.length > 0 && (
                  <div>
                    <span className="font-semibold block text-slate-500">Available Colors</span>
                    <span>{Array.isArray(product.colorsAvailable) ? product.colorsAvailable.join(', ') : product.colorsAvailable}</span>
                  </div>
                )}
                <div>
                  <span className="font-semibold block text-slate-500">Supply Status</span>
                  <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-full text-xs">
                    Ready for Delivery
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <a
                  href={waSampleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow"
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                  Order 10kg Sample via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Factory Commercial Desk */}
        <div id="factory-desk" className="scroll-mt-24 bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 text-white rounded-2xl p-8 sm:p-10 border border-slate-800 shadow-2xl">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
            <span className="text-xs font-black uppercase tracking-wider text-brand-orange bg-brand-orange/15 px-3 py-1 rounded-full border border-brand-orange/30">
              Bulk Supply & Commercial Quotations
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Request Pricing & Samples for {product.name}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Connect directly with our Coimbatore dispatch desk for bulk tonnage schedules, polymer batch test certificates, and ex-factory / CIF freight quotes.
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
                Call Commercial Desk
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
                <div className="text-xs text-emerald-400 mt-1">Samples & Lab COA Reports</div>
              </div>
              <a
                href={waSampleUrl}
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
                <div className="text-xs uppercase font-bold text-slate-400">Formal Quotation Email</div>
                <div className="text-base font-bold text-white mt-1">{companyInfo.contact.salesEmail}</div>
                <div className="text-xs text-slate-400 mt-1">Written Proforma & Bulk Rates</div>
              </div>
              <a
                href={mailtoUrl}
                className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-lg transition-colors"
              >
                Email Quotation Request
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400 flex flex-wrap items-center justify-center gap-4">
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 text-brand-orange mr-1" />
              Works: Coimbatore, Tamil Nadu, India
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span>Dispatch: 25kg HDPE Bags / 1-Ton Jumbo Bags Available</span>
          </div>
        </div>
      </div>
    </div>
  );
}
