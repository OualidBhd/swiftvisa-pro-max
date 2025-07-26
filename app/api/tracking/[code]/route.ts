import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params
    if (!code) {
      return NextResponse.json({ success: false, error: 'رمز التتبع مفقود' }, { status: 400 })
    }

    const application = await prisma.visaApplication.findUnique({
      where: { trackingCode: code },
      select: {
        fullName: true,
        email: true,
        visaType: true,
        travelDate: true,
        status: true,
      },
    })

    if (!application) {
      return NextResponse.json({ success: false, error: 'الطلب غير موجود' }, { status: 404 })
    }

    return NextResponse.json({ success: true, application })
  } catch (err) {
    console.error('خطأ أثناء جلب الطلب:', err)
    return NextResponse.json({ success: false, error: 'حدث خطأ غير متوقع' }, { status: 500 })
  }
}