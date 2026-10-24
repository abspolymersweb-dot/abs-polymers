import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  CheckCircle2,
  AlertTriangle,
  Download,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  ChevronRight,
  Factory
} from 'lucide-react';
import { dataService } from '@/services/dataService';
import { COMPANY_INFO } from '@/data/company';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateStaticParams() {
  const products = await dataService.getProducts();
  return (products || [])
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
  const product = await dataService.getProducts(slug);

  if (!product || product.published === false) {
    return { title: 'Machinery Not Found | ABS Polymers' };
  }

  return {
    title: product.metaTitle || `${product.name} | ABS Polymers Coimbatore`,
    description: product.metaDescription || product.shortDescription,
    openGraph: {
      title: product.metaTitle || `${product.name} | ABS Polymers Coimbatore`,
      description: product.metaDescription || product.shortDescription,
      images: [{ url: product.heroImage || '/images/products/washing-plant-line.png' }]
    }
  };
}

export default async function MachineryDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const product = await dataService.getProducts(slug);

  if (!product || product.published === false) {
    notFound();
  }

  const isContainImage =
    (product.heroImage || '').includes('washing-plant') ||
    (product.heroImage || '').includes('crusher-granulator');

  const cleanWhatsApp = COMPANY_INFO.contact.whatsapp.replace(/\D/g, '');
  const waUrl = `https://wa.me/${cleanWhatsApp}?text=Hello%20ABS%20Polymers%20Factory,%20I%20would%20like%20to%20request%20specifications%20and%20quotation%20for%20${encodeURIComponent(product.name)}.`;
  const mailtoUrl = `mailto:${COMPANY_INFO.contact.email}?subject=Commercial%20Quotation%20Request:%20${encodeURIComponent(product.name)}&body=Dear%20ABS%20Polymers%20Team,%0A%0AI%20would%20like%20to%20request%20a%20formal%20quotation%20and%20technical%20drawing%20for%20${encodeURIComponent(product.name)}.%0A%0ARequired%20Capacity:%0AMaterial%20to%20Process:%0ADelivery%20Location:%0AContact%20Number:`;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Header for Machine with Integrated Breadcrumbs */}
      <div className="bg-navy-950 text-white pt-28 pb-14 sm:pt-32 sm:pb-18 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumbs Navigation */}
          <nav className="flex items-center space-x-2 text-xs font-medium text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link href="/machineries" className="hover:text-white transition-colors">Machineries</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-brand-orange truncate font-semibold">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/15 px-3 py-1 rounded-full border border-brand-orange/30">
                  {product.series}
                </span>
                {product.highlightBadge && (
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                    {product.highlightBadge}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                {product.name}
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                {product.shortDescription}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="#factory-desk"
                  className="inline-flex items-center px-6 py-3 text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-lg shadow-lg transition-transform transform hover:-translate-y-0.5"
                >
                  <span>Direct Factory Quotation</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>

                {product.brochureUrl && (
                  <a
                    href={product.brochureUrl}
                    download
                    className="inline-flex items-center px-5 py-3 text-sm font-semibold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg backdrop-blur-xs transition-colors"
                  >
                    <Download className="mr-2 w-4 h-4 text-brand-orange" />
                    <span>Download Engineering Specs (PDF)</span>
                  </a>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className={`relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl aspect-4/3 w-full p-4 flex items-center justify-center ${isContainImage ? 'bg-slate-100' : 'bg-navy-900'}`}>
                <Image
                  src={product.heroImage || '/images/products/washing-plant-line.png'}
                  alt={product.name}
                  fill
                  priority
                  className={`${isContainImage ? 'object-contain object-center' : 'object-cover object-center'} p-2`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Machine Overview & Compatible Materials */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-3">
              Engineering Overview
            </h2>
            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              {product.overview}
            </p>

            {/* Key Benefits */}
            {product.keyBenefits && product.keyBenefits.length > 0 && (
              <div className="space-y-3 pt-4">
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
                  Key Mechanical & Operational Advantages
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.keyBenefits.map((benefit: string, bIdx: number) => (
                    <div key={bIdx} className="flex items-start text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-brand-orange mr-2 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Compatible Materials & Applications Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {product.compatibleMaterials && product.compatibleMaterials.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Compatible Polymers
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.compatibleMaterials.map((mat: string) => (
                    <span
                      key={mat}
                      className="px-3 py-1 bg-blue-50 text-navy-900 text-xs font-bold rounded-lg border border-blue-200"
                    >
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.applications && product.applications.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                  Typical Industrial Applications
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  {product.applications.map((app: string, aIdx: number) => (
                    <li key={aIdx} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-brand-orange rounded-full mr-2 mt-1.5 shrink-0"></span>
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Complete Capacity Variants Specification Table */}
        {product.variants && product.variants.length > 0 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-2.5 py-0.5 rounded">
                  Verified Engineering Datasheet
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  Model Variants & Complete Technical Specifications
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  All electrical drives and starters powered by Havells (380V, 50Hz, 3-Phase). Direct from official ABS Polymers engineering manual.
                </p>
              </div>
              {product.brochureUrl && (
                <a
                  href={product.brochureUrl}
                  download
                  className="inline-flex items-center px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg shrink-0 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5 text-brand-orange" />
                  Original PDF Table
                </a>
              )}
            </div>

            {/* High-Contrast Responsive Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-navy-950 text-white">
                    <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Model</th>
                    <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Capacity (kg/h)</th>
                    <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Motor Power / Electricals</th>
                    <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Dimensions (L×W×H mm)</th>
                    <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Weight (kg)</th>
                    <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-right">Inquire</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {product.variants.map((v: any, idx: number) => (
                    <tr
                      key={v.modelNumber || idx}
                      className={`hover:bg-orange-50/60 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                      }`}
                    >
                      <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                        {v.modelNumber}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-brand-orange">
                        {v.capacityKgHr} kg/h
                      </td>
                      <td className="py-3.5 px-4 text-slate-800">
                        <div className="font-semibold">{v.motorPower || 'Havells 3-Phase'}</div>
                        <div className="text-[11px] text-slate-500">{v.voltage || '380V 50Hz'}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-mono text-xs">
                        {v.dimensionsMm
                          ? `${v.dimensionsMm.length} × ${v.dimensionsMm.width} × ${v.dimensionsMm.height} mm`
                          : 'Refer to factory drawing'}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {v.weightKg ? `${Number(v.weightKg).toLocaleString()} kg` : '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={`https://wa.me/${cleanWhatsApp}?text=Hello%20ABS%20Polymers,%20I%20am%20inquiring%20about%20Model%20${encodeURIComponent(v.modelNumber)}%20for%20${encodeURIComponent(product.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-3 py-1 text-xs font-bold text-brand-orange bg-orange-50 hover:bg-brand-orange hover:text-white rounded border border-orange-200 transition-colors"
                        >
                          Select Model
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Verification Status Alerts */}
            {product.awaitingConfirmationSpecs && product.awaitingConfirmationSpecs.length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center text-xs font-bold text-amber-800 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mr-1.5" />
                  Specification Verification Notes
                </div>
                <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
                  {product.awaitingConfirmationSpecs.map((item: any, idx: number) => (
                    <li key={idx}>
                      <strong>{item.label}:</strong> {item.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Dedicated Factory Engineering & Commercial Desk */}
        <div id="factory-desk" className="scroll-mt-24 bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 text-white rounded-2xl p-8 sm:p-10 border border-slate-800 shadow-2xl">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
            <span className="text-xs font-black uppercase tracking-wider text-brand-orange bg-brand-orange/15 px-3 py-1 rounded-full border border-brand-orange/30">
              Direct Factory Quotation Desk
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Order or Consult on {product.name}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Connect directly with our Coimbatore engineering desk for turnkey line sizing, ex-factory rates, export container packaging, and CIF delivery schedules.
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
                <div className="text-base font-bold text-white mt-1">{COMPANY_INFO.contact.phone}</div>
                <div className="text-xs text-slate-400 mt-1">Mon-Sat, 9:00 AM – 7:00 PM IST</div>
              </div>
              <a
                href={`tel:${COMPANY_INFO.contact.phone.replace(/\s+/g, '')}`}
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
                <div className="text-base font-bold text-white mt-1">{COMPANY_INFO.contact.whatsapp}</div>
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
                <div className="text-xs uppercase font-bold text-slate-400">Formal Quotation Email</div>
                <div className="text-base font-bold text-white mt-1">{COMPANY_INFO.contact.email}</div>
                <div className="text-xs text-slate-400 mt-1">Written Proforma & Specs</div>
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
            <span>Export Logistics: Port Tuticorin / Chennai / Nhava Sheva to UAE & GCC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
