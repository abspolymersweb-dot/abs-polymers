import fs from 'fs';
import path from 'path';
import { GlobalCmsStore, CmsPageData, DEFAULT_CMS_STORE } from '@/types/cms';
import { getAllDbPages, saveDbPage } from '@/lib/db';
import { dataService } from '@/services/dataService';

export * from '@/types/cms';

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'cms-content.json');

// Synchronous getter for backward compatibility
export function getCmsStore(): GlobalCmsStore {
  try {
    const dbPages = getAllDbPages();
    if (Object.keys(dbPages).length > 0) {
      return {
        version: '3.0.0',
        lastUpdated: new Date().toISOString(),
        pages: {
          ...DEFAULT_CMS_STORE.pages,
          ...(dbPages as any)
        }
      };
    }
  } catch (err) {
    // fallback
  }

  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_CMS_STORE,
        ...parsed,
        pages: {
          ...DEFAULT_CMS_STORE.pages,
          ...(parsed.pages || {})
        }
      };
    }
  } catch (err) {
    // fallback
  }

  return DEFAULT_CMS_STORE;
}

// Authoritative Async getter that reads directly from production Supabase database
export async function getCmsStoreAsync(): Promise<GlobalCmsStore> {
  try {
    const dbPages = await dataService.getPages();
    if (dbPages && Object.keys(dbPages).length > 0) {
      return {
        version: '3.0.0-production',
        lastUpdated: new Date().toISOString(),
        pages: {
          ...DEFAULT_CMS_STORE.pages,
          ...(dbPages as any)
        }
      };
    }
  } catch (err) {
    console.warn('Failed to load async CMS store from Supabase, falling back:', err);
  }

  return getCmsStore();
}

export async function saveCmsStore(data: Partial<GlobalCmsStore>): Promise<GlobalCmsStore> {
  const current = await getCmsStoreAsync();
  const updatedPages = {
    ...current.pages,
    ...(data.pages || {})
  };

  // Save each page through dataService to Supabase
  for (const [slug, pageData] of Object.entries(updatedPages)) {
    try {
      await dataService.savePage(slug, pageData);
    } catch (err) {
      console.error(`Error saving CMS page ${slug}:`, err);
    }
  }

  // Also mirror to local disk if writable
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify({ ...current, pages: updatedPages }, null, 2), 'utf-8');
  } catch (e) {
    // Ignored in read-only environment
  }

  return {
    ...current,
    pages: updatedPages,
    lastUpdated: new Date().toISOString()
  };
}

export async function updatePageCms(pageKey: keyof GlobalCmsStore['pages'], pageData: CmsPageData): Promise<GlobalCmsStore> {
  await dataService.savePage(String(pageKey), pageData);

  try {
    const current = getCmsStore();
    current.pages[pageKey] = pageData;
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(current, null, 2), 'utf-8');
  } catch (e) {
    // Ignored
  }

  return getCmsStoreAsync();
}
