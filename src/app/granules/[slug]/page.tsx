import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CheckCircle2, ChevronRight, Package, ArrowRight, ShieldCheck, Phone, MessageSquare } from 'lucide-react';
import { GRANULE_PRODUCTS } from '@/data/granules';
import { COMPANY_INFO } from '@/data/company';
import InquiryForm from '@/components/common/InquiryForm';

export async function generateStaticParams() {
  return GRANULE_PRODUCTS.map((prod) => ({
    slug: prod.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const product = GRANULE_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return { title: 'Granule Product Not Found' };
  }

  return {
    title: product.metaTitle,
    description: product.metaDescription
  };
}

export default async function GranuleDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const product = GRANULE_PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-brand-orange">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/granules" className="hover:text-brand-orange">Granules</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold truncate">{product.name}</span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-4">
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

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Verified Technical Benchmarks
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.verifiedSpecs.map((spec, sIdx) => (
                  <div key={sIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block">{spec.label}</span>
                    <span className="text-slate-600 mt-0.5">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Recommended End-Product Applications
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
                {product.applications.map((app, aIdx) => (
                  <li key={aIdx} className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>
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
                <div>
                  <span className="font-semibold block text-slate-500">Available Colors</span>
                  <span>{product.colorsAvailable.join(', ')}</span>
                </div>
                <div>
                  <span className="font-semibold block text-slate-500">Supply Status</span>
                  <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-full text-xs">
                    Ready for Delivery
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <a
                  href={`https://wa.me/${COMPANY_INFO.contact.whatsapp.replace(/\D/g, '')}?text=Hello%20ABS%20Polymers,%20I%20would%20like%20to%20request%20samples%20for%20${encodeURIComponent(product.name)}`}
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

        {/* Quotation Form */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
              Commercial Order & Sample Inquiry
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Request Price Quotation for {product.name}
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Enter your monthly volume requirement. Our Coimbatore dispatch desk will provide ex-factory and CIF delivery rates.
            </p>
          </div>

          <InquiryForm
            initialProductId={product.id}
            initialProductName={product.name}
            initialInquiryType="granules_quotation"
          />
        </div>
      </div>
    </div>
  );
}
