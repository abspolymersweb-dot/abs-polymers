import React from 'react';
import ScrollVideoHero from '@/components/home/ScrollVideoHero';
import FeatureBar from '@/components/home/FeatureBar';
import MachineryGrid from '@/components/home/MachineryGrid';
import FeaturedCompactPlant from '@/components/home/FeaturedCompactPlant';
import RecyclingProcess from '@/components/home/RecyclingProcess';
import GranulesPreview from '@/components/home/GranulesPreview';
import ServicesSection from '@/components/home/ServicesSection';
import WhyChooseAndGlobalReach from '@/components/home/WhyChooseAndGlobalReach';
import { Phone, MessageSquare, Mail, Sparkles, ShieldCheck, MapPin, Clock, ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '@/data/company';
import { getCmsStore } from '@/services/cmsService';
import Link from 'next/link';

export default function HomePage() {
  const cmsStore = getCmsStore();
  const homeSections = cmsStore?.pages?.home?.sections || {};

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Cinematic Scroll-Controlled Video Hero */}
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

      {/* 9. Direct Factory Engineering & Commercial Desk */}
      <section id="contact-desk" className="py-20 sm:py-28 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full border border-brand-orange/20">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Direct Factory Engineering Desk
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                  Connect Directly with Our Coimbatore Works
                </h2>
                <p className="text-slate-600 text-base leading-relaxed">
                  Our engineering team in Coimbatore works directly with industrial recyclers across India and international buyers in the UAE. Get verified technical datasheets, machine power schedules, or discuss custom configurations.
                </p>

                <div className="pt-2 flex flex-wrap gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-6 py-3.5 text-sm font-bold text-white bg-brand-orange hover:bg-orange-600 rounded-xl shadow-md transition-colors"
                  >
                    <span>Full Contact Details</span>
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                  <a
                    href={`tel:${COMPANY_INFO.contact.phone}`}
                    className="inline-flex items-center px-6 py-3.5 text-sm font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl transition-colors"
                  >
                    <Phone className="mr-2 w-4 h-4 text-brand-orange" />
                    <span>{COMPANY_INFO.contact.phoneDisplay}</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Direct Telephone</div>
                  <div className="text-sm font-black text-slate-900">{COMPANY_INFO.contact.phoneDisplay}</div>
                  <div className="text-xs text-slate-500">Mon–Sat: 09:00 to 18:30</div>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase">WhatsApp Live Chat</div>
                  <a
                    href={`https://wa.me/${COMPANY_INFO.contact.whatsapp.replace(/\D/g, '')}?text=Hello%20ABS%20Polymers`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-black text-emerald-700 hover:underline block"
                  >
                    {COMPANY_INFO.contact.whatsappDisplay}
                  </a>
                  <div className="text-xs text-slate-500">Fast response on WhatsApp</div>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-navy-950 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Sales & Export Email</div>
                  <div className="text-sm font-black text-slate-900 break-all">{COMPANY_INFO.contact.salesEmail}</div>
                  <div className="text-xs text-slate-500">Engineering proposals</div>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Works Location</div>
                  <div className="text-sm font-black text-slate-900">Coimbatore, India</div>
                  <div className="text-xs text-slate-500">Tamil Nadu, 641006</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
