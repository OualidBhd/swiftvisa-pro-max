import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { trackingCode } = await req.json();

    // تحقق من وجود رمز التتبع وتوافق النوع
    if (!trackingCode || typeof trackingCode !== 'string') {
      return NextResponse.json(
        { success: false, error: 'رمز تتبع غير صالح.' },
        { status: 400 }
      );
    }

    // استعلام عن الطلب باستخدام رمز التتبع فقط
    const application = await prisma.visaApplication.findFirst({
      where: {
        trackingCode,
      },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: 'الطلب غير موجود.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, application });
  } catch (err) {
    console.error('خطأ أثناء التتبع:', err);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ غير متوقع، يرجى المحاولة لاحقًا.' },
      { status: 500 }
    );
  }
}