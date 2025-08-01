import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/sendEmail'; 
import { ApplicationStatus } from '@prisma/client';

const generateTrackingCode = (): string => {
  const part = Math.random().toString(36).substring(2, 8).toUpperCase();
  const date = Date.now().toString(36).toUpperCase();
  return `${part}-${date}`;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const trackingCode = generateTrackingCode();

    const created = await prisma.visaApplication.create({
      data: {
        fullName: body.fullName || '',
        email: body.email || '',
        countryOfOrigin: body.countryOfOrigin || '',
        destinationCountry: body.destinationCountry || '',
        visaType: body.visaType || '',
        travelDate: body.travelDate ? new Date(body.travelDate) : null,
        passportImage: body.passportImage || '',
        residencePermit: body.residencePermit || '',
        personalPhoto: body.personalPhoto || '',
        additionalDocs: body.additionalDocs || '',
        trackingCode,
        status: ApplicationStatus.AWAITING_PAYMENT,
      },
    });

    await sendEmail(body.email, trackingCode);

    return NextResponse.json({ success: true, visaApplication: created });
  } catch (err: any) {
    console.error('❌ Error in /apply:', err);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء معالجة الطلب. حاول مرة أخرى.' },
      { status: 500 }
    );
  }
}