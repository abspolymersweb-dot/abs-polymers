import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { COMPANY_INFO } from '@/data/company';

export const metadata: Metadata = {
  metadataBase: new URL('https://abspolymers.com'),
  title: {
    default: 'ABS Polymers | Plastic Recycling Machinery Manufacturer | Coimbatore, India',
    template: '%s | ABS Polymers'
  },
  description: 'ABS Polymers is a premier plastic recycling machinery manufacturer based in Coimbatore, Tamil Nadu, India. Featuring 10 FT compact washing plants, G series crushers, and 35+ years granules expertise. Exporting to UAE & worldwide.',
  keywords: [
    'plastic recycling machinery',
    'compact plastic washing plant',
    'plastic crusher machine',
    'plastic recycling machinery Coimbatore',
    'plastic recycling plant manufacturer India',
    'recycled plastic granules HDPE PP',
    'screw conveyor recycling',
    'material transport blower'
  ],
  authors: [{ name: 'ABS Polymers Engineering Team' }],
  creator: 'ABS Polymers',
  publisher: 'ABS Polymers',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://abspolymers.com',
    siteName: 'ABS Polymers',
    title: 'ABS Polymers | Plastic Recycling Machinery & Granules Manufacturer',
    description: 'Engineering solutions for a cleaner, greener tomorrow. Compact washing plants, granulators, and complete recycling lines. Coimbatore, India.',
    images: [
      {
        url: '/images/hero-reference.jpg',
        width: 1200,
        height: 630,
        alt: 'ABS Polymers Industrial Machinery'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ABS Polymers | Plastic Recycling Machinery Manufacturer',
    description: 'Industrial plastic washing plants, granulators, and recycled granules. Coimbatore, Tamil Nadu, India.',
    images: ['/images/hero-reference.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema.org Organization structured data
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: COMPANY_INFO.name,
    image: 'https://abspolymers.com/images/logo.png',
    '@id': 'https://abspolymers.com',
    url: 'https://abspolymers.com',
    telephone: COMPANY_INFO.contact.phone,
    email: COMPANY_INFO.contact.salesEmail,
    priceRange: '₹₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY_INFO.location.address,
      addressLocality: COMPANY_INFO.location.city,
      addressRegion: COMPANY_INFO.location.state,
      postalCode: '641006',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: COMPANY_INFO.location.geo.lat,
      longitude: COMPANY_INFO.location.geo.lng
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:30'
    },
    sameAs: [
      COMPANY_INFO.socialLinks.linkedin,
      COMPANY_INFO.socialLinks.youtube
    ]
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-brand-orange selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
