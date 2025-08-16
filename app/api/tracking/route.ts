import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { trackingCode } = await req.json();
    if (!trackingCode || typeof trackingCode !== 'string') {
      return NextResponse.json({ success: false, error: 'رمز تتبع غير صالح.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    }

    const app = await prisma.visaApplication.findUnique({
      where: { trackingCode },
      select: {
        fullName: true,
        email: true,
        countryOfOrigin: true,
        destinationCountry: true,
        visaType: true,
        travelDate: true,
        trackingCode: true,
        status: true,          // حالة الطلب (قيد المعالجة/…)
        paymentStatus: true,   // حالة الدفع (PAID / PENDING / FAILED)
        updatedAt: true,
      },
    });

    if (!app) {
      return NextResponse.json({ success: false, error: 'الطلب غير موجود.' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
    }

    return NextResponse.json({ success: true, application: app }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' },
    });
  } catch (err) {
    console.error('خطأ أثناء التتبع:', err);
    return NextResponse.json({ success: false, error: 'حدث خطأ غير متوقع.' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}