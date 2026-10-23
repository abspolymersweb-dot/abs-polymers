import { NextRequest, NextResponse } from 'next/server';
import { getAllMediaAssets, deleteMediaAsset } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const media = getAllMediaAssets(category);
    return NextResponse.json({ success: true, count: media.length, media });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to retrieve media assets' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Media asset ID is required' }, { status: 400 });
    }

    const result = deleteMediaAsset(id);
    if (!result.success) {
      return NextResponse.json({ success: false, error: 'Media asset not found or deletion failed' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Media asset deleted successfully',
      deletedUrl: result.url
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete media asset' },
      { status: 500 }
    );
  }
}

