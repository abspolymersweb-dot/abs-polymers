'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, CheckCircle2, AlertCircle, Phone, MessageSquare, Info, ShieldCheck } from 'lucide-react';
import { MACHINERY_PRODUCTS } from '@/data/machinery';
import { GRANULE_PRODUCTS } from '@/data/granules';
import { COMPANY_INFO } from '@/data/company';

export type InquiryType = 'machinery_quotation' | 'plant_turnkey' | 'granules_quotation' | 'spare_parts';

interface InquiryFormProps {
  initialProductId?: string;
  initialProductName?: string;
  initialInquiryType?: string;
  initialModel?: string;
  initialPart?: string;
  initialDestinationCountry?: string;
  initialDestinationId?: string;
}

function InquiryFormInner({
  initialProductId = '',
  initialProductName = '',
  initialInquiryType = 'machinery_quotation',
  initialModel = '',
  initialPart = '',
  initialDestinationCountry = '',
  initialDestinationId = ''
}: InquiryFormProps) {
  const searchParams = useSearchParams();

  // Determine initial inquiry type and destination from props or URL query
  const queryIntent = searchParams?.get('intent') || '';
  const queryProduct = searchParams?.get('product') || initialProductId;
  const queryModel = searchParams?.get('model') || initialModel;
  const queryPart = searchParams?.get('part') || initialPart;
  const queryQty = searchParams?.get('quantity') || '';
  const queryCountryParam = searchParams?.get('country') || initialDestinationCountry;
  const destinationId = searchParams?.get('destinationId') || initialDestinationId;

  // Resolve nice country name from query param if shortcode
  const resolveCountryName = (c: string) => {
    if (!c) return 'India';
    const lower = c.toLowerCase();
    if (lower === 'uae') return 'United Arab Emirates (UAE)';
    if (lower === 'kenya') return 'Kenya';
    if (lower === 'nigeria') return 'Nigeria';
    if (lower === 'mexico') return 'Mexico';
    if (lower === 'tanzania') return 'Tanzania';
    if (lower === 'angola') return 'Angola';
    if (lower === 'zambia') return 'Zambia';
    if (lower === 'mozambique') return 'Mozambique';
    return c;
  };

  const resolveInquiryType = (): InquiryType => {
    if (queryIntent === 'granules' || queryIntent === 'granule_sample' || initialInquiryType === 'granules_quotation') {
      return 'granules_quotation';
    }
    if (queryIntent === 'spare_parts' || queryIntent === 'service_parts' || queryIntent === 'spares' || initialInquiryType === 'spare_parts') {
      return 'spare_parts';
    }
    if (queryIntent === 'plant' || queryIntent === 'turnkey' || initialInquiryType === 'plant_turnkey') {
      return 'plant_turnkey';
    }
    return 'machinery_quotation';
  };

  const [inquiryType, setInquiryType] = useState<InquiryType>(resolveInquiryType());
  const [selectedProduct, setSelectedProduct] = useState<string>(queryProduct);
  const [selectedModel, setSelectedModel] = useState<string>(queryModel);
  const [selectedPart, setSelectedPart] = useState<string>(
    queryPart || (inquiryType === 'spare_parts' ? 'Replacement Knife Parts (EN41 Alloy Steel)' : '')
  );
  const [waNumber, setWaNumber] = useState(COMPANY_INFO.contact.whatsapp);

  useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.settings?.whatsapp) {
          setWaNumber(d.settings.whatsapp);
        }
      })
      .catch(() => {});
  }, []);
  const [orderVolume, setOrderVolume] = useState<string>(queryQty || '1,000 kg (1 Metric Ton)');
  const [granuleApplication, setGranuleApplication] = useState<string>('Blow Moulding / Extrusion');
  const [materialToRecycle, setMaterialToRecycle] = useState<string>('HDPE Rigid Scrap (Bottles & Drums)');
  const [capacityNeeded, setCapacityNeeded] = useState<string>('500 kg/hr');
  const [plantFloorArea, setPlantFloorArea] = useState<string>('Standard Factory Shed (30×40 ft)');

  // Contact info
  const [fullName, setFullName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [country, setCountry] = useState<string>(resolveCountryName(queryCountryParam));
  const [destinationCountry, setDestinationCountry] = useState<string>(resolveCountryName(queryCountryParam));
  const [message, setMessage] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);

  // Sync state if URL search parameters change
  useEffect(() => {
    if (queryIntent) {
      if (queryIntent === 'granules' || queryIntent === 'granule_sample') {
        setInquiryType('granules_quotation');
      } else if (queryIntent === 'spare_parts' || queryIntent === 'service_parts') {
        setInquiryType('spare_parts');
      } else if (queryIntent === 'plant' || queryIntent === 'turnkey') {
        setInquiryType('plant_turnkey');
      } else {
        setInquiryType('machinery_quotation');
      }
    }
    if (queryProduct) {
      setSelectedProduct(queryProduct);
    }
    if (queryModel) {
      setSelectedModel(queryModel);
    }
    if (queryPart) {
      setSelectedPart(queryPart);
    }
  }, [queryIntent, queryProduct, queryModel, queryPart]);

  // Find active machine or granule details
  const activeMachine = MACHINERY_PRODUCTS.find(
    (m) => m.id === selectedProduct || m.slug === selectedProduct
  );
  const activeGranule = GRANULE_PRODUCTS.find(
    (g) => g.id === selectedProduct || g.slug === selectedProduct
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full contact name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid business email address.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please provide a direct telephone or WhatsApp number with country code.');
      return;
    }

    setLoading(true);

    try {
      let resolvedProductName = '';
      if (inquiryType === 'machinery_quotation') {
        resolvedProductName = activeMachine?.name || initialProductName || 'Machinery Quotation';
      } else if (inquiryType === 'granules_quotation') {
        resolvedProductName = activeGranule?.name || initialProductName || 'Recycled Polymer Granules';
      } else if (inquiryType === 'spare_parts') {
        resolvedProductName = `${selectedPart || 'Replacement Knife Parts'} for ${activeMachine?.name || 'Recycling Machine'}`;
      } else {
        resolvedProductName = 'Complete Turnkey Plastic Recycling Plant';
      }

      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          companyName: companyName || 'Individual Recycler',
          email,
          phone,
          country,
          destinationCountry: destinationCountry || country,
          destinationId: destinationId || '',
          inquiryType,
          productId: selectedProduct || activeMachine?.id || activeGranule?.id || '',
          productName: resolvedProductName,
          modelSelected: inquiryType === 'machinery_quotation' ? selectedModel : '',
          estimatedCapacityNeeded: inquiryType === 'machinery_quotation' || inquiryType === 'plant_turnkey' ? capacityNeeded : '',
          materialToRecycle: inquiryType === 'granules_quotation' ? granuleApplication : materialToRecycle,
          orderVolume: inquiryType === 'granules_quotation' || inquiryType === 'spare_parts' ? orderVolume : '',
          sparePartCategory: inquiryType === 'spare_parts' ? selectedPart : '',
          message
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry. Please try again.');
      }

      setSubmittedInquiryId(data.inquiry?.id || 'SUBMITTED');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('An unexpected error occurred. Please contact our technical desk directly via WhatsApp.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (submittedInquiryId) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-emerald-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Quotation Ref: {submittedInquiryId}
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-3">
            Inquiry Successfully Received
          </h3>
          <p className="mt-2 text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
            Thank you, <strong className="text-slate-900">{fullName}</strong>. Your enquiry has been routed directly to our Coimbatore sales engineering desk. We prepare customized price schedules, technical layouts, and freight quotations within 24 working hours.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap justify-center gap-3">
          <a
            href={`https://wa.me/${waNumber.replace(/\D/g, '')}?text=Hello%20ABS%20Polymers,%20I%20have%20submitted%20inquiry%20reference%20${submittedInquiryId}%20for%20${encodeURIComponent(activeMachine?.name || selectedPart || 'machinery')}.%20Please%20review.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            Fast-Track on WhatsApp
          </a>
          <button
            onClick={() => {
              setSubmittedInquiryId(null);
              setMessage('');
            }}
            className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Submit Another Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 shrink-0 text-red-500 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Inquiry Type Selector Pills */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Select Inquiry Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'machinery_quotation', label: 'Machinery Quote' },
            { id: 'plant_turnkey', label: 'Complete Plant' },
            { id: 'spare_parts', label: 'Spare Parts & Knives' },
            { id: 'granules_quotation', label: 'Granules Order' },
          ].map((type) => (
            <button
              type="button"
              key={type.id}
              onClick={() => {
                const nextType = type.id as InquiryType;
                setInquiryType(nextType);
                if (nextType === 'granules_quotation' && !selectedProduct.includes('granules')) {
                  setSelectedProduct(GRANULE_PRODUCTS[0]?.id || '');
                } else if (nextType === 'machinery_quotation' && (!selectedProduct || selectedProduct.includes('granules'))) {
                  setSelectedProduct(MACHINERY_PRODUCTS[0]?.id || '');
                } else if (nextType === 'spare_parts' && !selectedPart) {
                  setSelectedPart('Replacement Knife Parts (EN41 Alloy Steel)');
                }
              }}
              className={`py-2.5 px-3 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                inquiryType === type.id
                  ? 'bg-navy-950 text-white border-navy-950 shadow-md'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* DYNAMIC FIELD SET 1: MACHINERY QUOTATION */}
      {inquiryType === 'machinery_quotation' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Selected Machine / Product Line *
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => {
                setSelectedProduct(e.target.value);
                setSelectedModel('');
              }}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
            >
              <option value="">-- Choose Machine --</option>
              {MACHINERY_PRODUCTS.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name} ({prod.series})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Model / Throughput Variant
            </label>
            <select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
                setCapacityNeeded(e.target.value);
              }}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
            >
              <option value="">-- Choose Capacity Variant --</option>
              {activeMachine?.variants ? (
                activeMachine.variants.map((v) => (
                  <option key={v.modelNumber} value={`${v.modelNumber} (${v.capacityKgHr} kg/h)`}>
                    {v.modelNumber} — {v.capacityKgHr} kg/h ({v.motorPower || 'Havells Drive'})
                  </option>
                ))
              ) : (
                <>
                  <option value="W250 (250 kg/h)">W250 (250 kg/h)</option>
                  <option value="W500 (500 kg/h)">W500 (500 kg/h)</option>
                  <option value="G500 (500 kg/h)">G500 (500 kg/h)</option>
                  <option value="CR1000 (1000 kg/h)">CR1000 (1,000 kg/h)</option>
                </>
              )}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Raw Plastic Feed Material to Process
            </label>
            <input
              type="text"
              placeholder="e.g. Rigid HDPE drums/bottles, PP woven sacks, LDPE agricultural film"
              value={materialToRecycle}
              onChange={(e) => setMaterialToRecycle(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* DYNAMIC FIELD SET 2: COMPLETE TURNKEY PLANT */}
      {inquiryType === 'plant_turnkey' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Turnkey Plant Solution Scope *
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
            >
              <option value="turnkey_10ft_compact">10 FT Compact Plastic Washing & Crushing Line</option>
              <option value="turnkey_crushing_washing">Integrated High-Capacity Crushing + Friction Washing Plant</option>
              <option value="turnkey_complete_granules">Complete Turnkey Line: Scrap to Pelletized Granules</option>
              <option value="turnkey_custom">Custom Engineering Specification</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Hourly Plant Throughput *
            </label>
            <select
              value={capacityNeeded}
              onChange={(e) => setCapacityNeeded(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
            >
              <option value="250 kg/hr">250 kg/hr (Compact Starter Unit)</option>
              <option value="500 kg/hr">500 kg/hr (Standard Commercial Line)</option>
              <option value="1,000 kg/hr">1,000 kg/hr (Heavy Industrial Plant)</option>
              <option value="2,000 kg/hr">2,000 kg/hr (High-Volume Facility)</option>
              <option value="5,000 kg/hr">5,000 kg/hr (Turnkey Mega Facility)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Facility Floor Space / Plant Dimensions Available
            </label>
            <input
              type="text"
              placeholder="e.g. 40 ft × 25 ft shed with 380V 3-phase power connection"
              value={plantFloorArea}
              onChange={(e) => setPlantFloorArea(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* DYNAMIC FIELD SET 3: SPARE PARTS & KNIVES (NO TARGETED CAPACITY!) */}
      {inquiryType === 'spare_parts' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-orange-50/60 rounded-xl border border-orange-200">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Spare Part Category *
            </label>
            <select
              value={selectedPart}
              onChange={(e) => setSelectedPart(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none font-bold text-slate-800"
            >
              <option value="Replacement Knife Parts (EN41 Alloy Steel)">Replacement Knife Parts (EN41 Alloy Steel)</option>
              <option value="G Series Stationary Bed Knives">G Series Stationary Bed Knives (EN41)</option>
              <option value="Crusher Dynamic Balanced Rotor">Crusher Dynamic Balanced Rotor Assembly</option>
              <option value="Screw Conveyor Flight Spiral (5400 mm)">Screw Conveyor Flight Spiral (5,400 mm)</option>
              <option value="Perforated Washing Screen Barrels">Perforated Washing Screen Barrels (SS 302)</option>
              <option value="Havells 3-Phase Starter Relay & Drive">Havells 3-Phase Starter Relay & Drive Unit</option>
              <option value="Centrifugal Water Pump Mechanical Seals">Centrifugal Water Pump Mechanical Seals</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Compatible Machine Model
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
            >
              <option value="g-series-plastic-crusher-machine">G Series Crusher (G250 / G500 / G1000)</option>
              <option value="absw-plastic-washing-plant">ABSW 10 FT Washing Plant (W250 – W5000)</option>
              <option value="cr-series-screw-conveyor">CR Series Screw Conveyor (CR250 – CR2000)</option>
              <option value="mtb-material-transport-blower">MTB Material Transport Blower (2880 RPM)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Quantity / Sets Required *
            </label>
            <input
              type="text"
              placeholder="e.g. 1 Full Set (6 Rotary + 4 Stationary Blades)"
              value={orderVolume}
              onChange={(e) => setOrderVolume(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Replacement Urgency
            </label>
            <select className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none">
              <option>Urgent Breakdown Replacement (Air/Fast Freight)</option>
              <option>Routine Plant Overhaul Spares</option>
              <option>Annual Consumable Inventory</option>
            </select>
          </div>
        </div>
      )}

      {/* DYNAMIC FIELD SET 4: GRANULES ORDER (NO TARGETED MACHINE CAPACITY!) */}
      {inquiryType === 'granules_quotation' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-blue-50/60 rounded-xl border border-blue-200">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Recycled Polymer Grade *
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none font-bold text-slate-800"
            >
              {GRANULE_PRODUCTS.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name} ({prod.materialType}) — {prod.grade}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Required Order Volume / Monthly Requirement *
            </label>
            <select
              value={orderVolume}
              onChange={(e) => setOrderVolume(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
            >
              <option value="1,000 kg (1 MT Trial Batch)">1,000 kg (1 Metric Ton Trial Batch)</option>
              <option value="3,000 – 5,000 kg (Monthly)">3,000 – 5,000 kg (Small Production)</option>
              <option value="10,000 kg (10 MT Regular)">10,000 kg (10 MT Regular Schedule)</option>
              <option value="20 FT Sea Container (18–20 MT)">20 FT Container (~18 MT Export to UAE/GCC)</option>
              <option value="40 FT Sea Container (25–28 MT)">40 FT Container (25–28 MT Continuous Supply)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              End-Product Manufacturing Application
            </label>
            <input
              type="text"
              placeholder="e.g. Jerry cans blow moulding, irrigation pipe extrusion, injection caps"
              value={granuleApplication}
              onChange={(e) => setGranuleApplication(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Customer Contact Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Your Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Ramesh Patel or Tariq Al-Mansoor"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Company / Recycling Business Name
          </label>
          <input
            type="text"
            placeholder="e.g. Emirates Polymer Recycling LLC"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Business Email Address *
          </label>
          <input
            type="email"
            required
            placeholder="purchasing@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Direct Phone / WhatsApp *
          </label>
          <input
            type="tel"
            required
            placeholder="+91 98439 40864 or +971 50..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Destination / Region
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
          >
            <option value="India">India (Domestic Factory Dispatch)</option>
            <option value="United Arab Emirates (UAE)">United Arab Emirates (UAE Export)</option>
            <option value="Saudi Arabia">Saudi Arabia (KSA)</option>
            <option value="Oman">Oman</option>
            <option value="Qatar">Qatar</option>
            <option value="East Africa">East Africa / Kenya</option>
            <option value="Other International">Other International</option>
          </select>
        </div>
      </div>

      {/* Message and technical notes */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Additional Technical Specifications / Custom Notes
        </label>
        <textarea
          rows={3}
          placeholder="Mention specific scrap contamination levels, electrical supply constraints (380V vs 415V), blade hardness requirements, or delivery timeframe..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center px-6 py-3.5 text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-xl shadow-lg shadow-brand-orange/20 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              Logging Quotation Request...
            </span>
          ) : (
            <span className="flex items-center">
              <Send className="w-4 h-4 mr-2" />
              Submit Official Quotation Request
            </span>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-3">
        <span className="flex items-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 mr-1" />
          Factory direct response within 24 working hours
        </span>
        <span>Coimbatore Engineering Facility</span>
      </div>
    </form>
  );
}

export default function InquiryForm(props: InquiryFormProps) {
  return (
    <Suspense fallback={<div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">Loading quotation form workspace...</div>}>
      <InquiryFormInner {...props} />
    </Suspense>
  );
}
