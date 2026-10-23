import { NextRequest, NextResponse } from 'next/server';
import { getAllDbSettings, setDbSetting } from '@/lib/db';

export async function GET() {
  try {
    const settings = getAllDbSettings();
    return NextResponse.json({ success: true, settings });
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
      for (const [k, v] of Object.entries(body.settings)) {
        setDbSetting(k, String(v));
      }
      return NextResponse.json({
        success: true,
        message: 'Settings updated successfully in SQLite',
        settings: getAllDbSettings()
      });
    }

    if (body.key && body.value !== undefined) {
      setDbSetting(body.key, String(body.value));
      return NextResponse.json({
        success: true,
        message: `Setting '${body.key}' saved successfully in SQLite`
      });
    }

    return NextResponse.json(
      { success: false, error: 'Provide key/value pair or settings dictionary' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save settings' },
      { status: 500 }
    );
  }
}

