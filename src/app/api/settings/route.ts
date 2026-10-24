import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dataService } from '@/services/dataService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await dataService.getSettings();
    return NextResponse.json(
      { success: true, settings },
      { headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.settings && typeof body.settings === 'object') {
      await dataService.saveSettings(body.settings);
      const updated = await dataService.getSettings();

      try {
        revalidatePath('/');
        revalidatePath('/about');
        revalidatePath('/contact');
        revalidatePath('/sitemap.xml');
      } catch (revErr) {
        // Safe
      }

      return NextResponse.json({
        success: true,
        message: 'Settings updated successfully in database',
        settings: updated
      });
    }

    if (body.key && body.value !== undefined) {
      await dataService.saveSettings({ [body.key]: String(body.value) });

      try {
        revalidatePath('/');
        revalidatePath('/about');
        revalidatePath('/contact');
        revalidatePath('/sitemap.xml');
      } catch (revErr) {
        // Safe
      }

      return NextResponse.json({
        success: true,
        message: `Setting '${body.key}' saved successfully in database`
      });
    }

    return NextResponse.json(
      { success: false, error: 'Provide key/value pair or settings dictionary' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('API settings POST error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save settings' },
      { status: 500 }
    );
  }
}
