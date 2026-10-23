import React from 'react';
import ScrollVideoHero from '@/components/home/ScrollVideoHero';
import FeatureBar from '@/components/home/FeatureBar';
import MachineryGrid from '@/components/home/MachineryGrid';
import FeaturedCompactPlant from '@/components/home/FeaturedCompactPlant';
import RecyclingProcess from '@/components/home/RecyclingProcess';
import GranulesPreview from '@/components/home/GranulesPreview';
import ServicesSection from '@/components/home/ServicesSection';
import WhyChooseAndGlobalReach from '@/components/home/WhyChooseAndGlobalReach';
import BlogPreview from '@/components/home/BlogPreview';
import InquiryForm from '@/components/common/InquiryForm';
import { Phone, MessageSquare, Mail, Sparkles, ShieldCheck } from 'lucide-react';
import { COMPANY_INFO } from '@/data/company';
import { getCmsStore } from '@/services/cmsService';

export default function HomePage() {
  const cmsStore = getCmsStore();
  const homeSections = cmsStore?.pages?.home?.sections || {};

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Cinematic Scroll-Controlled Video Hero (Using Real Flow Footage) */}
      <ScrollVideoHero customHero={homeSections.hero} />

      {/* 2. Micro Industrial Highlight Strip */}
      <FeatureBar />

      {/* 3. Core Machinery Showcase (Washing, Crushers, Conveyors, Blowers) */}
      <MachineryGrid />

      {/* 4. Flagship Spotlight: 10 FT Compact Washing Plant */}
      <FeaturedCompactPlant />

      {/* 5. Interactive 5-Stage Recycling Workflow */}
      <RecyclingProcess />

      {/* 6. Recycled Granules Section (35+ Years Heritage) */}
      <GranulesPreview />

      {/* 7. Turnkey Engineering & Lifecycle Services */}
      <ServicesSection />

      {/* 8. Industrial Heritage & Global Reach (Coimbatore + UAE) */}
      <WhyChooseAndGlobalReach />

      {/* 9. Engineering Insights & Technical Knowledge */}
      <BlogPreview />

      {/* 10. Direct Factory Quotation Section */}
      <section id="quote-section" className="py-20 sm:py-28 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full mb-3">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Direct Factory Engineering Desk
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Request an Itemized Machinery Quotation
                </h2>
                <p className="mt-3 text-slate-600 text-base leading-relaxed">
                  Our engineering desk in Coimbatore works directly with recyclers across India and international buyers in the UAE. Share your polymer scrap type, floor layout dimensions, or target hourly capacity for a detailed technical proposal.
                </p>
              </div>

              {/* Direct channels */}
              <div className="space-y-3 pt-2">
                <a
                  href={`tel:${COMPANY_INFO.contact.phone}`}
                  className="flex items-center p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-brand-orange transition-colors group"
                >
                  <div className="w-11 h-11 rounded-lg bg-orange-50 text-brand-orange flex items-center justify-center mr-3 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Direct Engineering Desk</div>
                    <div className="text-sm font-bold text-slate-900">{COMPANY_INFO.contact.phoneDisplay}</div>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${COMPANY_INFO.contact.whatsapp.replace(/\D/g, '')}?text=Hello%20ABS%20Polymers,%20I%20would%20like%20to%20request%20a%20machinery%20quotation.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 transition-colors group"
                >
                  <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">WhatsApp Factory Chat</div>
                    <div className="text-sm font-bold text-slate-900">{COMPANY_INFO.contact.whatsappDisplay}</div>
                  </div>
                </a>

                <a
                  href={`mailto:${COMPANY_INFO.contact.salesEmail}`}
                  className="flex items-center p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-brand-orange transition-colors group"
                >
                  <div className="w-11 h-11 rounded-lg bg-blue-50 text-navy-900 flex items-center justify-center mr-3 group-hover:bg-navy-900 group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Tender & Commercial RFQ</div>
                    <div className="text-sm font-bold text-slate-900">{COMPANY_INFO.contact.salesEmail}</div>
                  </div>
                </a>
              </div>

              <div className="p-4 bg-white/70 rounded-xl border border-slate-200/80 text-xs text-slate-500 space-y-1">
                <div className="font-bold text-slate-700 flex items-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5" />
                  Verified Response Policy
                </div>
                <div>All quotations include complete electrical power schedules, SS 302 metallurgy specifications, and layout footprints.</div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900">Online Quotation Request</h3>
                <p className="text-xs text-slate-500 mt-1">Fill out your parameters to receive an engineering response within 24 working hours.</p>
              </div>
              <InquiryForm initialInquiryType="machinery_quotation" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
