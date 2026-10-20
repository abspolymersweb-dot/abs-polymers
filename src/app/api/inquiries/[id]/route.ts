import { NextRequest, NextResponse } from 'next/server';
import { inquiryService } from '@/services/inquiryService';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = inquiryService.updateStatus(
      id,
      body.status,
      body.internalNotes,
      body.followUpDate
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update inquiry' }, { status: 500 });
  }
}

