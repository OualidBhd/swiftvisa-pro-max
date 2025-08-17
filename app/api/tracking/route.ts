// app/api/tracking/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function normalizeExtra(additionalDocs?: string | null) {
  return additionalDocs
    ? String(additionalDocs).split(',').map(s => s.trim()).filter(Boolean)
    : [];
}

async function fetchApplicationByCode(code: string) {
  const app = await prisma.visaApplication.findUnique({
    where: { trackingCode: code },
    select: {
      // المعلومات الأساسية
      fullName: true,
      email: true,
      countryOfOrigin: true,
      destinationCountry: true,
      visaType: true,
      travelDate: true,
      trackingCode: true,
      status: true,
      paymentStatus: true,
      updatedAt: true,
      // ✅ الوثائق
      passportImage: true,
      residencePermit: true,
      personalPhoto: true,
      additionalDocs: true,
    },
  });

  if (!app) return null;

  return {
    ...app,
    // ✅ رجّعها كمصفوفة
    additionalDocs: normalizeExtra(app.additionalDocs as any),
  };
}

// ✅ دعم GET ?code=XYZ (مفيد للروابط)
//    وباقي كاين POST { trackingCode }
export async function GET(req: NextRequest) {
  const code = (new URL(req.url).searchParams.get('code') || '').trim();
  if (!code) {
    return NextResponse.json(
      { success: false, error: 'MISSING_CODE' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const app = await fetchApplicationByCode(code);
  if (!app) {
    return NextResponse.json(
      { success: false, error: 'NOT_FOUND' },
      { status: 404, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  return NextResponse.json(
    { success: true, application: app },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
  );
}

export async function POST(req: NextRequest) {
  try {
    const { trackingCode } = await req.json();
    if (!trackingCode || typeof trackingCode !== 'string') {
      return NextResponse.json(
        { success: false, error: 'رمز تتبع غير صالح.' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const app = await fetchApplicationByCode(trackingCode);
    if (!app) {
      return NextResponse.json(
        { success: false, error: 'الطلب غير موجود.' },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    return NextResponse.json(
      { success: true, application: app },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (err) {
    console.error('خطأ أثناء التتبع:', err);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ غير متوقع.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}