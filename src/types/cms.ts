export interface PageSectionItem {
  id?: string;
  title: string;
  subtitle?: string;
  desc?: string;
  value?: string;
  icon?: string;
}

export interface CmsPageData {
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage?: string;
  };
  sections: Record<string, any>;
}

export interface GlobalCmsStore {
  version: string;
  lastUpdated: string;
  pages: {
    home: CmsPageData;
    about: CmsPageData;
    machineries: CmsPageData;
    granules: CmsPageData;
    services: CmsPageData;
    blog: CmsPageData;
    contact: CmsPageData;
    footer: CmsPageData;
  };
}

export const DEFAULT_CMS_STORE: GlobalCmsStore = {
  version: '2.0.0',
  lastUpdated: new Date().toISOString(),
  pages: {
    home: {
      seo: {
        metaTitle: 'ABS Polymers | Plastic Recycling Machinery & Recycled Granules Coimbatore',
        metaDescription: 'Manufacturer of 10 FT compact plastic washing plants, heavy-duty granulators, and supplier of premium recycled polymer granules based in Coimbatore, Tamil Nadu, India.',
        ogImage: '/images/hero-factory.jpg'
      },
      sections: {
        hero: {
          headline: 'Engineering Solutions for a',
          headlineAccent: 'Cleaner, Greener Tomorrow.',
          subheadline: 'Plastic recycling machinery and integrated processing solutions engineered to help businesses transform plastic waste into reusable resources.',
          primaryCtaText: 'Request a Quote',
          primaryCtaLink: '/contact?intent=quote',
          secondaryCtaText: 'Explore Our Machinery',
          secondaryCtaLink: '/machineries',
          heroImage: '/images/hero-factory.jpg',
          heroImageAlt: 'ABS Polymers Plastic Recycling Machinery Plant',
          highlights: [
            '10 FT Compact Footprint',
            'Closed-Loop Water Recycling',
            'Active UAE & Middle East Export'
          ]
        },
        featureStrip: {
          visible: true,
          items: [
            { title: 'Havells 3-Phase Motors', subtitle: 'Heavy-duty 380V/415V electrical drives & starters', icon: 'Cpu' },
            { title: 'EN41 Alloy Steel Knives', subtitle: 'Precision-hardened high-tensile rotor blades', icon: 'Award' },
            { title: '10 FT Compact Plant Design', subtitle: 'Saves ~65% floor footprint vs 30 FT conventional lines', icon: 'Zap' },
            { title: 'SS 302 Stainless Steel', subtitle: 'Corrosion-resistant contact tanks & washing chambers', icon: 'ShieldCheck' },
            { title: '5,400 mm Continuous Conveyors', subtitle: 'CR Series continuous bulk material transfer', icon: 'Layers' },
            { title: 'UAE & GCC Direct Export', subtitle: 'Verified Middle East container dispatch & commissioning', icon: 'Globe' }
          ]
        },
        compactPlant: {
          visible: true,
          badge: 'Featured Flagship Innovation',
          title: 'Compact Plastic Washing Machine',
          titleAccent: '(10 FT Design)',
          description: 'Traditional plastic washing lines span 30 feet or more, consuming enormous plant space and millions of litres of water. ABS Polymers re-engineered the process into a compact 10 FT continuous washing, dewatering, and heating line.',
          image: '/images/products/washing-plant-line.png',
          imageAlt: 'ABS Polymers 10 FT Compact Plastic Washing Plant',
          ctaText: 'Request Washing Plant Quote',
          ctaLink: '/contact?intent=quote&product=absw-washing-plant',
          specsCtaText: 'View Full Technical Datasheet',
          specsCtaLink: '/machineries/absw-plastic-washing-plant',
          benefits: [
            { title: '10 FT Space-Saving Footprint', desc: 'Saves up to 65% floor space compared to 30 FT conventional lines, allowing high-capacity installation in compact factory sheds.' },
            { title: 'Closed-Loop Water Filtration', desc: 'Multiple reuses of washing water with integrated settlement, drastically cutting freshwater bills and minimizing effluent treatment.' },
            { title: 'Dual Temperature Zones', desc: '60°C–80°C hot friction washing removes stubborn grease and adhesives; 120°C–140°C heating prepares clean flakes for direct extrusion.' },
            { title: 'SS 302 Stainless Steel', desc: 'All internal contact surfaces and washing tanks built from heavy-gauge SS 302 stainless steel for decades of corrosion resistance.' },
            { title: 'Havells 3-Phase Reliability', desc: 'Powered by 380V 50Hz 3-phase Havells electric motors engineered for 24/7 continuous industrial duty.' },
            { title: '250 to 5,000 kg/h Output', desc: 'Scalable model range from W250 for regional shops to W5000 for large automated recycling facilities.' },
            { title: 'Rapid 10-Minute Cleaning', desc: 'Turnaround in approximately 10 minutes, with full resin or color changeover accomplished in 30 minutes.' }
          ]
        },
        process: {
          visible: true,
          badge: 'Integrated Recycling Engineering',
          title: 'From Scrap Plastic to Reusable Granules',
          subtitle: 'Our automated processing workflow transforms heavily contaminated post-consumer plastic waste into high-purity flakes and pellets through five coordinated stages.'
        },
        granules: {
          visible: true,
          badge: '35+ Years Polymer Granules Mastery',
          title: 'Premium Recycled Plastic Granules',
          subtitle: 'Before machinery engineering, ABS Polymers built a 35-year foundation in polymer trading and recycled granules in Coimbatore. We supply consistent, double-screen filtered recycled granules with lab-verified melt flow index.',
          ctaText: 'Enquire About Granules',
          ctaLink: '/contact?intent=granules'
        },
        services: {
          visible: true,
          badge: 'Full Lifecycle Industrial Support',
          title: 'Recycling Plant Solutions & Services',
          subtitle: 'From facility design and customized machine manufacturing to on-site commissioning across India and the UAE, ABS Polymers delivers comprehensive technical support.'
        },
        about: {
          visible: true,
          badge: 'Industrial Heritage & Global Vision',
          title: 'Built on Real Recycling Experience',
          subtitle: 'ABS Polymers did not begin as an external machinery reseller. We started as hands-on plastic recyclers and polymer compounders in Coimbatore, Tamil Nadu. We build machinery that solves the real operational frustrations of everyday plant managers.'
        }
      }
    },
    about: {
      seo: {
        metaTitle: 'About ABS Polymers | Plastic Recycling Machinery Manufacturer Coimbatore',
        metaDescription: '35+ years in polymer granules and 6+ years in machinery manufacturing. Official exporter to UAE and Middle East recyclers.',
        ogImage: '/images/hero-factory.jpg'
      },
      sections: {
        hero: {
          title: 'Precision Machine Engineering Rooted in Polymer Mastery',
          subtitle: 'ABS Polymers combines 35+ years of plastic granule materials expertise with 6+ years of dedicated machinery fabrication in Coimbatore, Tamil Nadu, India.'
        },
        story: {
          title: 'The ABS Polymers Story',
          content: 'Founded in Coimbatore, Tamil Nadu, ABS Polymers began as a specialist supplier of reprocessed and recycled plastic granules. Over 35 years of hands-on materials work, our team identified persistent equipment bottlenecks: traditional washing plants occupied too much floor space, consumed excessive freshwater, and required frequent maintenance. Six years ago, we established our dedicated machinery division to engineer a better alternative: the compact 10 FT closed-loop washing plant, heavy-duty EN41 granulators, and continuous material transport systems.'
        },
        pillars: {
          granulesYears: '35+ Years',
          machineryYears: '6+ Years',
          headquarters: 'Coimbatore, Tamil Nadu, India',
          exportMarket: 'United Arab Emirates (UAE) & Expanding GCC'
        }
      }
    },
    machineries: {
      seo: {
        metaTitle: 'Plastic Recycling Machinery Catalogue | ABS Polymers Coimbatore',
        metaDescription: 'Explore ABS Polymers machinery: 10 FT compact washing plants, G series crushers, CR conveyors, and MTB blowers with verified specifications.',
        ogImage: '/images/products/washing-plant-line.png'
      },
      sections: {
        hero: {
          title: 'Plastic Recycling Machinery & Processing Solutions',
          subtitle: 'Engineered in Coimbatore, India. Designed for heavy-duty 24/7 continuous duty, low power consumption, and maximum polymer recovery. Explore verified technical datasheets.'
        },
        processCategories: {
          title: 'Complete Solution & Process Stages',
          subtitle: 'ABS Polymers provides equipment and engineered turnkey lines across seven modular recycling stages.',
          stages: [
            { id: '1', title: '1. Plastic Collection & Feeding', desc: 'Infeed conveyors and sorting hoppers for rigid containers, drums, bottles, and films.' },
            { id: '2', title: '2. Sorting & Material Preparation', desc: 'Magnetic separation, manual de-baling, and pre-cleaning sorting stations.' },
            { id: '3', title: '3. High-Torque Crushing & Granulating', desc: 'Heavy-duty G Series granulators with hardened EN41 alloy knives reducing scrap to 1–25 mm.' },
            { id: '4', title: '4. Hot-Friction Washing & Cleaning', desc: '10 FT compact washer with 60°C–80°C dynamic friction cleaning stripping oil, labels, and grime.' },
            { id: '5', title: '5. Separation, Rinsing & Dewatering', desc: 'Closed-loop multi-stage water recovery and high-speed centrifugal moisture separation.' },
            { id: '6', title: '6. Flake Drying & Pneumatic Transfer', desc: 'MTB series 2880 RPM blowers transporting spotless dried regrind directly to storage silos.' },
            { id: '7', title: '7. Granule Compounding & Pelletizing', desc: 'Direct extrusion and strand cutting for clean circular polymer granules ready for moulding.' }
          ]
        }
      }
    },
    granules: {
      seo: {
        metaTitle: 'Recycled Plastic Granules | HDPE, PP, LDPE, ABS | ABS Polymers',
        metaDescription: '35+ years polymer granules expertise. Lab-tested melt flow index, washed & degreased reprocessed pellets in Coimbatore, India.',
        ogImage: '/images/hero-reference.jpg'
      },
      sections: {
        hero: {
          title: 'Premium Recycled Plastic Granules',
          subtitle: 'Consistent melt flow index, double 80/100 mesh screen filtered recycled granules for injection, blow moulding, and extrusion manufacturing.'
        },
        supplyStandards: {
          filtration: 'Double 80/100 mesh screen filtration during extrusion',
          testing: 'Lab-tested Melt Flow Index (MFI) and specific density',
          packaging: '25 kg PP woven laminated bags with moisture-proof inner liner',
          moq: '1,000 kg (1 Metric Ton) sample & trial orders'
        }
      }
    },
    services: {
      seo: {
        metaTitle: 'Recycling Plant Services & Spare Parts | ABS Polymers',
        metaDescription: 'Turnkey plant engineering, custom machinery modifications, genuine EN41 spare parts, and on-site commissioning across India and UAE.',
        ogImage: '/images/products/machines-collage.jpg'
      },
      sections: {
        hero: {
          title: 'Turnkey Engineering Solutions & Genuine Spares',
          subtitle: 'Comprehensive lifecycle support for plastic recyclers: from factory CAD layout and custom machinery design to on-site commissioning and rapid EN41 knife replacements.'
        },
        sparesBanner: {
          title: 'Precision EN41 Replacement Knives & Spares',
          description: 'Factory-ground EN41 alloy knives, Havells heavy-duty motor spares, and dynamic-balanced rotors manufactured directly in Coimbatore and dispatched rapidly across India and UAE.',
          ctaText: 'Order Replacement Knives & Parts',
          ctaLink: '/contact?intent=spare_parts&part=Replacement+Knife+Parts+(EN41+Alloy+Steel)&product=g-series-plastic-crusher-machine'
        }
      }
    },
    blog: {
      seo: {
        metaTitle: 'Plastic Recycling Knowledge & Engineering Insights | ABS Polymers',
        metaDescription: 'Technical guides on compact plastic washing plants, EN41 blade maintenance, and recycling market dynamics in India and UAE.',
        ogImage: '/images/hero-factory.jpg'
      },
      sections: {
        hero: {
          title: 'Recycling Engineering & Technology Insights',
          subtitle: 'Technical benchmarks, machinery maintenance guides, and polymer processing analysis written by our engineering team in Coimbatore.'
        }
      }
    },
    contact: {
      seo: {
        metaTitle: 'Contact ABS Polymers | Factory Quotations & Technical Desk',
        metaDescription: 'Request an itemized price quotation for plastic recycling machinery or recycled granules. Direct WhatsApp, phone, and factory visits in Coimbatore.',
        ogImage: '/images/hero-factory.jpg'
      },
      sections: {
        hero: {
          title: 'Contact ABS Polymers',
          subtitle: 'Get in touch with our Coimbatore factory engineering desk or export sales office. Request itemized price quotations, book trial runs, or discuss custom machinery configurations.'
        },
        contactDetails: {
          address: 'Coimbatore, Tamil Nadu, India',
          phone: '+91 98422 12345',
          phoneDisplay: '+91 98422 12345',
          whatsapp: '+91 98422 12345',
          whatsappDisplay: '+91 98422 12345',
          salesEmail: 'sales@abspolymers.com',
          workingHours: 'Monday – Saturday: 9:00 AM – 6:30 PM IST',
          exportDesk: 'Official Export Partner to the UAE & Middle East'
        }
      }
    },
    footer: {
      seo: {
        metaTitle: 'ABS Polymers Global Elements',
        metaDescription: 'Footer and global settings',
      },
      sections: {
        companySummary: 'ABS Polymers is a premier plastic recycling machinery manufacturer and granules specialist based in Coimbatore, Tamil Nadu, India. Powered by 35+ years of polymer granule materials mastery and 6+ years of precision machine engineering.',
        factoryAddress: 'Coimbatore, Tamil Nadu, India',
        phone: '+91 98422 12345',
        phoneDisplay: '+91 98422 12345',
        salesEmail: 'sales@abspolymers.com',
        whatsapp: '+91 98422 12345',
        workingHours: 'Mon - Sat: 9:00 AM - 6:30 PM IST',
        copyrightText: `© ${new Date().getFullYear()} ABS Polymers. All rights reserved.`,
        creatorText: 'Created by dawnexus.10',
        creatorUrl: 'https://dawnexus.com'
      }
    }
  }
};
