'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Phone, MessageSquare, Info } from 'lucide-react';
import { MACHINERY_PRODUCTS } from '@/data/machinery';
import { GRANULE_PRODUCTS } from '@/data/granules';
import { COMPANY_INFO } from '@/data/company';

interface InquiryFormProps {
  initialProductId?: string;
  initialProductName?: string;
  initialInquiryType?: 'machinery_quotation' | 'granules_quotation' | 'plant_turnkey' | 'service_parts' | 'general';
}

export default function InquiryForm({
  initialProductId = '',
  initialProductName = '',
  initialInquiryType = 'machinery_quotation'
}: InquiryFormProps) {
  const [inquiryType, setInquiryType] = useState<string>(initialInquiryType);
  const [selectedProduct, setSelectedProduct] = useState<string>(initialProductId);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [country, setCountry] = useState<string>('India');
  const [capacityNeeded, setCapacityNeeded] = useState<string>('');
  const [materialToRecycle, setMaterialToRecycle] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);

  // Find product variants if a machine is selected
  const activeMachine = MACHINERY_PRODUCTS.find((m) => m.id === selectedProduct || m.slug === selectedProduct);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Field validations
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full contact name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid business email address.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please provide a direct phone/WhatsApp number with country code.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          companyName: companyName || 'Individual Recycler',
          email,
          phone,
          country,
          inquiryType,
          productId: selectedProduct || activeMachine?.id || '',
          productName: activeMachine?.name || initialProductName || (inquiryType === 'plant_turnkey' ? 'Complete Turnkey Line' : 'Recycling Inquiry'),
          modelSelected: selectedModel,
          estimatedCapacityNeeded: capacityNeeded,
          materialToRecycle,
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
        setErrorMsg('An unexpected error occurred. Please contact our sales team directly via WhatsApp.');
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
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Inquiry Ref: {submittedInquiryId}
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
            Quotation Request Received
          </h3>
          <p className="mt-2 text-slate-600 text-sm max-w-lg mx-auto">
            Thank you, <strong className="text-slate-900">{fullName}</strong>. Your commercial enquiry has been logged in the ABS Polymers sales desk queue. Our engineering technical team will review your requirement and prepare itemized pricing.
          </p>
        </div>

        {/* Notice of simulated / dev storage */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 text-left flex items-start max-w-lg mx-auto">
          <Info className="w-4 h-4 text-amber-600 mr-2 shrink-0 mt-0.5" />
          <span>
            <strong>Development Mode Notice:</strong> This inquiry has been safely stored in the application repository and is visible immediately in the <a href="/admin/inquiries" className="underline font-bold text-amber-900">Admin Inquiry Workspace</a>.
          </span>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap justify-center gap-3">
          <a
            href={`https://wa.me/${COMPANY_INFO.contact.whatsapp.replace(/\D/g, '')}?text=Hello%20ABS%20Polymers,%20I%20have%20submitted%20inquiry%20reference%20${submittedInquiryId}.%20Please%20expedite%20my%20quotation.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow"
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            Fast-Track via WhatsApp
          </a>
          <button
            onClick={() => {
              setSubmittedInquiryId(null);
              setMessage('');
            }}
            className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
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

      {/* Inquiry Type Radio selection */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Inquiry Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'machinery_quotation', label: 'Machinery Quote' },
            { id: 'plant_turnkey', label: 'Complete Plant' },
            { id: 'granules_quotation', label: 'Granules Order' },
            { id: 'service_parts', label: 'Spares / Service' },
          ].map((type) => (
            <button
              type="button"
              key={type.id}
              onClick={() => {
                setInquiryType(type.id);
                if (type.id === 'granules_quotation') {
                  setSelectedProduct(GRANULE_PRODUCTS[0]?.id || '');
                } else if (type.id === 'machinery_quotation') {
                  setSelectedProduct(MACHINERY_PRODUCTS[0]?.id || '');
                }
              }}
              className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-all ${
                inquiryType === type.id
                  ? 'bg-[#04294a] text-white border-[#04294a] shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product & Model selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {inquiryType === 'machinery_quotation' ? (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Machinery Line
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => {
                setSelectedProduct(e.target.value);
                setSelectedModel('');
              }}
              className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
            >
              <option value="">-- Choose Machine --</option>
              {MACHINERY_PRODUCTS.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name}
                </option>
              ))}
            </select>
          </div>
        ) : inquiryType === 'granules_quotation' ? (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Polymer Grade
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
            >
              <option value="">-- Choose Material --</option>
              {GRANULE_PRODUCTS.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name} ({prod.materialType})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Polymer Feed Type
            </label>
            <input
              type="text"
              placeholder="e.g. HDPE bottles, PP bags, LDPE film"
              value={materialToRecycle}
              onChange={(e) => setMaterialToRecycle(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
            />
          </div>
        )}

        {/* Model variants dropdown if available */}
        {activeMachine && activeMachine.variants.length > 0 ? (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Model / Throughput Capacity
            </label>
            <select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
                setCapacityNeeded(e.target.value);
              }}
              className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
            >
              <option value="">-- Choose Model Variant --</option>
              {activeMachine.variants.map((v) => (
                <option key={v.modelNumber} value={`${v.modelNumber} (${v.capacityKgHr} kg/h)`}>
                  {v.modelNumber} — {v.capacityKgHr} kg/h ({v.motorPower || 'Standard'})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Estimated Target Capacity (kg/hr)
            </label>
            <input
              type="text"
              placeholder="e.g. 500 kg/hr or 1000 kg/hr"
              value={capacityNeeded}
              onChange={(e) => setCapacityNeeded(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Customer Contact Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Your Full Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Rajesh Kumar or Ahmed Al-Nuaimi"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Company / Business Name
          </label>
          <input
            type="text"
            placeholder="e.g. Gulf Eco Recycling LLC"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Business Email *
          </label>
          <input
            type="email"
            required
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Phone / WhatsApp *
          </label>
          <input
            type="tel"
            required
            placeholder="+91 98422 00000 or +971 50..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Country / Destination
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
          >
            <option value="India">India (Domestic)</option>
            <option value="United Arab Emirates (UAE)">United Arab Emirates (UAE)</option>
            <option value="Saudi Arabia">Saudi Arabia (KSA)</option>
            <option value="Oman">Oman</option>
            <option value="Qatar">Qatar</option>
            <option value="Kenya">Kenya / East Africa</option>
            <option value="Other International">Other International</option>
          </select>
        </div>
      </div>

      {/* Message and technical questions */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Specific Operational Requirements or Questions
        </label>
        <textarea
          rows={3}
          placeholder="Please describe your input scrap contamination, required flake moisture, power availability, or delivery timeframe..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-xs text-slate-500">
          Direct response from Coimbatore engineering desk within 24 working hours.
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold text-white bg-brand-orange hover:bg-brand-orange-hover disabled:bg-slate-400 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
        >
          {loading ? (
            <span className="flex items-center">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
              Generating Inquiry...
            </span>
          ) : (
            <span className="flex items-center">
              <span>Submit Request for Quotation</span>
              <Send className="ml-2 w-4 h-4" />
            </span>
          )}
        </button>
      </div>
    </form>
  );
}

