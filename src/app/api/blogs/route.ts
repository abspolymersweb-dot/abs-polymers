import { NextRequest, NextResponse } from 'next/server';
import { dataService } from '@/services/dataService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const publishedOnly = searchParams.get('publishedOnly') === 'true';

    if (slug) {
      const blog = await dataService.getBlogs(slug, publishedOnly);
      if (!blog) {
        return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, blog });
    }

    const blogs = await dataService.getBlogs(undefined, publishedOnly);
    return NextResponse.json({ success: true, count: blogs.length, blogs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch blogs' },
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
      body.id = `blog-${Date.now().toString(36)}`;
    }
    if (!body.slug) {
      body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    await dataService.saveBlog(body);

    return NextResponse.json({
      success: true,
      message: 'Blog post saved successfully to database',
      blog: body
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save blog' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Blog ID is required' }, { status: 400 });
    }

    await dataService.deleteBlog(id);

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete blog' },
      { status: 500 }
    );
  }
}
