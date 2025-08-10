import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/sendEmail';
import { ApplicationStatus, Prisma } from '@prisma/client';

const PRICE_EUR = Number(process.env.PRICE_EUR ?? '0.99');

const generateTrackingCode = () => {
  const part = Math.random().toString(36).substring(2, 8).toUpperCase();
  const date = Date.now().toString(36).toUpperCase();
  return `${part}-${date}`;
};

async function createApplicationWithUniqueCode(body: any) {
  let attempts = 0;
  while (attempts < 3) {
    const trackingCode = generateTrackingCode();
    try {
      const travelDate =
        body.travelDate ? new Date(body.travelDate) : null;
      if (travelDate && isNaN(+travelDate)) {
        throw new Error('Invalid travelDate');
      }

      const created = await prisma.visaApplication.create({
        data: {
          fullName: body.fullName || '',
          email: body.email || '',
          countryOfOrigin: body.countryOfOrigin || '',
          destinationCountry: body.destinationCountry || '',
          visaType: body.visaType || '',
          travelDate,
          passportImage: body.passportImage || '',
          residencePermit: body.residencePermit || '',
          personalPhoto: body.personalPhoto || '',
          additionalDocs: body.additionalDocs || '',
          trackingCode,
          status: ApplicationStatus.AWAITING_PAYMENT,
          priceEUR: new Prisma.Decimal(PRICE_EUR.toFixed(2)),
        },
        select: {
          id: true,
          trackingCode: true,
          fullName: true,
          email: true,
          status: true,
          createdAt: true,
        },
      });

      return created;
    } catch (e: any) {
      if (e?.code === 'P2002' && e?.meta?.target?.includes('trackingCode')) {
        attempts += 1;
        continue;
      }
      throw e;
    }
  }
  throw new Error('Could not generate a unique tracking code.');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.email || !body?.fullName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (fullName, email).' },
        { status: 400 }
      );
    }

    const created = await createApplicationWithUniqueCode(body);

    // 📨 خليه غير محاولة، ما يطيّحش الـ API إذا فشل
    (async () => {
      try {
        await sendEmail(created.email, created.trackingCode);
      } catch (err) {
        console.error('sendEmail (apply) failed:', err);
      }
    })();

    return NextResponse.json({
      success: true,
      trackingCode: created.trackingCode,
      // نرجع غير اللي نحتاجوه
      applicant: { fullName: created.fullName, email: created.email },
      status: created.status,
    });
  } catch (err: any) {
    console.error('❌ Error in /apply:', err);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء معالجة الطلب. حاول مرة أخرى.' },
      { status: 500 }
    );
  }
}