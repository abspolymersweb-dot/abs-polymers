import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCmsStoreAsync, saveCmsStore, updatePageCms, GlobalCmsStore } from '@/services/cmsService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') as keyof GlobalCmsStore['pages'] | null;
    const store = await getCmsStoreAsync();

    if (page && store.pages[page]) {
      return NextResponse.json(
        {
          success: true,
          page,
          data: store.pages[page]
        },
        { headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } }
      );
    }

    return NextResponse.json(
      {
        success: true,
        store
      },
      { headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } }
    );
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
      const updated = await updatePageCms(pageKey, pageData);

      // Revalidate affected routes
      try {
        revalidatePath('/');
        if (pageKey === 'home') revalidatePath('/');
        else revalidatePath(`/${pageKey}`);
        revalidatePath('/sitemap.xml');
      } catch (revErr) {
        console.warn('CMS revalidation warning:', revErr);
      }

      return NextResponse.json({
        success: true,
        message: `Page '${pageKey}' saved successfully to database`,
        store: updated
      });
    }

    if (fullStore) {
      const updated = await saveCmsStore(fullStore);

      try {
        revalidatePath('/');
        revalidatePath('/about');
        revalidatePath('/contact');
        revalidatePath('/machineries');
        revalidatePath('/granules');
        revalidatePath('/services');
        revalidatePath('/destinations');
        revalidatePath('/sitemap.xml');
      } catch (revErr) {
        console.warn('Full CMS revalidation warning:', revErr);
      }

      return NextResponse.json({
        success: true,
        message: 'All CMS pages updated successfully in database',
        store: updated
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid payload: provide pageKey + pageData or fullStore' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('API cms POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to persist CMS content' },
      { status: 500 }
    );
  }
}
