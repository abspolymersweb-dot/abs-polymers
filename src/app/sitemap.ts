import { MetadataRoute } from 'next';
import { dataService } from '@/services/dataService';

export const revalidate = 3600; // Cache sitemap for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://abspolymers.com';
  const now = new Date();

  // 1. Static Core Public Pages (excluding /admin, /blog)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/machineries`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/granules`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // 2. Dynamic Machinery Pages (Published only from database)
  let machineryRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await dataService.getProducts();
    if (Array.isArray(products)) {
      machineryRoutes = products
        .filter((m: any) => m.published !== false && m.slug)
        .map((m: any) => ({
          url: `${baseUrl}/machineries/${m.slug}`,
          lastModified: m.updated_at ? new Date(m.updated_at) : now,
          changeFrequency: 'weekly',
          priority: 0.9,
        }));
    }
  } catch (err) {
    console.warn('Sitemap machinery fetch error:', err);
  }

  // 3. Dynamic Granules Pages (Published only from database)
  let granuleRoutes: MetadataRoute.Sitemap = [];
  try {
    const granules = await dataService.getGranules();
    if (Array.isArray(granules)) {
      granuleRoutes = granules
        .filter((g: any) => g.published !== false && g.slug)
        .map((g: any) => ({
          url: `${baseUrl}/granules/${g.slug}`,
          lastModified: g.updated_at ? new Date(g.updated_at) : now,
          changeFrequency: 'weekly',
          priority: 0.85,
        }));
    }
  } catch (err) {
    console.warn('Sitemap granules fetch error:', err);
  }

  // 4. Dynamic Services Pages (Active only from database)
  let serviceRoutes: MetadataRoute.Sitemap = [];
  try {
    const services = await dataService.getServices();
    if (Array.isArray(services)) {
      serviceRoutes = services
        .filter((s: any) => s.isActive !== false && s.slug)
        .map((s: any) => ({
          url: `${baseUrl}/services/${s.slug}`,
          lastModified: s.updated_at ? new Date(s.updated_at) : now,
          changeFrequency: 'monthly',
          priority: 0.8,
        }));
    }
  } catch (err) {
    console.warn('Sitemap services fetch error:', err);
  }

  // 5. Dynamic Global Destinations (Published only from database)
  let destinationRoutes: MetadataRoute.Sitemap = [];
  try {
    const destinations = await dataService.getDestinations(undefined, true);
    if (Array.isArray(destinations)) {
      destinationRoutes = destinations
        .filter((d: any) => d.slug)
        .map((d: any) => ({
          url: `${baseUrl}/destinations/${d.slug}`,
          lastModified: d.updated_at ? new Date(d.updated_at) : now,
          changeFrequency: 'weekly',
          priority: 0.85,
        }));
    }
  } catch (err) {
    console.warn('Sitemap destinations fetch error:', err);
  }

  return [
    ...staticRoutes,
    ...machineryRoutes,
    ...granuleRoutes,
    ...serviceRoutes,
    ...destinationRoutes,
  ];
}
