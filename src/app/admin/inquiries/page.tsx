'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Inbox,
  Search,
  Filter,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  X,
  Calendar,
  Save
} from 'lucide-react';
import { CustomerInquiry, InquiryStatus } from '@/types';

function InquiriesContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id');

  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeInquiry, setActiveInquiry] = useState<CustomerInquiry | null>(null);

  // Edit states for active inquiry modal
  const [editStatus, setEditStatus] = useState<InquiryStatus>('new');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editFollowUp, setEditFollowUp] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/inquiries')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setInquiries(data.inquiries);
          if (initialId) {
            const found = data.inquiries.find((i: CustomerInquiry) => i.id === initialId);
            if (found) openDetail(found);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [initialId]);

  const openDetail = (inq: CustomerInquiry) => {
    setActiveInquiry(inq);
    setEditStatus(inq.status);
    setEditNotes(inq.internalNotes || '');
    setEditFollowUp(inq.followUpDate || '');
    setSaveSuccess(false);
  };

  const handleSaveStatus = async () => {
    if (!activeInquiry) return;
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch(`/api/inquiries/${activeInquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          internalNotes: editNotes,
          followUpDate: editFollowUp
        })
      });

      const data = await res.json();
      if (data.success) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === activeInquiry.id ? data.inquiry : i))
        );
        setActiveInquiry(data.inquiry);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setSaving(false);
    }
  };

  const filtered = inquiries.filter((inq) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      inq.fullName.toLowerCase().includes(q) ||
      inq.companyName.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      inq.phone.toLowerCase().includes(q) ||
      inq.country.toLowerCase().includes(q) ||
      inq.productName?.toLowerCase().includes(q);

    const matchStatus = statusFilter === 'all' || inq.status === statusFilter;
    const matchType = typeFilter === 'all' || inq.inquiryType === typeFilter;

    return matchSearch && matchStatus && matchType;
  });

  const exportCsv = () => {
    const headers = ['ID', 'Date', 'Name', 'Company', 'Email', 'Phone', 'Country', 'Product', 'Model', 'Status', 'Notes'];
    const rows = inquiries.map((i) => [
      i.id,
      i.createdAt,
      `"${i.fullName}"`,
      `"${i.companyName}"`,
      i.email,
      `"${i.phone}"`,
      `"${i.country}"`,
      `"${i.productName || ''}"`,
      `"${i.modelSelected || ''}"`,
      i.status,
      `"${(i.internalNotes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `abs-polymers-inquiries-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Customer Inquiries Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track quotation requests, assign sales reps, record follow-ups, and dispatch price proposals.
          </p>
        </div>

        <button
          onClick={exportCsv}
          className="inline-flex items-center px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
          Export Inquiries (CSV)
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer name, company, email, phone, or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
            >
              <option value="all">All Statuses ({inquiries.length})</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="quotation_sent">Quotation Sent</option>
              <option value="in_progress">In Progress</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:outline-none"
            >
              <option value="all">All Inquiry Types</option>
              <option value="machinery_quotation">Machinery Quotation</option>
              <option value="granules_quotation">Granules Quotation</option>
              <option value="plant_turnkey">Turnkey Plant</option>
              <option value="service_parts">Spares / Service</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Date & Ref</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Customer & Company</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Product / Model Requested</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Country</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading inquiries queue...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No inquiries found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((inq) => (
                  <tr
                    key={inq.id}
                    onClick={() => openDetail(inq)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-800">{inq.id}</div>
                      <div className="text-[11px] text-slate-400">{inq.createdAt.slice(0, 10)}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{inq.fullName}</div>
                      <div className="text-slate-500">{inq.companyName}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#04294a]">{inq.productName || 'Recycling Line'}</div>
                      <div className="text-[11px] text-slate-500">{inq.modelSelected || inq.estimatedCapacityNeeded || '-'}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {inq.country}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                          inq.status === 'new'
                            ? 'bg-orange-100 text-orange-800'
                            : inq.status === 'quotation_sent'
                            ? 'bg-blue-100 text-blue-800'
                            : inq.status === 'won'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {inq.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(inq);
                        }}
                        className="px-2.5 py-1 text-xs font-bold text-brand-orange bg-orange-50 hover:bg-brand-orange hover:text-white rounded border border-orange-200 transition-colors"
                      >
                        Open Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail Slide-Over / Modal */}
      {activeInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs p-0 animate-in fade-in">
          <div className="bg-white h-full w-full max-w-xl shadow-2xl flex flex-col justify-between overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="space-y-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase font-mono">
                    Ref: {activeInquiry.id}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-0.5">
                    {activeInquiry.fullName}
                  </h2>
                  <div className="text-xs text-slate-500">{activeInquiry.companyName} • {activeInquiry.country}</div>
                </div>
                <button
                  onClick={() => setActiveInquiry(null)}
                  className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Direct Quick Actions */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`tel:${activeInquiry.phone}`}
                  className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-center text-xs font-bold text-slate-700 flex flex-col items-center justify-center space-y-1"
                >
                  <Phone className="w-4 h-4 text-brand-orange" />
                  <span>Call Phone</span>
                </a>
                <a
                  href={`https://wa.me/${activeInquiry.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(activeInquiry.fullName)},%20regarding%20your%20ABS%20Polymers%20inquiry.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 text-center text-xs font-bold text-emerald-800 flex flex-col items-center justify-center space-y-1"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`mailto:${activeInquiry.email}?subject=ABS%20Polymers%20Quotation%20-%20Ref%20${activeInquiry.id}`}
                  className="p-2.5 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 text-center text-xs font-bold text-blue-800 flex flex-col items-center justify-center space-y-1"
                >
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>Send Email</span>
                </a>
              </div>

              {/* Inquiry Details */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Product Inquired:</span>
                  <div className="text-sm font-black text-[#04294a]">{activeInquiry.productName}</div>
                </div>
                {activeInquiry.modelSelected && (
                  <div>
                    <span className="font-bold text-slate-500 uppercase text-[10px]">Model Variant:</span>
                    <div className="text-xs font-bold text-slate-800">{activeInquiry.modelSelected}</div>
                  </div>
                )}
                {activeInquiry.materialToRecycle && (
                  <div>
                    <span className="font-bold text-slate-500 uppercase text-[10px]">Material Scrap:</span>
                    <div className="text-xs text-slate-800">{activeInquiry.materialToRecycle}</div>
                  </div>
                )}
                <div>
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Customer Message:</span>
                  <div className="text-xs text-slate-700 bg-white p-3 rounded border border-slate-200 mt-1 leading-relaxed">
                    {activeInquiry.message || 'No additional message provided.'}
                  </div>
                </div>
              </div>

              {/* Administrative Status & Follow-up editor */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Update Lead Pipeline
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pipeline Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as InquiryStatus)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-bold"
                  >
                    <option value="new">New (Awaiting Review)</option>
                    <option value="contacted">Contacted</option>
                    <option value="quotation_sent">Quotation Sent</option>
                    <option value="in_progress">In Progress / Commercial Negotiations</option>
                    <option value="won">Won (Purchase Order Received)</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Follow-Up Date
                  </label>
                  <input
                    type="date"
                    value={editFollowUp}
                    onChange={(e) => setEditFollowUp(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Internal Sales Notes & Technical Queries
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Log technical parameters, power supply details (e.g. 415V UAE compliance), or quotation revision details..."
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                {saveSuccess && (
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs font-bold rounded flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                    Status updated successfully.
                  </div>
                )}
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveInquiry(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handleSaveStatus}
                disabled={saving}
                className="inline-flex items-center px-5 py-2 text-xs font-bold text-white bg-brand-orange hover:bg-brand-orange-hover rounded-lg shadow transition-colors"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                {saving ? 'Saving...' : 'Save Pipeline Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminInquiriesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading inquiries...</div>}>
      <InquiriesContent />
    </Suspense>
  );
}
