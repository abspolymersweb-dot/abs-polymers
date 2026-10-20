import { NextRequest, NextResponse } from 'next/server';
import { getCmsStore, saveCmsStore, updatePageCms, GlobalCmsStore } from '@/services/cmsService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') as keyof GlobalCmsStore['pages'] | null;
    const store = getCmsStore();

    if (page && store.pages[page]) {
      return NextResponse.json({
        success: true,
        page,
        data: store.pages[page]
      });
    }

    return NextResponse.json({
      success: true,
      store
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve CMS content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageKey, pageData, fullStore } = body;

    if (pageKey && pageData) {
      const updated = updatePageCms(pageKey, pageData);
      return NextResponse.json({
        success: true,
        message: `Page '${pageKey}' saved successfully`,
        store: updated
      });
    }

    if (fullStore) {
      const updated = saveCmsStore(fullStore);
      return NextResponse.json({
        success: true,
        message: 'All CMS pages updated successfully',
        store: updated
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid payload: provide pageKey + pageData or fullStore' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to persist CMS content' },
      { status: 500 }
    );
  }
}
