// app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/sendEmail';

export async function POST(req: NextRequest) {
  try {
    const { to, trackingCode } = await req.json();

    if (!to || !trackingCode) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await sendEmail(to, trackingCode);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API send-email error:', error?.message || error);
    return NextResponse.json({ success: false, error: error.message || 'Internal error' }, { status: 500 });
  }
}