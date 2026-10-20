export type SpecificationStatus = 'verified' | 'awaiting_confirmation';

export interface SpecItem {
  label: string;
  value: string;
  status: SpecificationStatus;
  unit?: string;
  note?: string;
}

export interface ModelVariant {
  modelNumber: string;
  capacityKgHr: number | string;
  specs: Record<string, string>;
  dimensionsMm?: {
    length: number;
    width: number;
    height: number;
  };
  weightKg?: number;
  motorPower?: string;
  voltage?: string;
}

export interface MachineryProduct {
  id: string;
  slug: string;
  name: string;
  series: string;
  category: string;
  shortDescription: string;
  overview: string;
  featured: boolean;
  highlightBadge?: string;
  heroImage: string;
  galleryImages: string[];
  brochureUrl?: string;
  videoUrl?: string;
  compatibleMaterials: string[];
  keyBenefits: string[];
  applications: string[];
  specColumns: { key: string; label: string; unit?: string }[];
  variants: ModelVariant[];
  verifiedSpecs: SpecItem[];
  awaitingConfirmationSpecs?: SpecItem[];
  metaTitle: string;
  metaDescription: string;
  published: boolean;
}

export interface GranuleProduct {
  id: string;
  slug: string;
  name: string;
  materialType: 'HDPE' | 'LDPE' | 'PP' | 'ABS' | 'HIPS' | 'GPPS' | string;
  grade: string;
  appearance: string;
  colorsAvailable: string[];
  meltFlowIndex?: string;
  density?: string;
  tensileStrength?: string;
  shortDescription: string;
  overview: string;
  applications: string[];
  packaging: string;
  minOrderQuantity: string;
  status: 'available' | 'enquiry_only';
  image: string;
  verifiedSpecs: SpecItem[];
  metaTitle: string;
  metaDescription: string;
  published: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  publishedAt: string;
  readingTimeMinutes: number;
  status: 'published' | 'draft' | 'scheduled';
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl?: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
    searchIntent: 'informational' | 'commercial' | 'transactional';
    targetLocation: string;
    score?: number;
    recommendations?: string[];
  };
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  processSteps: { step: number; title: string; description: string }[];
  deliverables: string[];
  image: string;
}

export type InquiryStatus = 'new' | 'contacted' | 'quotation_sent' | 'in_progress' | 'won' | 'lost';

export interface CustomerInquiry {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  country: string;
  inquiryType: 'machinery_quotation' | 'granules_quotation' | 'plant_turnkey' | 'service_parts' | 'general';
  productId?: string;
  productName?: string;
  modelSelected?: string;
  estimatedCapacityNeeded?: string;
  materialToRecycle?: string;
  message: string;
  status: InquiryStatus;
  assignedTo?: string;
  internalNotes?: string;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface McpToolDefinition {
  name: string;
  description: string;
  parametersSchema: Record<string, unknown>;
  isAvailable: boolean;
}

export interface DbHealthState {
  connected: boolean;
  status: 'healthy' | 'degraded' | 'unconnected' | 'mock_mode';
  lastChecked: string;
  latencyMs: number;
  provider: string;
  activeTables: { name: string; recordCount: number; status: string }[];
  storageUsage: { usedMb: number; totalMb: number; status: string };
  backupStatus: { lastBackup: string; status: string };
  notes: string;
}
