import { CustomerInquiry, InquiryStatus } from '@/types';

// Initial preloaded realistic inquiries for demonstration and administrative testing
let inMemoryInquiries: CustomerInquiry[] = [
  {
    id: 'inq-101',
    fullName: 'Ahmed Al Mansoori',
    companyName: 'Gulf Eco Plastics LLC',
    email: 'ahmed.mansoori@gulfecoplastics.ae',
    phone: '+971 50 123 4567',
    country: 'United Arab Emirates (UAE)',
    inquiryType: 'machinery_quotation',
    productId: 'absw-washing-plant',
    productName: 'ABSW Series Compact Plastic Washing Plant',
    modelSelected: 'W1000 (1000 kg/h)',
    estimatedCapacityNeeded: '1000 kg/hr',
    materialToRecycle: 'Post-consumer HDPE bottles and PP caps',
    message: 'We are expanding our Dubai industrial zone recycling facility. We need a quotation for the ABSW W1000 compact washing plant including CIF Jebel Ali port shipping and on-site commissioning terms.',
    status: 'quotation_sent',
    assignedTo: 'Export Sales Desk',
    internalNotes: 'Quotation revision 1 dispatched via email. Client requested UAE electrical compliance 415V 50Hz confirmation.',
    followUpDate: '2026-10-25',
    createdAt: '2026-10-18T10:30:00Z',
    updatedAt: '2026-10-19T14:15:00Z'
  },
  {
    id: 'inq-102',
    fullName: 'Suresh Narayanan',
    companyName: 'Kongu Polymer Industries',
    email: 'suresh@kongupolymers.in',
    phone: '+91 94433 88990',
    country: 'India',
    inquiryType: 'machinery_quotation',
    productId: 'g-series-crusher',
    productName: 'G Series Plastic Crusher & Granulator',
    modelSelected: 'G1000 (1000 kg/h, 50 HP)',
    estimatedCapacityNeeded: '750 - 1000 kg/hr',
    materialToRecycle: 'Rigid plastic battery crates and automotive bumpers',
    message: 'Require heavy-duty crusher in Coimbatore. Need to test scrap cutting at your factory before placing purchase order. Please share pricing and lead time.',
    status: 'new',
    assignedTo: 'Domestic Sales Team',
    internalNotes: 'Trial run requested at Coimbatore workshop.',
    followUpDate: '2026-10-21',
    createdAt: '2026-10-20T08:15:00Z',
    updatedAt: '2026-10-20T08:15:00Z'
  },
  {
    id: 'inq-103',
    fullName: 'Mohamed Faisal',
    companyName: 'Al-Rayyan Recycling Solutions',
    email: 'faisal@alrayyanrecycling.com',
    phone: '+971 55 987 6543',
    country: 'United Arab Emirates (UAE)',
    inquiryType: 'plant_turnkey',
    productName: 'Turnkey 1500 kg/h Washing & Granulation Line',
    estimatedCapacityNeeded: '1500 kg/hr',
    materialToRecycle: 'LDPE agricultural film and HDPE containers',
    message: 'Looking for a complete washing and granulation line solution with closed-loop water treatment. Please provide technical layout drawings and budget estimates.',
    status: 'in_progress',
    assignedTo: 'Engineering Leadership',
    internalNotes: 'CAD plant layout proposal being prepared.',
    followUpDate: '2026-10-24',
    createdAt: '2026-10-15T11:00:00Z',
    updatedAt: '2026-10-18T16:00:00Z'
  },
  {
    id: 'inq-104',
    fullName: 'Karthik Raja',
    companyName: 'Sri Balaji Plastics',
    email: 'karthik@balajiplastics.co.in',
    phone: '+91 98940 33445',
    country: 'India',
    inquiryType: 'granules_quotation',
    productId: 'hdpe-blow-moulding-granules',
    productName: 'Recycled HDPE Granules (Blow Moulding Grade)',
    estimatedCapacityNeeded: '15 Metric Tons / month',
    materialToRecycle: 'HDPE Milky / Blue blow grade',
    message: 'Need monthly supply of 15 MT recycled blow moulding grade HDPE granules for manufacturing lubricant oil cans. Kindly provide sample and current per kg rate.',
    status: 'contacted',
    assignedTo: 'Granules Desk',
    internalNotes: '10 kg sample dispatched for testing melt flow index.',
    followUpDate: '2026-10-23',
    createdAt: '2026-10-17T09:20:00Z',
    updatedAt: '2026-10-18T10:00:00Z'
  }
];

export const inquiryService = {
  isDatabaseConnected(): boolean {
    return Boolean(process.env.DATABASE_URL);
  },

  getAll(): CustomerInquiry[] {
    return [...inMemoryInquiries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getById(id: string): CustomerInquiry | undefined {
    return inMemoryInquiries.find((inq) => inq.id === id);
  },

  create(data: Omit<CustomerInquiry, 'id' | 'status' | 'createdAt' | 'updatedAt'>): CustomerInquiry {
    const newInquiry: CustomerInquiry = {
      ...data,
      id: `inq-${Date.now().toString(36)}`,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    inMemoryInquiries.unshift(newInquiry);
    return newInquiry;
  },

  updateStatus(id: string, status: InquiryStatus, internalNotes?: string, followUpDate?: string): CustomerInquiry | null {
    const inq = inMemoryInquiries.find((item) => item.id === id);
    if (!inq) return null;
    inq.status = status;
    if (internalNotes !== undefined) inq.internalNotes = internalNotes;
    if (followUpDate !== undefined) inq.followUpDate = followUpDate;
    inq.updatedAt = new Date().toISOString();
    return inq;
  },

  getStats() {
    return {
      total: inMemoryInquiries.length,
      new: inMemoryInquiries.filter((i) => i.status === 'new').length,
      quotationSent: inMemoryInquiries.filter((i) => i.status === 'quotation_sent').length,
      inProgress: inMemoryInquiries.filter((i) => i.status === 'in_progress').length,
      won: inMemoryInquiries.filter((i) => i.status === 'won').length,
      isMockMode: !this.isDatabaseConnected()
    };
  }
};

