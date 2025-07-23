import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const applications = await db.visaApplication.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        trackingCode: true, // مهم نستعمل trackingCode
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
    })

    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
    })
  } catch (err) {
    console.error('❌ فشل في جلب الطلبات:', err)
    return NextResponse.json({ success: false, error: 'فشل تحميل الطلبات' }, { status: 500 })
  }
}