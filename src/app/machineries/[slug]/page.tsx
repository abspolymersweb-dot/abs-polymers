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
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  ChevronRight,
  Factory
} from 'lucide-react';
import { MACHINERY_PRODUCTS } from '@/data/machinery';
import { COMPANY_INFO } from '@/data/company';
import InquiryForm from '@/components/common/InquiryForm';

export async function generateStaticParams() {
  return MACHINERY_PRODUCTS.map((prod) => ({
    slug: prod.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const product = MACHINERY_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return { title: 'Machinery Not Found' };
  }

  return {
    title: product.metaTitle,
    description: product.metaDescription,
    openGraph: {
      title: product.metaTitle,
      description: product.metaDescription,
      images: [{ url: product.heroImage }]
    }
  };
}

export default async function MachineryDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const product = MACHINERY_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Breadcrumbs bar */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-brand-orange">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/machineries" className="hover:text-brand-orange">Machineries</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold truncate">{product.name}</span>
        </div>
      </div>

      {/* Hero Header for Machine */}
      <div className="bg-navy-950 text-white py-12 lg:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
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
                href="#inquiry-form-section"
                className="inline-flex items-center px-6 py-3 text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-md shadow-lg transition-transform transform hover:-translate-y-0.5"
              >
                <span>Request Quotation</span>
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>

              {product.brochureUrl && (
                <a
                  href={product.brochureUrl}
                  download
                  className="inline-flex items-center px-5 py-3 text-sm font-semibold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/20 rounded-md backdrop-blur-xs transition-colors"
                >
                  <Download className="mr-2 w-4 h-4 text-brand-orange" />
                  <span>Download Verified Brochure (PDF)</span>
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-navy-900 shadow-2xl aspect-4/3 w-full">
              <Image
                src={product.heroImage}
                alt={product.name}
                fill
                priority
                className="object-cover object-center"
              />
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
            <div className="space-y-3 pt-4">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
                Key Mechanical & Operational Advantages
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.keyBenefits.map((benefit, bIdx) => (
                  <div key={bIdx} className="flex items-start text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-brand-orange mr-2 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compatible Materials & Applications Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Compatible Polymers
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.compatibleMaterials.map((mat) => (
                  <span
                    key={mat}
                    className="px-3 py-1 bg-blue-50 text-[#04294a] text-xs font-bold rounded-lg border border-blue-200"
                  >
                    {mat}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-500 italic">
                * Note from engineering datasheet: ABS, HIPS, and GPPS dense polymers require dedicated auxiliary conveying systems due to sink-float specific gravity dynamics.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                Typical Applications
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {product.applications.map((app, aIdx) => (
                  <li key={aIdx} className="flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-orange mr-2 mt-1.5 shrink-0"></span>
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Complete Capacity Variants Specification Table */}
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
                className="inline-flex items-center px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md shrink-0"
              >
                <Download className="w-3.5 h-3.5 mr-1.5 text-brand-orange" />
                Original PDF Table
              </a>
            )}
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#04294a] text-white">
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Model</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Capacity (kg/h)</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Motor Power / Electricals</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Dimensions (L×W×H mm)</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider">Weight (kg)</th>
                  <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-right">Inquire</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {product.variants.map((v, idx) => (
                  <tr
                    key={v.modelNumber}
                    className={`hover:bg-orange-50/50 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                      {v.modelNumber}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#04294a]">
                      {v.capacityKgHr} kg/h
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{v.motorPower || 'Havells 3-Phase'}</div>
                      <div className="text-[11px] text-slate-500">{v.voltage || '380V 50Hz'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-mono text-xs">
                      {v.dimensionsMm
                        ? `${v.dimensionsMm.length} × ${v.dimensionsMm.width} × ${v.dimensionsMm.height} mm`
                        : 'Refer to factory drawing'}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {v.weightKg ? `${v.weightKg.toLocaleString()} kg` : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`#inquiry-form-section`}
                        className="inline-block px-3 py-1 text-xs font-bold text-brand-orange bg-orange-50 hover:bg-brand-orange hover:text-white rounded border border-orange-200 transition-colors"
                      >
                        Select
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
                {product.awaitingConfirmationSpecs.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.label}:</strong> {item.value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Dedicated Quotation Section */}
        <div id="inquiry-form-section" className="scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
              Factory Direct Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Request a Quotation for {product.name}
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Select your required throughput model and supply details. Our Coimbatore team will respond with complete price, freight, and lead-time schedules.
            </p>
          </div>

          <InquiryForm
            initialProductId={product.id}
            initialProductName={product.name}
            initialInquiryType="machinery_quotation"
          />
        </div>
      </div>
    </div>
  );
}
