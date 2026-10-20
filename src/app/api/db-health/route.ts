import { NextResponse } from 'next/server';
import { dbHealthService } from '@/services/dbHealthService';

export async function GET() {
  try {
    const health = dbHealthService.checkHealth();
    return NextResponse.json({ success: true, health });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Database health check failed' }, { status: 500 });
  }
}
