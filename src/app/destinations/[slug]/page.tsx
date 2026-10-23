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
  Mail,
  Layers,
  Award,
  Factory,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { getDbDestinationBySlug, getAllDbDestinations, getAllDbBlogs } from '@/lib/db';
import { COMPANY_INFO } from '@/data/company';
import InquiryForm from '@/components/common/InquiryForm';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const destinations = getAllDbDestinations(true);
    return destinations.map((d) => ({ slug: d.slug }));
  } catch (err) {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dest = getDbDestinationBySlug(slug, true);

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
          alt: dest.imageAlt || `${dest.countryName} Plastic Recycling Machinery`
        }
      ]
    }
  };
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;
  const dest = getDbDestinationBySlug(slug, true);

  if (!dest || !dest.published) {
    notFound();
  }

  const relatedBlogs = getAllDbBlogs(true).slice(0, 2);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. Destination Cinematic Hero */}
      <section className="relative bg-navy-950 text-white pt-24 pb-20 sm:pt-32 sm:pb-28 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />
        <div className="absolute -top-24 right-0 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link href="/about" className="hover:text-white transition-colors">
              Global Reach
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-brand-orange">{dest.countryName}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-navy-900/90 border border-slate-700/80 px-3.5 py-1.5 rounded-full shadow-xs">
                <span className="text-lg leading-none">{dest.flagCode || '🌐'}</span>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  {dest.region}
                </span>
                <span className="text-slate-600">•</span>
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    dest.status === 'established' ? 'text-emerald-400' : 'text-brand-orange'
                  }`}
                >
                  {dest.status === 'established' ? 'Established Export Market' : 'Target Export Market'}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
                {dest.introTitle || `Plastic Recycling Machinery for ${dest.countryName}`}
              </h1>

              {/* Lead Paragraph */}
              <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
                {dest.introContent}
              </p>

              {/* Key Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {dest.keyApplications.map((app, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-2.5 bg-navy-900/80 border border-slate-800 rounded-xl p-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-300 font-medium">{app}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="#destination-quote"
                  className="inline-flex items-center px-6 py-3 text-sm font-bold text-white bg-brand-orange hover:bg-orange-600 rounded-lg shadow-lg shadow-brand-orange/20 transition-colors"
                >
                  <span>{dest.ctaText || 'Request Export Proposal'}</span>
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>

                <Link
                  href="/machineries"
                  className="inline-flex items-center px-5 py-3 text-sm font-bold text-slate-300 hover:text-white bg-navy-900 hover:bg-navy-800 border border-slate-700 rounded-lg transition-colors"
                >
                  <span>Browse Machinery Catalogue</span>
                </Link>
              </div>
            </div>

            {/* Quick Export Factcard */}
            <div className="lg:col-span-4 bg-navy-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Export Desk Specifications
                </span>
                <span className="text-xs font-mono font-bold text-brand-orange">Coimbatore, India</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Manufacturing Base</span>
                  <span className="text-white font-medium">Coimbatore, Tamil Nadu</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Target Destination</span>
                  <span className="text-white font-bold">{dest.countryName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Electrical Configuration</span>
                  <span className="text-white font-medium">380V – 415V, 50Hz, 3-Phase</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Motor Drive Standard</span>
                  <span className="text-white font-medium">Havells High-Torque Electric</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Knife Metallurgy</span>
                  <span className="text-white font-medium">Hardened EN41 Alloy Steel</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Contact Tanks</span>
                  <span className="text-white font-medium">SS 302 Stainless Steel</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Ocean Logistics</span>
                  <span className="text-white font-medium">FOB / CIF Container Dispatch</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`tel:${COMPANY_INFO.contact.phone.replace(/[^0-9+]/g, '')}`}
                  className="w-full inline-flex items-center justify-center space-x-2 py-2.5 bg-navy-950 hover:bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-slate-200 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-brand-orange" />
                  <span>Call Direct Factory Desk</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Recommended Machinery for this Destination */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Recommended Machinery Range</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered for Continuous Industrial Recycling in {dest.countryName}
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
            Our machinery is purpose-built to withstand challenging post-consumer scrap streams with minimal downtime, easily accessible wear components, and modular foot-printing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dest.recommendedMachinery.map((mach, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                  <Factory className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{mach.name}</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{mach.role}</p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <Link
                  href={`/machineries/${mach.slug}`}
                  className="inline-flex items-center text-xs font-bold text-brand-orange hover:text-orange-700 transition-colors"
                >
                  <span>View Specifications & Dimensions</span>
                  <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Target Material Badges */}
        {dest.targetMaterials && dest.targetMaterials.length > 0 && (
          <div className="mt-10 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Compatible Polymer Scrap Streams:
            </div>
            <div className="flex flex-wrap gap-2">
              {dest.targetMaterials.map((mat, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200"
                >
                  {mat}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. Direct Destination Inquiry Form */}
      <section id="destination-quote" className="py-16 sm:py-24 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Export Engineering Desk</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Request an Itemized Quotation for {dest.countryName}
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Connect directly with our engineering team in Coimbatore. Share your required capacity, available factory floor dimensions, and polymer waste streams for an itemized equipment quote, container layout drawings, and export shipping timelines.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-3 text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200">
                  <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
                  <span>
                    <strong>Direct Factory Dispatch:</strong> Coimbatore, Tamil Nadu &rarr; {dest.countryName}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Cold & Hot Trial Runs:</strong> Pre-dispatch material cutting inspection at Coimbatore workshop.
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8">
              <InquiryForm
                initialDestinationCountry={dest.countryName}
                initialDestinationId={dest.id}
                initialInquiryType="machinery_quotation"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Technical Insights & Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange block mb-1">
                Knowledge Centre
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Related Engineering Guides & Export Analysis
              </h3>
            </div>
            <Link
              href="/blog"
              className="text-xs font-bold text-brand-orange hover:underline inline-flex items-center"
            >
              <span>All Articles</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedBlogs.map((b) => (
              <Link
                key={b.id}
                href={`/blog/${b.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-2.5 py-0.5 rounded-full inline-block">
                    {b.category}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-brand-orange transition-colors">
                    {b.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{b.excerpt}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{b.readingTimeMinutes || 5} min read</span>
                  <span className="font-bold text-slate-700 group-hover:text-brand-orange inline-flex items-center">
                    Read Guide <ArrowRight className="w-3 h-3 ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

