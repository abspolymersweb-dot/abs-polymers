import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Globe, ArrowRight, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { dataService } from '@/services/dataService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DestinationsPage() {
  const allDestinations = await dataService.getDestinations(undefined, true);
  const destinations = allDestinations || [];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white pt-28 pb-14 sm:pt-32 sm:pb-18 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>International Trade Corridors</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Global Export Destinations
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Supplying heavy-duty plastic recycling machinery and turnkey washing plants from Coimbatore, India, to recyclers across the UAE, GCC, Africa, and Latin America.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest: any) => (
            <div
              key={dest.id || dest.slug}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="relative h-48 w-full bg-slate-900">
                  <Image
                    src={dest.heroImage || '/images/products/machines-collage.jpg'}
                    alt={dest.countryName}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-navy-950/90 text-white text-xs font-bold px-3 py-1 rounded shadow">
                      {dest.region}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-orange transition-colors">
                    {dest.countryName}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {dest.introContent}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href={`/destinations/${dest.slug}`}
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-navy-950 bg-slate-100 hover:bg-brand-orange hover:text-white rounded-lg transition-colors group/btn"
                >
                  <span>Explore {dest.countryName} Market Details</span>
                  <ArrowRight className="ml-1.5 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

