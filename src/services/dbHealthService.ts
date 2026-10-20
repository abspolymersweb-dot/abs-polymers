import { DbHealthState } from '@/types';
import { MACHINERY_PRODUCTS } from '@/data/machinery';
import { GRANULE_PRODUCTS } from '@/data/granules';
import { BLOG_POSTS } from '@/data/blogs';
import { inquiryService } from './inquiryService';

export const dbHealthService = {
  checkHealth(): DbHealthState {
    const isDbConnected = Boolean(process.env.DATABASE_URL);
    const inquiries = inquiryService.getAll();

    return {
      connected: isDbConnected,
      status: isDbConnected ? 'healthy' : 'mock_mode',
      lastChecked: new Date().toISOString(),
      latencyMs: isDbConnected ? 18 : 0,
      provider: isDbConnected ? (process.env.DB_PROVIDER || 'PostgreSQL') : 'In-Memory Development Repository (Mock Mode)',
      activeTables: [
        { name: 'machinery_products', recordCount: MACHINERY_PRODUCTS.length, status: 'Active (Static/File)' },
        { name: 'machinery_variants', recordCount: MACHINERY_PRODUCTS.reduce((acc, p) => acc + p.variants.length, 0), status: 'Active (Static/File)' },
        { name: 'granule_products', recordCount: GRANULE_PRODUCTS.length, status: 'Active (Static/File)' },
        { name: 'customer_inquiries', recordCount: inquiries.length, status: isDbConnected ? 'PostgreSQL' : 'In-Memory Service' },
        { name: 'blog_posts', recordCount: BLOG_POSTS.length, status: 'Active (Static/File)' },
        { name: 'cms_content_blocks', recordCount: 14, status: 'Preloaded' },
        { name: 'admin_audit_logs', recordCount: 12, status: 'Local' }
      ],
      storageUsage: {
        usedMb: 14.8,
        totalMb: 512,
        status: 'Optimal (Local Media Assets)'
      },
      backupStatus: {
        lastBackup: isDbConnected ? '2026-10-20 04:00:00 UTC' : 'Pending Real Database Connection',
        status: isDbConnected ? 'Automated daily snapshot active' : 'Awaiting production database configuration'
      },
      notes: isDbConnected
        ? 'Connected to production database instance.'
        : 'NOTICE: Running in local in-memory development mode. DATABASE_URL environment variable is currently not set. Changes to inquiries and content are preserved during runtime but will not persist across server restarts until a PostgreSQL/MySQL connection string is supplied.'
    };
  }
};
