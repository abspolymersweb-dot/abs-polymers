'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wrench, CheckCircle2, Eye, ArrowRight, RefreshCw } from 'lucide-react';
import { ServiceItem } from '@/types';

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.success) {
        setServices(data.services || []);
      }
    } catch (err) {
      console.error('Failed to load services from SQLite:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Services & Turnkey Plant Solutions Management
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-navy-950 text-white rounded-full">
              SQLite Persistent
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review published industrial services, process engineering steps, installation scopes, and genuine spare parts delivery.
          </p>
        </div>

        <button
          onClick={fetchServices}
          className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 transition-colors self-start sm:self-auto"
          title="Refresh from SQLite"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500">Loading services from SQLite...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
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
                    Process Stages ({service.processSteps?.length || 0} Steps)
                  </div>
                  {service.processSteps?.map((step: any) => (
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
      )}
    </div>
  );
}
