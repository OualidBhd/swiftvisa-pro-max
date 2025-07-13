import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const applications = await db.visaApplication.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        countryOfOrigin: true,
        destinationCountry: true,
        visaType: true,
        travelDate: true,
        passportImage: true,
        residencePermit: true,
        personalPhoto: true,
        additionalDocs: true,
        trackingCode: true,
        status: true,
        createdAt: true,
      },
    })

    return NextResponse.json(applications)
  } catch (err) {
    console.error('❌ فشل في جلب الطلبات:', err)
    return NextResponse.json({ error: 'فشل تحميل الطلبات' }, { status: 500 })
  }
}