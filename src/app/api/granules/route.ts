import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dataService } from '@/services/dataService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const granule = await dataService.getGranules(slug);
      if (!granule) {
        return NextResponse.json(
          { success: false, error: 'Granule item not found' },
          {
            status: 404,
            headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
          }
        );
      }
      return NextResponse.json(
        { success: true, granule },
        { headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } }
      );
    }

    const granules = await dataService.getGranules();
    return NextResponse.json(
      { success: true, count: granules.length, granules },
      { headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch granules' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.materialType) {
      return NextResponse.json(
        { success: false, error: 'Name and materialType are required' },
        { status: 400 }
      );
    }

    if (!body.id) {
      body.id = `gran-${Date.now().toString(36)}`;
    }
    if (!body.slug) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    await dataService.saveGranule(body);

    // Dynamic Cache Invalidation
    try {
      revalidatePath('/');
      revalidatePath('/granules');
      revalidatePath(`/granules/${body.slug}`);
      revalidatePath('/sitemap.xml');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Granule item saved successfully to database',
      granule: body
    });
  } catch (error: any) {
    console.error('API granules POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save granule item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Granule ID or slug is required' },
        { status: 400 }
      );
    }

    await dataService.deleteGranule(id);

    // Dynamic Cache Invalidation
    try {
      revalidatePath('/');
      revalidatePath('/granules');
      revalidatePath(`/granules/${id}`);
      revalidatePath('/sitemap.xml');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Granule item deleted successfully'
    });
  } catch (error: any) {
    console.error('API granules DELETE error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete granule' },
      { status: 500 }
    );
  }
}
