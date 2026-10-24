import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/services/dataService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const service = await dataService.getServices(slug);
      if (!service) {
        return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, service });
    }

    const services = await dataService.getServices();
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
      return NextResponse.json(
        { success: false, error: 'Service title is required' },
        { status: 400 }
      );
    }

    if (!body.id) {
      body.id = `srv-${Date.now().toString(36)}`;
    }
    if (!body.slug) {
      body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    await dataService.saveService(body);

    return NextResponse.json({
      success: true,
      message: 'Service saved successfully to database',
      service: body
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save service' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Service ID or slug is required' }, { status: 400 });
    }

    await dataService.deleteService(id);

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete service' },
      { status: 500 }
    );
  }
}
