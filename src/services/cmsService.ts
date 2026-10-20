import fs from 'fs';
import path from 'path';
import { GlobalCmsStore, CmsPageData, DEFAULT_CMS_STORE } from '@/types/cms';

export * from '@/types/cms';

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'cms-content.json');

export function getCmsStore(): GlobalCmsStore {
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

  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist CMS store to disk:', err);
    throw new Error('Failed to save CMS data to persistence store.');
  }

  return updated;
}

export function updatePageCms(pageKey: keyof GlobalCmsStore['pages'], pageData: CmsPageData): GlobalCmsStore {
  const current = getCmsStore();
  current.pages[pageKey] = pageData;
  return saveCmsStore(current);
}
