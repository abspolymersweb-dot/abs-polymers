import { NextRequest, NextResponse } from 'next/server';
import { getAllDbGranules, saveDbGranule } from '@/lib/db';

export async function GET() {
  try {
    const granules = getAllDbGranules();
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

    saveDbGranule(body);

    return NextResponse.json({
      success: true,
      message: 'Granule item saved successfully to SQLite',
      granule: body
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save granule item' },
      { status: 500 }
    );
  }
}

