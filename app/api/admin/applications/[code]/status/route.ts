import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ApplicationStatus } from '@prisma/client';

// الحالات المسموحة
const ALLOWED_STATUSES: ApplicationStatus[] = [
  ApplicationStatus.PENDING,
  ApplicationStatus.APPROVED,
  ApplicationStatus.REJECTED,
];

export async function PATCH(req: NextRequest, context: { params: { code: string } }) {
  const { code } = context.params;

  if (!code) {
    return NextResponse.json({ error: 'رمز التتبع مفقود' }, { status: 400 });
  }

  // قراءة Body
  let body: { status?: string };
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ error: 'الطلب يحتوي على بيانات غير صالحة' }, { status: 400 });
  }

  const { status } = body;
  if (!status) {
    return NextResponse.json({ error: 'الحالة مفقودة' }, { status: 400 });
  }

  const normalizedStatus = status.toUpperCase() as ApplicationStatus;

  // تحقق من صحة الحالة
  if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
    return NextResponse.json({ error: 'القيمة المدخلة للحالة غير صالحة' }, { status: 400 });
  }

  try {
    // تحقق من وجود الطلب
    const existing = await db.visaApplication.findUnique({
      where: { trackingCode: code },
      select: { trackingCode: true, status: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'لم يتم العثور على الطلب بهذا الرمز' }, { status: 404 });
    }

    // تحديث حالة الطلب
    const updated = await db.visaApplication.update({
      where: { trackingCode: code },
      data: { status: normalizedStatus },
      select: { trackingCode: true, status: true },
    });

    return NextResponse.json({
      success: true,
      message: `تم تغيير الحالة إلى ${normalizedStatus}`,
      application: updated,
    });
  } catch (err) {
    console.error('❌ فشل في تحديث الطلب:', err);
    return NextResponse.json({ error: 'فشل في تحديث الطلب' }, { status: 500 });
  }
}