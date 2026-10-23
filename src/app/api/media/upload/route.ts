import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { insertMediaAsset } from '@/lib/db';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(request: NextRequest) {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const formData = await request.formData();
    const files: File[] = [];

    // Support single 'file' or multiple 'files' in payload
    const singleFile = formData.get('file') as File | null;
    if (singleFile && singleFile.size > 0) {
      files.push(singleFile);
    }

    const multiFiles = formData.getAll('files') as File[];
    for (const f of multiFiles) {
      if (f && f.size > 0 && !files.includes(f)) {
        files.push(f);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid files provided in request' },
        { status: 400 }
      );
    }

    const customCategory = (formData.get('category') as string) || 'general';
    const customAlt = (formData.get('alt_text') as string) || '';

    const savedAssets = [];

    for (const file of files) {
      const originalName = file.name || 'image.jpg';
      const ext = path.extname(originalName).toLowerCase() || '.jpg';
      const base = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();

      // Check for name collision
      let filename = `${base}${ext}`;
      let diskPath = path.join(UPLOADS_DIR, filename);
      if (fs.existsSync(diskPath)) {
        const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        filename = `${base}-${uniqueSuffix}${ext}`;
        diskPath = path.join(UPLOADS_DIR, filename);
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fs.writeFileSync(diskPath, buffer);

      const publicUrl = `/uploads/${filename}`;
      const assetId = `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      const asset = {
        id: assetId,
        filename,
        original_name: originalName,
        url: publicUrl,
        mime_type: file.type || 'image/jpeg',
        size_bytes: buffer.length,
        width: 0,
        height: 0,
        alt_text: customAlt || base.replace(/[-_]/g, ' '),
        category: customCategory
      };

      insertMediaAsset(asset);
      savedAssets.push(asset);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${savedAssets.length} file(s)`,
      assets: savedAssets,
      asset: savedAssets[0] // for easy single upload consumption
    });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}

