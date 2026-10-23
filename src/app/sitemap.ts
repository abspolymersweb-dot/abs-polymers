import { MetadataRoute } from 'next';
import { MACHINERY_PRODUCTS } from '@/data/machinery';
import { GRANULE_PRODUCTS } from '@/data/granules';
import { SERVICES_DATA } from '@/data/services';
import { BLOG_POSTS } from '@/data/blogs';
import { getAllDbDestinations, getAllDbBlogs } from '@/lib/db';

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

  // Dynamic Blog Posts (from SQLite, strictly published only)
  let publishedBlogs: any[] = [];
  try {
    publishedBlogs = getAllDbBlogs(true);
  } catch (e) {
    publishedBlogs = BLOG_POSTS.filter((b) => b.status === 'published');
  }

  const blogRoutes: MetadataRoute.Sitemap = publishedBlogs.map((b) => ({
    url: `${baseUrl}/blog/${b.slug}`,
    lastModified: new Date(b.publishedAt || b.published_at || new Date()),
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  // Dynamic Destination Pages (from SQLite, strictly published only)
  let publishedDestinations: any[] = [];
  try {
    publishedDestinations = getAllDbDestinations(true);
  } catch (e) {
    // safe fallback
  }

  const destinationRoutes: MetadataRoute.Sitemap = publishedDestinations.map((d) => ({
    url: `${baseUrl}/destinations/${d.slug}`,
    lastModified: new Date(d.updatedAt || new Date()),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...machineryRoutes,
    ...granuleRoutes,
    ...serviceRoutes,
    ...blogRoutes,
    ...destinationRoutes,
  ];
}

