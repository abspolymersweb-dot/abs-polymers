import React from 'react';
import type { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock, MessageSquare, Sparkles, ShieldCheck, Factory, Navigation, ExternalLink } from 'lucide-react';
import { dataService } from '@/services/dataService';
import { COMPANY_INFO } from '@/data/company';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const contactPage = await dataService.getPage('contact');
  return {
    title: contactPage?.seo?.metaTitle || 'Contact ABS Polymers | Factory Quotations & Technical Desk',
    description: contactPage?.seo?.metaDescription || 'Request an itemized price quotation for plastic recycling machinery or recycled granules. Direct WhatsApp, phone, and factory visits in Coimbatore.'
  };
}

export default async function ContactPage() {
  const [companyInfo, contactPageData] = await Promise.all([
    dataService.getCompanyInfo(),
    dataService.getPage('contact')
  ]);

  const sections = contactPageData?.sections || {};
  const hero = sections.hero || {
    title: 'Contact ABS Polymers',
    subtitle: 'Get in touch directly with our Coimbatore manufacturing facility or export sales office. Discuss trial runs, request machinery engineering specifications, or inquire regarding custom recycling lines.'
  };
  const contactDetails = sections.contactDetails || {};

  const phone = contactDetails.phone || companyInfo.contact.phone;
  const phoneDisplay = phone;
  const whatsapp = contactDetails.whatsapp || companyInfo.contact.whatsapp;
  const whatsappDisplay = whatsapp;
  const email = contactDetails.salesEmail || companyInfo.contact.salesEmail;
  const address = contactDetails.address || companyInfo.location.address;
  const workingHours = contactDetails.workingHours || companyInfo.contact.workingHours;
  const exportDesk = contactDetails.exportDesk || 'Official Export Partner to the UAE & Middle East';

  const cleanWhatsapp = whatsapp.replace(/\D/g, '');
  const cleanPhone = phone.replace(/\s+/g, '');

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white pt-28 pb-14 sm:pt-32 sm:pb-18 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Commercial Desk & Technical Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            {hero.title || 'Contact ABS Polymers'}
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            {hero.subtitle || 'Get in touch directly with our Coimbatore manufacturing facility or export sales office. Discuss trial runs, request machinery engineering specifications, or inquire regarding custom recycling lines.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Direct Channels */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
                Direct Engineering & Sales Channels
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Telephone */}
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 text-brand-orange flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Direct Telephone</div>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="text-base font-black text-slate-900 hover:text-brand-orange transition-colors block"
                  >
                    {phoneDisplay}
                  </a>
                  <div className="text-xs text-slate-500">Sales & Machinery Inquiries</div>
                </div>

                {/* WhatsApp */}
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp Live Chat</div>
                  <a
                    href={`https://wa.me/${cleanWhatsapp}?text=Hello%20ABS%20Polymers`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-black text-emerald-700 hover:underline block"
                  >
                    {whatsappDisplay}
                  </a>
                  <div className="text-xs text-slate-500">Fast response via chat</div>
                </div>

                {/* Sales Email */}
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 sm:col-span-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-navy-950 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Official Email</div>
                  <a
                    href={`mailto:${email}`}
                    className="text-base font-black text-slate-900 hover:text-brand-orange transition-colors block"
                  >
                    {email}
                  </a>
                  <div className="text-xs text-slate-500">Send technical requirements, tenders, and drawings</div>
                </div>
              </div>

              {/* Working Hours & Trial Runs */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-start text-sm">
                  <Clock className="w-5 h-5 text-brand-orange mr-3 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-bold">Factory Working Hours</strong>
                    <span className="text-slate-600">{workingHours} (Indian Standard Time)</span>
                  </div>
                </div>

                <div className="flex items-start text-sm">
                  <Factory className="w-5 h-5 text-brand-orange mr-3 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 font-bold">Factory Demonstrations & Trial Runs</strong>
                    <span className="text-slate-600">
                      Material test crushing and washing demonstrations can be scheduled at our Coimbatore workshop prior to machine procurement.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Factory Location & Export Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center">
                <MapPin className="w-5 h-5 text-brand-orange mr-2" />
                <span>Manufacturing Works & Office</span>
              </h3>

              <div className="text-sm text-slate-600 space-y-2">
                <div className="font-bold text-slate-900">{companyInfo.name || 'ABS Polymers Works'}</div>
                <p className="leading-relaxed">{address}</p>
                <p className="text-xs text-slate-500">Coimbatore, Tamil Nadu, India</p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-bold text-brand-orange hover:underline"
                >
                  <Navigation className="w-3.5 h-3.5 mr-1" />
                  <span>View on Google Maps</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>

            {/* UAE & Export Corridor Support */}
            <div className="bg-navy-950 rounded-2xl p-6 text-white border border-slate-800 space-y-3 shadow-md">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Export Packaging & Logistics</span>
              </div>
              <h3 className="text-base font-bold text-white">
                {exportDesk}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Containerized seaworthy packing, freight forwarding via Kochi / Tuticorin ports, documentation, and on-site factory engineer dispatch for installation and commissioning across the UAE and East Africa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
