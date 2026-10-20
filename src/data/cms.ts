export interface CmsContent {
  hero: {
    badge: string;
    headline: string;
    headlineAccent: string;
    subheadline: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    heroImage: string;
    heroVideoUrl?: string;
    keyPoints: { icon: string; title: string; subtitle: string }[];
  };
  featuredHighlights: {
    title: string;
    subtitle: string;
    metrics: { number: string; label: string; desc: string }[];
  };
  compactPlantBanner: {
    badge: string;
    title: string;
    subtitle: string;
    features: string[];
    ctaText: string;
    specsCtaText: string;
  };
  contactBanner: {
    headline: string;
    subheadline: string;
    ctaQuotation: string;
    ctaWhatsapp: string;
    ctaPhone: string;
  };
}

export const INITIAL_CMS_CONTENT: CmsContent = {
  hero: {
    badge: 'PLASTIC RECYCLING MACHINERY MANUFACTURER',
    headline: 'Engineering Solutions for a',
    headlineAccent: 'Cleaner, Greener Tomorrow.',
    subheadline: 'High-performance plastic washing machines, heavy-duty granulators, and turnkey recycling plant solutions for a more sustainable future.',
    primaryCtaText: 'Request a Quote',
    primaryCtaLink: '/contact',
    secondaryCtaText: 'Explore Machinery',
    secondaryCtaLink: '/machineries',
    heroImage: '/images/hero-reference.jpg',
    keyPoints: [
      { icon: 'Maximize2', title: '10 FT Compact Design', subtitle: '65% less floor space vs conventional 30 FT lines' },
      { icon: 'Zap', title: 'Low Power Consumption', subtitle: 'Havells IE motors & efficient direct drives' },
      { icon: 'Droplet', title: 'Water Recycling', subtitle: 'Closed-loop multi-cycle water conservation' },
      { icon: 'CheckCircle2', title: 'High Performance', subtitle: 'SS 302 stainless steel & EN41 alloy steel blades' }
    ]
  },
  featuredHighlights: {
    title: 'Why Choose ABS Polymers',
    subtitle: 'Combining 35+ years of polymer granule materials mastery with advanced industrial machine building.',
    metrics: [
      { number: '35+', label: 'Years in Granules Business', desc: 'Deep polymer mastery' },
      { number: '6+', label: 'Years Machinery Manufacturing', desc: 'Innovative engineering' },
      { number: '100%', label: 'Water Recycling Focus', desc: 'Lower operational cost' },
      { number: 'UAE & India', label: 'Proven Industrial Reach', desc: 'International track record' }
    ]
  },
  compactPlantBanner: {
    badge: 'FEATURED PRODUCT',
    title: 'Compact Plastic Washing Machine',
    subtitle: 'High Cleaning Performance in a Space-Saving 10 FT Modular Footprint',
    features: [
      '10 FT compact design (vs. 30 FT conventional lines)',
      'Low power consumption with Havells electric motors',
      'Cost-efficient investment with rapid capital payback',
      'Removes dirt, mud, labels, grease, and chemical residues',
      'Hot washing (60°C–80°C) and high-speed friction cleaning',
      'Suitable for HDPE, LDPE, PP, ABS, HIPS, GPPS plastic flakes'
    ],
    ctaText: 'Get Quotation',
    specsCtaText: 'View Full Specifications'
  },
  contactBanner: {
    headline: "Let's Build a Cleaner, Greener Future Together.",
    subheadline: 'Discuss your plastic recycling throughput requirements, get an itemized machinery quotation, or order certified recycled granules.',
    ctaQuotation: 'Request a Quote',
    ctaWhatsapp: 'WhatsApp Us',
    ctaPhone: 'Call Factory'
  }
};

