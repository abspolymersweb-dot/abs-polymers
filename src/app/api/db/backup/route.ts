import { NextRequest, NextResponse } from 'next/server';
import { backupDatabase, listBackups } from '@/lib/db';

export async function GET() {
  try {
    const backups = listBackups();
    return NextResponse.json({ success: true, count: backups.length, backups });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to list backups' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const result = backupDatabase();
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Backup creation failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Database backup created successfully: ${result.filename}`,
      backup: result
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Backup failed' },
      { status: 500 }
    );
  }
}

