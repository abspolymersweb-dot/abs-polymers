'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Phone, Mail, MapPin, Clock, MessageSquare, Sparkles, Building, ShieldCheck } from 'lucide-react';
import { COMPANY_INFO } from '@/data/company';
import InquiryForm from '@/components/common/InquiryForm';

function ContactContent() {
  const searchParams = useSearchParams();
  const intent = searchParams.get('intent') || 'machinery_quotation';
  const product = searchParams.get('product') || '';
  const model = searchParams.get('model') || '';
  const part = searchParams.get('part') || '';

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Commercial Desk & Technical Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Contact ABS Polymers
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Get in touch with our Coimbatore factory engineering desk or export sales office. Request itemized price quotations, book trial runs, or discuss custom plastic recycling machinery configurations.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Factory Contacts */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
                Factory & Head Office
              </h2>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-brand-orange mr-3 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Registered Office & Works</strong>
                    <span>{COMPANY_INFO.location.address}</span>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-brand-orange mr-3 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Direct Telephone</strong>
                    <a href={`tel:${COMPANY_INFO.contact.phone}`} className="hover:text-brand-orange text-slate-800 font-semibold">
                      {COMPANY_INFO.contact.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <MessageSquare className="w-5 h-5 text-emerald-600 mr-3 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Instant WhatsApp Support</strong>
                    <a
                      href={`https://wa.me/${COMPANY_INFO.contact.whatsapp.replace(/\D/g, '')}?text=Hello%20ABS%20Polymers`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-emerald-700 font-semibold"
                    >
                      {COMPANY_INFO.contact.whatsappDisplay} (Live Chat)
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-brand-orange mr-3 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Sales & Quotations Email</strong>
                    <a href={`mailto:${COMPANY_INFO.contact.salesEmail}`} className="hover:text-brand-orange text-slate-800 font-semibold">
                      {COMPANY_INFO.contact.salesEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-brand-orange mr-3 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Factory Operating Hours</strong>
                    <span>{COMPANY_INFO.contact.workingHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Notice */}
            <div className="bg-navy-900 rounded-2xl p-6 text-white border border-slate-700 space-y-3 shadow-md">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>UAE & GCC Export Despatch</span>
              </div>
              <h3 className="text-base font-bold text-white">
                Supplying UAE Recyclers
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We handle sea freight documentation, containerized machinery packing, Jebel Ali customs clearance support, and dispatch factory engineers for international on-site commissioning.
              </p>
            </div>
          </div>

          {/* Right Column: Quotation Form */}
          <div className="lg:col-span-7">
            <div className="mb-4">
              <h2 className="text-2xl font-black text-slate-900">
                Request an Itemized Quotation
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill in your project requirements below. Forms are processed in real-time by our sales engineering team.
              </p>
            </div>

            <InquiryForm
              initialProductId={product}
              initialInquiryType={intent}
              initialModel={model}
              initialPart={part}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading Contact Workspace...</div>}>
      <ContactContent />
    </Suspense>
  );
}
