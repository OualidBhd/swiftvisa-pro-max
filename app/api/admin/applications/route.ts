import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { NextRequest } from 'next/server';

export async function GET(_req: NextRequest) {
  try {
    const applications = await db.visaApplication.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        trackingCode: true,
        fullName: true,
        email: true,
        countryOfOrigin: true,
        destinationCountry: true,
        visaType: true,
        travelDate: true,
        status: true,
        createdAt: true,
        passportImage: true,
        residencePermit: true,
        personalPhoto: true,
        additionalDocs: true,
      },
    });

    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (err) {
    console.error('❌ فشل في جلب الطلبات:', err);
    return NextResponse.json(
      { success: false, error: 'فشل تحميل الطلبات' },
      { status: 500 }
    );
  }
}