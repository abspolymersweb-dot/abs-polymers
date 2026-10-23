import fs from 'fs';
import path from 'path';
import { GlobalCmsStore, CmsPageData, DEFAULT_CMS_STORE } from '@/types/cms';
import { getDbPage, getAllDbPages, saveDbPage } from '@/lib/db';
import { getSupabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

export * from '@/types/cms';

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'cms-content.json');

export function getCmsStore(): GlobalCmsStore {
  try {
    const dbPages = getAllDbPages();
    if (Object.keys(dbPages).length > 0) {
      return {
        version: '2.1.0-sqlite',
        lastUpdated: new Date().toISOString(),
        pages: {
          ...DEFAULT_CMS_STORE.pages,
          ...(dbPages as any)
        }
      };
    }
  } catch (err) {
    console.warn('SQLite read failed, attempting fallback to JSON file:', err);
  }

  // Fallback to JSON file if SQLite has an unexpected error
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
    console.error('Error reading CMS store file, using defaults:', err);
  }

  return DEFAULT_CMS_STORE;
}

export function saveCmsStore(data: Partial<GlobalCmsStore>): GlobalCmsStore {
  const current = getCmsStore();
  const updated: GlobalCmsStore = {
    ...current,
    ...data,
    lastUpdated: new Date().toISOString(),
    pages: {
      ...current.pages,
      ...(data.pages || {})
    }
  };

  // 1. Save to SQLite Database
  try {
    for (const [slug, pageData] of Object.entries(updated.pages)) {
      saveDbPage(slug, pageData);
    }
  } catch (err) {
    console.error('Failed to save to SQLite database:', err);
  }

  // 2. Mirror to Supabase Cloud Database if configured
  if (isSupabaseConfigured()) {
    try {
      const client = getSupabaseAdmin();
      const rows = Object.entries(updated.pages).map(([slug, pageData]) => ({
        slug,
        title: slug.toUpperCase(),
        meta_title: (pageData as any).seo?.metaTitle || '',
        meta_description: (pageData as any).seo?.metaDescription || '',
        og_image: (pageData as any).seo?.ogImage || '',
        sections_json: (pageData as any).sections || {},
        updated_at: new Date().toISOString()
      }));
      client.from('pages').upsert(rows).then(() => {});
    } catch (err) {
      console.warn('Failed to mirror pages to Supabase:', err);
    }
  }

  // 3. Mirror to JSON file as fallback/export
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to mirror CMS store to disk:', err);
  }

  return updated;
}

export function updatePageCms(pageKey: keyof GlobalCmsStore['pages'], pageData: CmsPageData): GlobalCmsStore {
  try {
    saveDbPage(pageKey, pageData);
  } catch (err) {
    console.error(`Failed to update page ${pageKey} in SQLite:`, err);
  }

  // Mirror to Supabase
  if (isSupabaseConfigured()) {
    try {
      const client = getSupabaseAdmin();
      client.from('pages').upsert({
        slug: pageKey,
        title: pageKey.toUpperCase(),
        meta_title: pageData.seo?.metaTitle || '',
        meta_description: pageData.seo?.metaDescription || '',
        og_image: pageData.seo?.ogImage || '',
        sections_json: pageData.sections || {},
        updated_at: new Date().toISOString()
      }).then(() => {});
    } catch (err) {
      console.warn(`Failed to mirror page ${pageKey} to Supabase:`, err);
    }
  }

  const current = getCmsStore();
  current.pages[pageKey] = pageData;

  // Mirror to JSON
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(current, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to mirror updated page to JSON:', err);
  }

  return current;
}
