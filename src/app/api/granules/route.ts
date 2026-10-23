import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/services/dataService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const granule = await dataService.getGranules(slug);
      if (!granule) {
        return NextResponse.json({ success: false, error: 'Granule item not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, granule });
    }

    const granules = await dataService.getGranules();
    return NextResponse.json({ success: true, count: granules.length, granules });
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

    return NextResponse.json({
      success: true,
      message: 'Granule item saved successfully to database',
      granule: body
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save granule item' },
      { status: 500 }
    );
  }
}
