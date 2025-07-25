import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/sendEmail'; // ✅ كود Resend
import { ApplicationStatus } from '@prisma/client'; // ✅ استيراد الحالة

const generateTrackingCode = (): string => {
  const part = Math.random().toString(36).substring(2, 8).toUpperCase();
  const date = Date.now().toString(36).toUpperCase();
  return `${part}-${date}`;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ✅ تحقق من جميع الحقول المطلوبة
    if (
      !body.fullName ||
      !body.email ||
      !body.countryOfOrigin ||
      !body.destinationCountry ||
      !body.visaType ||
      !body.travelDate ||
      !body.passportImage ||
      !body.residencePermit ||
      !body.personalPhoto
    ) {
      return NextResponse.json(
        { success: false, error: 'المرجو تعبئة جميع الحقول المطلوبة قبل إرسال الطلب.' },
        { status: 400 }
      );
    }

    const trackingCode = generateTrackingCode();

    const created = await prisma.visaApplication.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        countryOfOrigin: body.countryOfOrigin,
        destinationCountry: body.destinationCountry,
        visaType: body.visaType,
        travelDate: new Date(body.travelDate),
        passportImage: body.passportImage,
        residencePermit: body.residencePermit,
        personalPhoto: body.personalPhoto,
        additionalDocs: body.additionalDocs || '',
        trackingCode,
        status: ApplicationStatus.AWAITING_PAYMENT, // ✅ تعيين الحالة الجديدة
      },
    });
    // ✅ الإرسال عن طريق Resend
    await sendEmail(body.email, trackingCode);

    return NextResponse.json({ success: true, visaApplication: created });
  } catch (err: any) {
    console.error('❌ Error in /apply:', err);
    console.error('❌ Prisma error:', JSON.stringify(err, null, 2));
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء معالجة الطلب. حاول مرة أخرى.' },
      { status: 500 }
    );
  }
}