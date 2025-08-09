import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/sendEmail';
import { ApplicationStatus, Prisma } from '@prisma/client';

const generateTrackingCode = (): string => {
  const part = Math.random().toString(36).substring(2, 8).toUpperCase();
  const date = Date.now().toString(36).toUpperCase();
  return `${part}-${date}`;
};

async function createApplicationWithUniqueCode(body: any) {
  let attempts = 0;
  while (attempts < 3) {
    const trackingCode = generateTrackingCode();
    try {
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

          // حقول الدفع:
          priceEUR: new Prisma.Decimal('0.99'), // نخليها كنص باش نتفادو مشاكل الفاصلة
          // paymentStatus: PENDING (default فالـ schema)
          // الباقي (paymentSessionId/amountPaid/...) كيتعمر لاحقاً من الويبهوك
        },
        select: {
          id: true,
          trackingCode: true,
          fullName: true,
          email: true,
          status: true,
          priceEUR: true,
          createdAt: true,
        },
      });

      return created; // نجحات
    } catch (e: any) {
      // إعادة المحاولة إذا تصادم trackingCode (P2002)
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

    // إيميل الترحيب + كود التتبع
    await sendEmail(created.email, created.trackingCode);

    return NextResponse.json({
      success: true,
      trackingCode: created.trackingCode,
      visaApplication: created,
    });
  } catch (err: any) {
    console.error('❌ Error in /apply:', err);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء معالجة الطلب. حاول مرة أخرى.' },
      { status: 500 }
    );
  }
}