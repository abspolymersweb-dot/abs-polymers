'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight, Factory, Wrench, Settings, ShieldCheck, Headphones, Layers, Sparkles } from 'lucide-react';

interface ServiceCard {
  id: string;
  slug: string;
  title: string;
  desc: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SERVICES: ServiceCard[] = [
  {
    id: 'turnkey-plants',
    slug: 'complete-plastic-recycling-plant-solutions',
    title: 'Complete Recycling Plant Solutions',
    desc: 'Turnkey recycling plants engineered for your waste stream (rigid containers, drums, or films) with space-efficient 10 FT compact washing layouts.',
    tag: 'Turnkey Solutions',
    icon: Factory,
  },
  {
    id: 'custom-design',
    slug: 'custom-machinery-design-and-engineering',
    title: 'Custom Machinery Design',
    desc: 'Bespoke machinery modifications including custom conveyor lengths, specialized cutting hoppers, and heating configurations tailored to your factory.',
    tag: 'Tailored Engineering',
    icon: Settings,
  },
  {
    id: 'installation-commissioning',
    slug: 'installation-and-commissioning',
    title: 'Installation & Commissioning',
    desc: 'Factory-supervised on-site mechanical erection, 380V/415V electrical wiring of Havells motors, cold/hot washing trials, and operator handover.',
    tag: 'On-Site Deployment',
    icon: Wrench,
  },
  {
    id: 'spare-parts',
    slug: 'genuine-spare-parts-and-components',
    title: 'Spare Parts & Components',
    desc: 'Ready inventory of precision-ground EN41 alloy knives, conveyor flights, screen barrels, Havells motor starters, and water seals dispatched rapidly.',
    tag: 'Genuine Spares',
    icon: ShieldCheck,
  },
  {
    id: 'maintenance-support',
    slug: 'maintenance-and-after-sales-support',
    title: 'Maintenance & After-Sales Support',
    desc: 'Preventive maintenance scheduling, blade sharpening guidance, and dedicated technical helpdesk support based at our Coimbatore plant.',
    tag: 'Lifecycle Service',
    icon: Headphones,
  },
  {
    id: 'technical-consultation',
    slug: 'complete-plastic-recycling-plant-solutions',
    title: 'Technical Consultation',
    desc: 'Expert guidance on polymer sorting efficiency, wash water effluent reduction, power optimization, and recycling profitability benchmarks.',
    tag: 'Advisory & Feasibility',
    icon: Layers,
  },
];

export default function ServicesSection() {
  const shouldReduceMotion = useReducedMotion();

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: shouldReduceMotion ? 0 : i * 0.08,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <section id="services" className="py-20 sm:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-brand-orange uppercase tracking-wider mb-3 px-3 py-1 bg-brand-orange/10 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Lifecycle Industrial Support</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Recycling Plant Solutions & Services
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
              From facility design and customized machine manufacturing to on-site commissioning across India and the UAE, ABS Polymers delivers comprehensive technical support.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/services"
              className="inline-flex items-center text-sm font-bold text-navy-900 hover:text-brand-orange transition-colors group"
            >
              <span>Explore All Engineering Services</span>
              <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <motion.div
                key={srv.id}
                custom={idx}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:border-slate-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-navy-900 group-hover:bg-brand-orange group-hover:text-white transition-colors duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      {srv.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-orange transition-colors">
                    <Link href={`/services/${srv.slug}`}>
                      {srv.title}
                    </Link>
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/services/${srv.slug}`}
                    className="inline-flex items-center text-xs sm:text-sm font-bold text-brand-orange hover:text-brand-orange-hover"
                  >
                    <span>Service Scope</span>
                    <ArrowRight className="ml-1 w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <Link
                    href={`/contact?intent=service&service=${srv.id}`}
                    className="text-xs text-slate-500 hover:text-navy-900 font-semibold"
                  >
                    Inquire
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Spare Parts & Machinery Showcase Visual Strip */}
        <div className="mt-12 bg-navy-950 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 p-6 sm:p-10 space-y-4">
              <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/15 rounded-full border border-brand-orange/30">
                Factory Assembly & Spare Parts
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Precision EN41 Blades & Genuine Spares Dispatched Direct
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
                Keep your plant operating at peak capacity with genuine replacement knives, Havells heavy-duty motor spares, and dynamic-balanced rotors machined directly in our Coimbatore works.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/services/genuine-spare-parts-and-components"
                  className="inline-flex items-center px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Order Replacement Knives & Parts
                  <ArrowRight className="ml-1.5 w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-4 py-2.5 bg-navy-850 hover:bg-navy-800 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
                >
                  Consult Factory Engineer
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-64 lg:h-full min-h-[240px] bg-navy-900">
              <Image
                src="/images/products/machines-collage.jpg"
                alt="ABS Polymers machinery assembly and spare components"
                fill
                className="object-cover object-center filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-navy-950 via-transparent to-transparent opacity-80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
