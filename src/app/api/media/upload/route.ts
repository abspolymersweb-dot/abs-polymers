import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { insertMediaAsset } from '@/lib/db';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.svg', '.pdf', '.mp4']);
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'video/mp4'
]);
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export async function POST(request: NextRequest) {
  try {
    // 1. Verify admin session
    const sessionCookie = request.cookies.get('abs_admin_session')?.value;
    if (!sessionCookie || !sessionCookie.includes('.')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required for media uploads' },
        { status: 401 }
      );
    }

    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const formData = await request.formData();
    const files: File[] = [];

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
      // 2. Validate file size
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { success: false, error: `File "${file.name}" exceeds maximum allowed size (50MB)` },
          { status: 400 }
        );
      }

      const originalName = file.name || 'image.jpg';
      const ext = path.extname(originalName).toLowerCase();

      // 3. Validate extension and MIME type
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        return NextResponse.json(
          { success: false, error: `Disallowed file type: "${ext}". Only images, PDFs, and MP4 videos are permitted.` },
          { status: 400 }
        );
      }

      if (file.type && !ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
        return NextResponse.json(
          { success: false, error: `Disallowed MIME type: "${file.type}".` },
          { status: 400 }
        );
      }

      // 4. Sanitize base filename against path traversal
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

      try {
        insertMediaAsset(asset);
      } catch (e) {
        // Safe in serverless
      }
      savedAssets.push(asset);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${savedAssets.length} file(s)`,
      assets: savedAssets,
      asset: savedAssets[0]
    });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
