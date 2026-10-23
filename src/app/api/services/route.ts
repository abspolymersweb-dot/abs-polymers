import { NextRequest, NextResponse } from 'next/server';
import { getAllDbServices, saveDbService } from '@/lib/db';

export async function GET() {
  try {
    const services = getAllDbServices();
    return NextResponse.json({ success: true, count: services.length, services });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title) {
      return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    }

    if (!body.id) {
      body.id = `serv-${Date.now().toString(36)}`;
    }
    if (!body.slug) {
      body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    saveDbService(body);

    return NextResponse.json({
      success: true,
      message: 'Service saved successfully to SQLite',
      service: body
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save service' },
      { status: 500 }
    );
  }
}

