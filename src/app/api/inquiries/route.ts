import { NextRequest, NextResponse } from 'next/server';
import { inquiryService } from '@/services/inquiryService';

export async function GET() {
  try {
    const inquiries = inquiryService.getAll();
    const stats = inquiryService.getStats();
    return NextResponse.json({ success: true, inquiries, stats });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.fullName || !body.email || !body.phone) {
      return NextResponse.json({ success: false, error: 'Missing mandatory fields: Name, Email, and Phone are required.' }, { status: 400 });
    }

    const created = inquiryService.create({
      fullName: body.fullName,
      companyName: body.companyName || 'Private Recycler',
      email: body.email,
      phone: body.phone,
      country: body.country || 'India',
      inquiryType: body.inquiryType || 'machinery_quotation',
      productId: body.productId || '',
      productName: body.productName || 'Plastic Recycling Line',
      modelSelected: body.modelSelected || '',
      estimatedCapacityNeeded: body.estimatedCapacityNeeded || '',
      materialToRecycle: body.materialToRecycle || '',
      message: body.message || ''
    });

    return NextResponse.json({
      success: true,
      message: 'Inquiry received successfully and queued for sales review.',
      inquiry: created
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error processing inquiry' }, { status: 500 });
  }
}
