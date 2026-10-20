'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, Clock, MessageSquare, ArrowRight, Shield, ExternalLink } from 'lucide-react';
import { COMPANY_INFO } from '@/data/company';

export default function Footer() {
  const pathname = usePathname();

  // If in admin area, do not show the public footer
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-slate-800">
      {/* Pre-footer Call to Action Banner */}
      <div className="bg-navy-900 border-b border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider uppercase text-brand-orange bg-brand-orange/10 rounded-full mb-3">
              Direct Engineering Consultation
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Let&apos;s Build a Cleaner, Greener Future Together.
            </h3>
            <p className="mt-2 text-slate-400 text-sm sm:text-base">
              Discuss your recycling throughput requirements, get itemized pricing on our 10 FT compact washing plants, or request certified recycled granule samples.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/contact?intent=quote"
              className="inline-flex items-center px-6 py-3.5 text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-md shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>Request a Quote</span>
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <a
              href={`https://wa.me/${COMPANY_INFO.contact.whatsapp.replace(/\D/g, '')}?text=Hello%20ABS%20Polymers,%20I%20am%20interested%20in%20your%20plastic%20recycling%20machinery.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow transition-colors"
            >
              <MessageSquare className="mr-2 w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
            <a
              href={`tel:${COMPANY_INFO.contact.phone}`}
              className="inline-flex items-center px-5 py-3.5 text-sm font-bold text-slate-200 bg-navy-850 hover:bg-navy-800 border border-slate-700 rounded-md transition-colors"
            >
              <Phone className="mr-2 w-4 h-4 text-brand-orange" />
              <span>Call Factory</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main footer directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Corporate Overview */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block">
              <div className="relative h-12 w-48 bg-white/90 p-2 rounded-lg">
                <Image
                  src="/images/logo.png"
                  alt="ABS Polymers Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              ABS Polymers is a premier plastic recycling machinery manufacturer and granules specialist based in Coimbatore, Tamil Nadu, India. Powered by 35+ years of polymer granule materials mastery and 6+ years of precision machine engineering.
            </p>
            <div className="flex flex-col space-y-2 text-xs text-slate-400">
              <div className="flex items-center text-slate-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2"></span>
                Official Export Partner to the UAE & Middle East
              </div>
              <div>Headquarters & Manufacturing: Coimbatore, Tamil Nadu, India</div>
            </div>
          </div>

          {/* Quick Machinery Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Machinery
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/machineries/absw-plastic-washing-plant" className="hover:text-brand-orange transition-colors">
                  ABSW Washing Plants (10 FT Compact)
                </Link>
              </li>
              <li>
                <Link href="/machineries/g-series-plastic-crusher-machine" className="hover:text-brand-orange transition-colors">
                  G Series Crushers & Granulators
                </Link>
              </li>
              <li>
                <Link href="/machineries/cr-series-screw-conveyor" className="hover:text-brand-orange transition-colors">
                  CR Series Screw Conveyors
                </Link>
              </li>
              <li>
                <Link href="/machineries/mtb-material-transport-blower" className="hover:text-brand-orange transition-colors">
                  MTB Material Transport Blowers
                </Link>
              </li>
              <li>
                <Link href="/machineries" className="text-brand-orange font-semibold hover:underline inline-flex items-center">
                  <span>View All 4 Categories</span>
                  <ArrowRight className="ml-1 w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Granules & Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Granules & Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/granules" className="hover:text-brand-orange transition-colors">
                  HDPE Recycled Granules
                </Link>
              </li>
              <li>
                <Link href="/granules" className="hover:text-brand-orange transition-colors">
                  PP & LDPE Reprocessed Granules
                </Link>
              </li>
              <li>
                <Link href="/granules" className="hover:text-brand-orange transition-colors">
                  ABS & HIPS Engineering Polymers
                </Link>
              </li>
              <li>
                <Link href="/services/complete-plastic-recycling-plant-solutions" className="hover:text-brand-orange transition-colors">
                  Turnkey Recycling Plants
                </Link>
              </li>
              <li>
                <Link href="/services/installation-and-commissioning" className="hover:text-brand-orange transition-colors">
                  Installation & Commissioning
                </Link>
              </li>
              <li>
                <Link href="/services/genuine-spare-parts-and-components" className="hover:text-brand-orange transition-colors">
                  EN41 Blades & Spare Parts
                </Link>
              </li>
            </ul>
          </div>

          {/* Factory Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Factory & Sales
            </h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-brand-orange mr-2.5 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.location.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-brand-orange mr-2.5 shrink-0" />
                <a href={`tel:${COMPANY_INFO.contact.phone}`} className="hover:text-white transition-colors">
                  {COMPANY_INFO.contact.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-brand-orange mr-2.5 shrink-0" />
                <a href={`mailto:${COMPANY_INFO.contact.salesEmail}`} className="hover:text-white transition-colors">
                  {COMPANY_INFO.contact.salesEmail}
                </a>
              </div>
              <div className="flex items-start">
                <Clock className="w-4 h-4 text-brand-orange mr-2.5 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.contact.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright and legal */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} ABS Polymers. All rights reserved. Coimbatore, Tamil Nadu, India.</p>
          <div className="flex items-center space-x-6">
            <Link href="/about" className="hover:text-slate-300">About ABS</Link>
            <Link href="/machineries" className="hover:text-slate-300">Machinery Datasheets</Link>
            <Link href="/blog" className="hover:text-slate-300">Knowledge Centre</Link>
            <Link href="/contact" className="hover:text-slate-300">Inquire</Link>
            <Link href="/admin" className="text-slate-400 hover:text-white flex items-center">
              <Shield className="w-3 h-3 mr-1 text-emerald-400" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
