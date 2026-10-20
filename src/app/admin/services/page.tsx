'use client';

import React from 'react';
import Link from 'next/link';
import { Wrench, CheckCircle2, Eye, ArrowRight } from 'lucide-react';
import { SERVICES_DATA } from '@/data/services';

export default function AdminServicesPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Services & Turnkey Plant Solutions Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review published industrial services, process engineering steps, installation scopes, and genuine spare parts delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SERVICES_DATA.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-brand-orange uppercase bg-orange-50 px-2.5 py-1 rounded">
                Verified Industrial Service
              </span>
              <h2 className="text-lg font-bold text-slate-900">{service.title}</h2>
              <p className="text-xs text-slate-600 leading-relaxed">{service.shortDescription}</p>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2 text-xs">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Process Stages ({service.processSteps.length} Steps)
                </div>
                {service.processSteps.map((step) => (
                  <div key={step.step} className="flex items-start text-slate-600">
                    <span className="w-4 h-4 rounded-full bg-[#04294a] text-white text-[10px] font-bold flex items-center justify-center mr-2 shrink-0 mt-0.5">
                      {step.step}
                    </span>
                    <span><strong>{step.title}:</strong> {step.description}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                href={`/services/${service.slug}`}
                target="_blank"
                className="inline-flex items-center text-xs font-bold text-slate-700 hover:text-brand-orange"
              >
                <Eye className="w-3.5 h-3.5 mr-1" />
                Preview Public Service Page
              </Link>
              <Link
                href={`/contact?intent=service&product=${service.id}`}
                className="text-xs font-bold text-brand-orange hover:underline"
              >
                Inquiry Route →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
