import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ApplicationStatus } from '@prisma/client';

// الحالات المسموحة
const ALLOWED_STATUSES: ApplicationStatus[] = [
  ApplicationStatus.PENDING,
  ApplicationStatus.APPROVED,
  ApplicationStatus.REJECTED,
];

export async function PATCH(req: NextRequest, context: any) {
  const { code } = context.params;

  // 1. تحقق من وجود رمز التتبع
  if (!code) {
    return NextResponse.json({ error: 'رمز التتبع مفقود' }, { status: 400 });
  }

  // 2. قراءة البيانات القادمة من Body
  let body: { status?: string };
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json(
      { error: 'الطلب يحتوي على بيانات غير صالحة' },
      { status: 400 }
    );
  }

  const { status } = body;

  // 3. تحقق من وجود الحالة
  if (!status) {
    return NextResponse.json({ error: 'الحالة مفقودة' }, { status: 400 });
  }

  // 4. تطبيع الحالة إلى UPPERCASE حتى تطابق الـ Enum
  const normalizedStatus = status.toUpperCase() as ApplicationStatus;

  // 5. تحقق من أن الحالة ضمن القيم المسموحة
  if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
    return NextResponse.json(
      { error: 'القيمة المدخلة للحالة غير صالحة' },
      { status: 400 }
    );
  }

  try {
    // 6. تحقق من وجود الطلب قبل التحديث
    const existing = await db.visaApplication.findUnique({
      where: { trackingCode: code },
      select: { trackingCode: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'لم يتم العثور على الطلب بهذا الرمز' },
        { status: 404 }
      );
    }

    // 7. تحديث حالة الطلب
    const updated = await db.visaApplication.update({
      where: { trackingCode: code },
      data: { status: normalizedStatus },
      select: { trackingCode: true, status: true },
    });

    return NextResponse.json({
      message: 'تم تحديث حالة الطلب بنجاح',
      application: updated,
    });
  } catch (err) {
    console.error('❌ فشل في تحديث الطلب:', err);
    return NextResponse.json({ error: 'فشل في تحديث الطلب' }, { status: 500 });
  }
}