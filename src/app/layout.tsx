import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { COMPANY_INFO } from '@/data/company';
import { dataService } from '@/services/dataService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gscVerification = process.env.NEXT_PUBLIC_GSC_VERIFICATION;
  const companyInfo = await dataService.getCompanyInfo();

  // Schema.org Organization structured data
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: companyInfo.name,
    image: 'https://abspolymers.com/images/logo.png',
    '@id': 'https://abspolymers.com',
    url: 'https://abspolymers.com',
    telephone: companyInfo.contact.phone,
    email: companyInfo.contact.salesEmail,
    priceRange: '₹₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: companyInfo.location.address,
      addressLocality: companyInfo.location.city,
      addressRegion: companyInfo.location.state,
      postalCode: '641006',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: companyInfo.location.geo.lat,
      longitude: companyInfo.location.geo.lng
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '18:30'
    },
    sameAs: [
      companyInfo.socialLinks.linkedin,
      companyInfo.socialLinks.youtube
    ]
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {gscVerification && (
          <meta name="google-site-verification" content={gscVerification} />
        )}
        {gaId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', { page_path: window.location.pathname });
                `,
              }}
            />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-brand-orange selection:text-white">
        <Navbar companyInfo={companyInfo} />
        <main className="flex-1">{children}</main>
        <Footer companyInfo={companyInfo} />
      </body>
    </html>
  );
}
