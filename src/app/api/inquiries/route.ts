import { NextRequest, NextResponse } from 'next/server';
import { inquiryService } from '@/services/inquiryService';

export async function GET() {
  try {
    const inquiries = await inquiryService.getAll();
    const stats = await inquiryService.getStats();
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

    const created = await inquiryService.create({
      fullName: body.fullName,
      companyName: body.companyName || 'Private Recycler',
      email: body.email,
      phone: body.phone,
      country: body.country || 'India',
      destinationCountry: body.destinationCountry || '',
      destinationId: body.destinationId || '',
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

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, internalNotes } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID and status are required' }, { status: 400 });
    }

    const updated = await inquiryService.updateStatus(id, status, internalNotes);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Inquiry not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry updated successfully',
      inquiry: updated
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update inquiry' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Inquiry ID is required' }, { status: 400 });
    }

    const deleted = await inquiryService.delete(id);
    return NextResponse.json({
      success: deleted,
      message: deleted ? 'Inquiry deleted successfully' : 'Inquiry not found'
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete inquiry' }, { status: 500 });
  }
}
