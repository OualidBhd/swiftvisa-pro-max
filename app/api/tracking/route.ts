import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { email, trackingCode } = await req.json();

  if (!email || !trackingCode) {
    return NextResponse.json({ success: false, error: 'Email and tracking code are required.' }, { status: 400 });
  }

  try {
    const application = await prisma.application.findFirst({
      where: {
        email: email, // Replace 'email' with the actual field name in your Prisma schema if different
        trackingCode,
      },
    });

    if (!application) {
      return NextResponse.json({ success: false, error: 'No application found for the given information.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, application });
  } catch (err) {
    console.error('Tracking error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error.' }, { status: 500 });
  }
}