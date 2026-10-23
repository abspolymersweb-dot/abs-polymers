import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/services/dataService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const publishedOnly = searchParams.get('publishedOnly') === 'true';

    if (slug) {
      const destination = await dataService.getDestinations(slug, publishedOnly);
      if (!destination) {
        return NextResponse.json({ success: false, error: 'Destination not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, destination });
    }

    const destinations = await dataService.getDestinations(undefined, publishedOnly);
    return NextResponse.json({ success: true, count: destinations.length, destinations });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch destinations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.countryName) {
      return NextResponse.json({ success: false, error: 'Country name is required' }, { status: 400 });
    }

    if (!body.id) {
      body.id = `dest-${Date.now().toString(36)}`;
    }
    if (!body.slug) {
      body.slug = body.countryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    await dataService.saveDestination(body);

    return NextResponse.json({
      success: true,
      message: 'Destination saved successfully to database',
      destination: body
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save destination' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Destination ID is required' }, { status: 400 });
    }

    await dataService.deleteDestination(id);

    return NextResponse.json({
      success: true,
      message: 'Destination deleted successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete destination' },
      { status: 500 }
    );
  }
}
