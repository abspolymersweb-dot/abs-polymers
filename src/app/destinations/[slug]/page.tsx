import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import {
  Globe,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Phone,
  MessageSquare,
  Mail,
  Layers,
  Award,
  Factory,
  ChevronRight
} from 'lucide-react';
import { dataService } from '@/services/dataService';
import { COMPANY_INFO } from '@/data/company';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateStaticParams() {
  try {
    const destinations = await dataService.getDestinations(undefined, true);
    return (destinations || []).map((d: any) => ({ slug: d.slug }));
  } catch (err) {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dest = await dataService.getDestinations(slug, true);

  if (!dest) {
    return {
      title: 'Destination Not Found | ABS Polymers',
      description: 'The requested international destination market is currently not available.'
    };
  }

  const title = dest.metaTitle || `Plastic Recycling Machinery for ${dest.countryName} | ABS Polymers`;
  const description =
    dest.metaDescription ||
    `High-performance industrial plastic recycling machinery, washing plants, and granulators for ${dest.countryName} from ABS Polymers Coimbatore.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://abspolymers.com/destinations/${dest.slug}`,
      siteName: 'ABS Polymers',
      images: [
        {
          url: dest.heroImage || '/images/products/machines-collage.jpg',
          width: 1200,
          height: 630,
          alt: dest.imageAlt || `ABS Polymers Recycling Plants for ${dest.countryName}`
        }
      ]
    }
  };
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;
  const dest = await dataService.getDestinations(slug, true);

  if (!dest || dest.published === false) {
    notFound();
  }

  const cleanWhatsApp = COMPANY_INFO.contact.whatsapp.replace(/\D/g, '');
  const waUrl = `https://wa.me/${cleanWhatsApp}?text=Hello%20ABS%20Polymers,%20I%20am%20inquiring%20about%20plastic%20recycling%20machinery%20for%20export%20to%20${encodeURIComponent(dest.countryName)}.`;
  const mailtoUrl = `mailto:${COMPANY_INFO.contact.email}?subject=Export%20Quotation%20Request:%20${encodeURIComponent(dest.countryName)}&body=Dear%20ABS%20Polymers%20Export%20Team,%0A%0APlease%20provide%20a%20formal%20CIF%20freight%20and%20machinery%20quotation%20for%20${encodeURIComponent(dest.countryName)}.%0A%0APlant%20Capacity%20Required:%0AMaterials%20to%20Recycle:%0APort%20of%20Destination:%0ACompany%20Name:`;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. Hero Header Banner */}
      <div className="bg-navy-950 text-white pt-28 pb-16 sm:pt-32 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <nav className="flex items-center space-x-2 text-xs font-medium text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link href="/destinations" className="hover:text-white transition-colors">Global Destinations</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-brand-orange truncate font-semibold">{dest.countryName}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-brand-orange/20 text-brand-orange text-xs font-black uppercase tracking-wider rounded-full border border-brand-orange/30">
                  {dest.region} Trade Corridor
                </span>
                <span className="px-2.5 py-1 bg-navy-850 text-slate-300 text-xs font-semibold rounded border border-slate-700">
                  Direct Factory Export
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Plastic Recycling Machinery for {dest.countryName}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                {dest.introContent}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="#export-desk"
                  className="inline-flex items-center px-6 py-3.5 text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5"
                >
                  <span>Request Export Quotation</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-3.5 text-sm font-semibold text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-xl transition-colors"
                >
                  <MessageSquare className="mr-2 w-4 h-4" />
                  <span>WhatsApp Export Desk</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl aspect-4/3 w-full bg-navy-900">
                <Image
                  src={dest.heroImage || '/images/products/machines-collage.jpg'}
                  alt={dest.imageAlt || `ABS Polymers in ${dest.countryName}`}
                  fill
                  priority
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Applications & Recommended Machinery */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-4">
              Regional Manufacturing & Scrap Processing Overview
            </h2>

            <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
              {dest.introContent}
            </p>

            {dest.keyApplications && dest.keyApplications.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Priority Industrial Recycling Demands in {dest.countryName}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dest.keyApplications.map((app: string, idx: number) => (
                    <div key={idx} className="flex items-start text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0 mt-0.5" />
                      <span>{app}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
              Export Logistics from Coimbatore
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700">
              <div>
                <span className="font-semibold block text-slate-500">Target Region</span>
                <span>{dest.region}</span>
              </div>
              <div>
                <span className="font-semibold block text-slate-500">Dispatch Port</span>
                <span>Port Tuticorin / Chennai / Nhava Sheva (India)</span>
              </div>
              <div>
                <span className="font-semibold block text-slate-500">Electrical System</span>
                <span>380V – 415V, 50Hz, 3-Phase (Havells Powered)</span>
              </div>
              <div>
                <span className="font-semibold block text-slate-500">Container Packaging</span>
                <span>20 FT / 40 FT Open-Top or High-Cube Shipping Containers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Machinery */}
        {dest.recommendedMachinery && dest.recommendedMachinery.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Recommended Processing Equipment for {dest.countryName}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dest.recommendedMachinery.map((mach: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-2.5 py-0.5 rounded-full inline-block">
                      {mach.role || 'Recommended System'}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{mach.name}</h3>
                  </div>

                  <Link
                    href={`/machineries/${mach.slug}`}
                    className="inline-flex items-center text-xs font-bold text-brand-orange hover:underline pt-2 border-t border-slate-100"
                  >
                    <span>View Technical Specifications</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. Direct Destination Export Desk */}
      <section id="export-desk" className="py-16 sm:py-24 bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <span className="inline-flex items-center text-xs font-black uppercase tracking-wider text-brand-orange bg-brand-orange/15 px-3 py-1 rounded-full border border-brand-orange/30">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Direct Export Desk for {dest.countryName}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Order or Consult for Import to {dest.countryName}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Connect directly with our Coimbatore factory export desk. Get container packing drawings, CIF port delivery timelines, and certified electrical schedules for {dest.countryName}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center flex flex-col justify-between space-y-4">
              <div>
                <div className="w-12 h-12 bg-brand-orange/20 rounded-full flex items-center justify-center mx-auto mb-3 text-brand-orange">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="text-xs uppercase font-bold text-slate-400">Export Telephone Hotline</div>
                <div className="text-base font-bold text-white mt-1">{COMPANY_INFO.contact.phone}</div>
                <div className="text-xs text-slate-400 mt-1">Mon–Sat: 09:00 to 19:00 IST</div>
              </div>
              <a
                href={`tel:${COMPANY_INFO.contact.phone.replace(/\s+/g, '')}`}
                className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-lg transition-colors"
              >
                Call Factory
              </a>
            </div>

            <div className="bg-white/5 border border-emerald-500/30 rounded-xl p-6 text-center flex flex-col justify-between space-y-4">
              <div>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-400">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="text-xs uppercase font-bold text-slate-400">WhatsApp Export Desk</div>
                <div className="text-base font-bold text-white mt-1">{COMPANY_INFO.contact.whatsapp}</div>
                <div className="text-xs text-emerald-400 mt-1">Drawings & Itemized Quotes</div>
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

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center flex flex-col justify-between space-y-4">
              <div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-400">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="text-xs uppercase font-bold text-slate-400">Official Export Proforma</div>
                <div className="text-base font-bold text-white mt-1">{COMPANY_INFO.contact.email}</div>
                <div className="text-xs text-slate-400 mt-1">Written CIF Quotation</div>
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
            <span>Target Market: {dest.countryName} ({dest.region})</span>
          </div>
        </div>
      </section>
    </div>
  );
}
