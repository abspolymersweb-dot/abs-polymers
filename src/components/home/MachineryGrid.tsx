import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { MACHINERY_CATEGORIES } from '@/data/machinery';

export default function MachineryGrid() {
  const categories = [
    {
      id: 'washing-plants',
      title: 'Plastic Washing Plants',
      slug: 'absw-plastic-washing-plant',
      desc: 'Efficient 10 FT washing solutions for clean plastic flakes with water recycling.',
      tag: 'ABSW Series (W250–W5000)',
      image: '/images/hero-reference.jpg'
    },
    {
      id: 'shredders',
      title: 'Plastic Shredders',
      slug: 'absw-plastic-washing-plant#shredders',
      desc: 'Heavy-duty pre-cutting shredders for bulk drums, pipes, and rigid plastic scrap.',
      tag: 'Single & Twin Shaft',
      image: '/images/hero-reference.jpg'
    },
    {
      id: 'crushers',
      title: 'Plastic Crushers / Granulators',
      slug: 'g-series-plastic-crusher-machine',
      desc: 'Reliable size reduction with EN41 steel blades, Havells motors & 480 RPM.',
      tag: 'G Series (G250–G2000)',
      image: '/images/hero-reference.jpg'
    },
    {
      id: 'conveyors',
      title: 'Screw Conveyors',
      slug: 'cr-series-screw-conveyor',
      desc: 'Sturdy continuous bulk material transport with 5400 mm length and 55–105 RPM.',
      tag: 'CR Series (CR250–CR2000)',
      image: '/images/hero-reference.jpg'
    },
    {
      id: 'blowers',
      title: 'Material Transport Blowers',
      slug: 'mtb-material-transport-blower',
      desc: 'Pneumatic conveying of flakes & granules with 2880 RPM Havells drive.',
      tag: 'MTB Series (MTB250–MTB2000)',
      image: '/images/hero-reference.jpg'
    },
    {
      id: 'pelletizing',
      title: 'Pelletizing & Agglomerators',
      slug: 'absw-plastic-washing-plant#pelletizing',
      desc: 'High-quality compounding extruders and densifiers for film and flakes.',
      tag: 'Turnkey Recycling Lines',
      image: '/images/hero-reference.jpg'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-brand-orange uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Machinery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Complete Range of Plastic Recycling Machinery
            </h2>
            <p className="mt-3 text-slate-600 max-w-2xl text-sm sm:text-base">
              From individual high-capacity size reduction units to continuous compact washing lines, ABS Polymers manufactures reliable, efficient, and customized machinery for your recycling operations.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/machineries"
              className="inline-flex items-center text-sm font-bold text-[#04294a] hover:text-brand-orange transition-colors group"
            >
              <span>View All Machinery</span>
              <ArrowRight className="ml-1.5 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
            >
              {/* Product Visual Container */}
              <div className="relative h-48 sm:h-52 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-[#04294a]/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded">
                  {cat.tag}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-orange transition-colors">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/machineries/${cat.slug}`}
                    className="inline-flex items-center text-xs sm:text-sm font-bold text-brand-orange hover:text-brand-orange-hover"
                  >
                    <span>View Details</span>
                    <ArrowRight className="ml-1 w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <Link
                    href={`/contact?intent=quote&product=${cat.id}`}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    Quick Quote
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
