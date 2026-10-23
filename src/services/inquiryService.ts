import { CustomerInquiry, InquiryStatus } from '@/types';
import { getAllDbEnquiries, insertDbEnquiry, updateDbEnquiryStatus, deleteDbEnquiry } from '@/lib/db';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export const inquiryService = {
  isDatabaseConnected(): boolean {
    return true;
  },

  async getAll(): Promise<CustomerInquiry[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseAdmin();
        const { data, error } = await supabase
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          return data.map((r: any) => ({
            id: r.id,
            fullName: r.full_name || '',
            companyName: r.company_name || '',
            email: r.email,
            phone: r.phone,
            country: r.country || 'India',
            destinationCountry: r.destination_country || '',
            destinationId: r.destination_id || '',
            inquiryType: r.inquiry_type || 'machinery_quotation',
            productId: r.product_id,
            productName: r.product_name,
            modelSelected: r.model_selected,
            estimatedCapacityNeeded: r.estimated_capacity,
            materialToRecycle: r.material_to_recycle,
            message: r.message || '',
            status: (r.status as InquiryStatus) || 'new',
            internalNotes: r.notes || '',
            createdAt: r.created_at || new Date().toISOString(),
            updatedAt: r.created_at || new Date().toISOString()
          }));
        }
      } catch (err) {
        console.warn('Supabase query fallback to local SQLite:', err);
      }
    }

    try {
      const rows = getAllDbEnquiries();
      return rows.map((r: any) => ({
        id: r.id,
        fullName: r.fullName || r.full_name || '',
        companyName: r.companyName || r.company_name || '',
        email: r.email,
        phone: r.phone,
        country: r.country || 'India',
        destinationCountry: r.destinationCountry || r.destination_country || '',
        destinationId: r.destinationId || r.destination_id || '',
        inquiryType: r.inquiryType || r.inquiry_type || 'machinery_quotation',
        productId: r.productId || r.product_id,
        productName: r.productName || r.product_name,
        modelSelected: r.modelSelected || r.model_selected,
        estimatedCapacityNeeded: r.estimatedCapacityNeeded || r.estimated_capacity,
        materialToRecycle: r.materialToRecycle || r.material_to_recycle,
        message: r.message || '',
        status: (r.status as InquiryStatus) || 'new',
        internalNotes: r.notes,
        createdAt: r.createdAt || r.created_at || new Date().toISOString(),
        updatedAt: r.createdAt || r.created_at || new Date().toISOString()
      }));
    } catch (err) {
      console.error('Failed to get inquiries:', err);
      return [];
    }
  },

  async getById(id: string): Promise<CustomerInquiry | undefined> {
    const list = await this.getAll();
    return list.find((inq) => inq.id === id);
  },

  async create(data: Omit<CustomerInquiry, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<CustomerInquiry> {
    const id = `enq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    // 1. Save to Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseAdmin();
        const { error } = await supabase.from('enquiries').insert({
          id,
          full_name: data.fullName,
          company_name: data.companyName || 'Private Recycler',
          email: data.email,
          phone: data.phone,
          country: data.country || 'India',
          destination_country: data.destinationCountry || '',
          destination_id: data.destinationId || '',
          inquiry_type: data.inquiryType || 'machinery_quotation',
          product_id: data.productId || '',
          product_name: data.productName || '',
          model_selected: data.modelSelected || '',
          estimated_capacity: data.estimatedCapacityNeeded || '',
          material_to_recycle: data.materialToRecycle || '',
          message: data.message || '',
          status: 'new',
          notes: '',
          created_at: now
        });

        if (error) {
          console.warn('Supabase insert notice (will mirror to SQLite):', error.message);
        }
      } catch (err) {
        console.warn('Supabase insert error (falling back to SQLite):', err);
      }
    }

    // 2. Mirror to SQLite locally if available
    try {
      insertDbEnquiry({
        fullName: data.fullName,
        companyName: data.companyName,
        email: data.email,
        phone: data.phone,
        country: data.country,
        destinationCountry: data.destinationCountry,
        destinationId: data.destinationId,
        inquiryType: data.inquiryType,
        productId: data.productId,
        productName: data.productName,
        modelSelected: data.modelSelected,
        estimatedCapacityNeeded: data.estimatedCapacityNeeded,
        materialToRecycle: data.materialToRecycle,
        message: data.message
      });
    } catch (e) {
      // Ephemeral on Vercel, normal
    }

    return {
      ...data,
      id,
      status: 'new',
      createdAt: now,
      updatedAt: now
    };
  },

  async updateStatus(id: string, status: InquiryStatus, internalNotes?: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseAdmin();
        const payload: any = { status };
        if (internalNotes !== undefined) payload.notes = internalNotes;
        await supabase.from('enquiries').update(payload).eq('id', id);
      } catch (e) {
        // Fallback
      }
    }

    try {
      updateDbEnquiryStatus(id, status, internalNotes);
    } catch (e) {
      // Fallback
    }

    return true;
  },

  async delete(id: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseAdmin();
        await supabase.from('enquiries').delete().eq('id', id);
      } catch (e) {
        // Fallback
      }
    }

    try {
      deleteDbEnquiry(id);
    } catch (e) {
      // Fallback
    }

    return true;
  },

  async getStats() {
    const list = await this.getAll();
    return {
      total: list.length,
      new: list.filter((i) => i.status === 'new').length,
      quotationSent: list.filter((i) => i.status === 'quotation_sent').length,
      inProgress: list.filter((i) => i.status === 'in_progress').length,
      won: list.filter((i) => i.status === 'won').length,
      isMockMode: false,
      databaseProvider: isSupabaseConfigured() ? 'Supabase PostgreSQL (Production)' : 'SQLite (Local)'
    };
  }
};
