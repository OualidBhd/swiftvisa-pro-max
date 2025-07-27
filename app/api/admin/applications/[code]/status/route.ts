import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ApplicationStatus } from '@prisma/client';
import { Resend } from 'resend';
import type { NextRequest } from 'next/server';

// إعداد Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// الحالات المسموح بها
const ALLOWED_STATUSES: ApplicationStatus[] = [
  ApplicationStatus.PENDING,
  ApplicationStatus.APPROVED,
  ApplicationStatus.REJECTED,
  ApplicationStatus.AWAITING_PAYMENT,
];

// *************** [ GET ] ***************
export async function GET(_req: NextRequest, { params }: { params: { code: string } }) {
  const code = params.code;

  if (!code) {
    return NextResponse.json({ error: 'رمز التتبع مفقود' }, { status: 400 });
  }

  try {
    const application = await db.visaApplication.findUnique({
      where: { trackingCode: code },
      select: { trackingCode: true, status: true },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'لم يتم العثور على الطلب بهذا الرمز' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (err) {
    console.error('❌ فشل في جلب الطلب:', err);
    return NextResponse.json({ error: 'فشل في جلب الطلب' }, { status: 500 });
  }
}

// *************** [ PATCH ] ***************
export async function PATCH(req: NextRequest, { params }: { params: { code: string } }) {
  const code = params.code;

  if (!code) {
    return NextResponse.json({ error: 'رمز التتبع مفقود' }, { status: 400 });
  }

  let body: { status: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'الطلب يحتوي على بيانات غير صالحة' },
      { status: 400 }
    );
  }

  if (!body.status) {
    return NextResponse.json({ error: 'الحالة مفقودة' }, { status: 400 });
  }

  const status = body.status.toUpperCase() as ApplicationStatus;
  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: 'القيمة المدخلة للحالة غير صالحة' },
      { status: 400 }
    );
  }

  try {
    const existing = await db.visaApplication.findUnique({
      where: { trackingCode: code },
      select: { trackingCode: true, status: true, email: true, fullName: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'لم يتم العثور على الطلب بهذا الرمز' },
        { status: 404 }
      );
    }

    const updated = await db.visaApplication.update({
      where: { trackingCode: code },
      data: { status },
      select: { trackingCode: true, status: true, email: true, fullName: true },
    });

    try {
      await resend.emails.send({
        from: 'SwiftVisa <noreply@swiftvisaonline.com>',
        to: updated.email,
        subject: `تحديث حالة طلبك رقم ${updated.trackingCode}`,
        html: `
          <p>مرحباً ${updated.fullName},</p>
          <p>تم تحديث حالة طلبك إلى: <b>${updated.status}</b></p>
          <p>رمز التتبع: ${updated.trackingCode}</p>
          <p>شكراً لاستخدامك SwiftVisa.</p>
        `,
      });
    } catch (emailErr) {
      console.error('❌ فشل إرسال البريد:', emailErr);
    }

    return NextResponse.json({
      success: true,
      message: `تم تغيير الحالة إلى ${status} وتم إرسال بريد إلكتروني.`,
      application: updated,
    });
  } catch (err) {
    console.error('❌ فشل في تحديث الطلب:', err);
    return NextResponse.json({ error: 'فشل في تحديث الطلب' }, { status: 500 });
  }
}