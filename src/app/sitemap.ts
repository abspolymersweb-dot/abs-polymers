import { MetadataRoute } from 'next';
import { MACHINERY_PRODUCTS } from '@/data/machinery';
import { GRANULE_PRODUCTS } from '@/data/granules';
import { SERVICES_DATA } from '@/data/services';
import { BLOG_POSTS } from '@/data/blogs';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://abspolymers.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/machineries`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/granules`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Dynamic Machinery Pages (only published)
  const machineryRoutes: MetadataRoute.Sitemap = MACHINERY_PRODUCTS.filter((m) => m.published).map((m) => ({
    url: `${baseUrl}/machineries/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Dynamic Granule Pages (only published)
  const granuleRoutes: MetadataRoute.Sitemap = GRANULE_PRODUCTS.filter((g) => g.published).map((g) => ({
    url: `${baseUrl}/granules/${g.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Dynamic Service Pages
  const serviceRoutes: MetadataRoute.Sitemap = SERVICES_DATA.map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Dynamic Blog Posts (only published)
  const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.filter((b) => b.status === 'published').map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: new Date(b.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  return [
    ...staticRoutes,
    ...machineryRoutes,
    ...granuleRoutes,
    ...serviceRoutes,
    ...blogRoutes,
  ];
}

