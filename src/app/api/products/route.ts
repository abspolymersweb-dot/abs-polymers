import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/services/dataService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const product = await dataService.getProducts(slug);
      if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, product });
    }

    const products = await dataService.getProducts();
    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Product name and category are required' },
        { status: 400 }
      );
    }

    // Auto-generate id / slug if new
    if (!body.id) {
      body.id = `prod-${Date.now().toString(36)}`;
    }
    if (!body.slug) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    await dataService.saveProduct(body);

    return NextResponse.json({
      success: true,
      message: 'Product saved successfully to database',
      product: body
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save product' },
      { status: 500 }
    );
  }
}
