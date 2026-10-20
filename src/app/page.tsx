import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import FeatureBar from '@/components/home/FeatureBar';
import MachineryGrid from '@/components/home/MachineryGrid';
import FeaturedCompactPlant from '@/components/home/FeaturedCompactPlant';
import RecyclingProcess from '@/components/home/RecyclingProcess';
import WhyChooseAndGlobalReach from '@/components/home/WhyChooseAndGlobalReach';
import GranulesPreview from '@/components/home/GranulesPreview';
import BlogPreview from '@/components/home/BlogPreview';
import InquiryForm from '@/components/common/InquiryForm';
import { Sparkles, Phone, MessageSquare, Mail } from 'lucide-react';
import { COMPANY_INFO } from '@/data/company';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section with replaceable artwork & 10 FT compact highlight */}
      <HeroSection />

      {/* 2. Micro Feature Strip */}
      <FeatureBar />

      {/* 3. Machinery Category Previews */}
      <MachineryGrid />

      {/* 4. Featured Product: Compact Plastic Washing Machine */}
      <FeaturedCompactPlant />

      {/* 5. How It Works: Plastic Recycling Process */}
      <RecyclingProcess />

      {/* 6. Why Choose ABS Polymers & Global Reach (India + UAE) */}
      <WhyChooseAndGlobalReach />

      {/* 7. Granules Previews */}
      <GranulesPreview />

      {/* 8. Blog & Knowledge Center Previews */}
      <BlogPreview />

      {/* 9. Final Quotation & Direct Engineering Inquiry Section */}
      <section id="quote-section" className="py-16 sm:py-24 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
                  Direct Factory Inquiry
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
                  Request a Machinery or Granules Quotation
                </h2>
                <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                  Our Coimbatore technical desk works directly with recyclers across India and international buyers in the UAE. Tell us about your plastic scrap or capacity targets to receive an itemized technical proposal.
                </p>
              </div>

              {/* Direct channels */}
              <div className="space-y-3 pt-2">
                <a
                  href={`tel:${COMPANY_INFO.contact.phone}`}
                  className="flex items-center p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-brand-orange transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-orange-50 text-brand-orange flex items-center justify-center mr-3 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Direct Sales Desk</div>
                    <div className="text-sm font-bold text-slate-900">{COMPANY_INFO.contact.phoneDisplay}</div>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${COMPANY_INFO.contact.whatsapp.replace(/\D/g, '')}?text=Hello%20ABS%20Polymers,%20I%20would%20like%20to%20request%20a%20quotation.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-500 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mr-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Instant WhatsApp Chat</div>
                    <div className="text-sm font-bold text-slate-900">{COMPANY_INFO.contact.whatsappDisplay}</div>
                  </div>
                </a>

                <a
                  href={`mailto:${COMPANY_INFO.contact.salesEmail}`}
                  className="flex items-center p-4 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-brand-orange transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#04294a] flex items-center justify-center mr-3 group-hover:bg-[#04294a] group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Commercial Tender & RFQ</div>
                    <div className="text-sm font-bold text-slate-900">{COMPANY_INFO.contact.salesEmail}</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              <InquiryForm initialInquiryType="machinery_quotation" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
