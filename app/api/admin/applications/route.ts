// app/api/admin/applications/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.ADMIN_FROM_EMAIL || 'SwiftVisa <noreply@swiftvisaonline.com>';
const ADMIN_COOKIE = 'sv_admin';

async function ensureAdmin() {
  const jar = await cookies();
  const ok = jar.get(ADMIN_COOKIE)?.value;
  if (!ok) throw new Error('UNAUTHORIZED');
}

// 🟢 جلب جميع الطلبات
export async function GET() {
  try {
    await ensureAdmin();

    const applications = await prisma.visaApplication.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        trackingCode: true,
        countryOfOrigin: true,
        destinationCountry: true,
        visaType: true,
        travelDate: true,
        status: true,
        paymentStatus: true,
        passportImage: true,
        residencePermit: true,
        personalPhoto: true,
        additionalDocs: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, applications });
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'SERVER_ERROR' }, { status: 500 });
  }
}

// 🟡 تحديث حالة الطلب
export async function PATCH(req: Request) {
  try {
    await ensureAdmin();

    const { trackingCode, status } = await req.json();
    if (!trackingCode || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ success: false, error: 'BAD_REQUEST' }, { status: 400 });
    }

    // تحديث الطلب بناءً على trackingCode
    const updated = await prisma.visaApplication.update({
      where: { trackingCode },
      data: { status },
      select: {
        email: true,
        trackingCode: true,
        status: true,
        visaType: true,
        countryOfOrigin: true,
        destinationCountry: true
      }
    });

    // رسالة الإيميل
    const subject =
      status === 'APPROVED'
        ? `✅ تم قبول طلبك — كود: ${updated.trackingCode}`
        : `❌ تم رفض طلبك — كود: ${updated.trackingCode}`;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height:1.7">
        <h2>${status === 'APPROVED' ? '✅ تم قبول طلب التأشيرة' : '❌ تم رفض طلب التأشيرة'}</h2>
        <p>رقم التتبع: <strong>${updated.trackingCode}</strong></p>
        <p>نوع التأشيرة: <strong>${updated.visaType}</strong></p>
        <p>الوجهة: ${updated.countryOfOrigin} → ${updated.destinationCountry}</p>
        <p style="margin-top:16px;color:#555">شكراً لاختيارك <strong>SwiftVisa</strong>.</p>
      </div>
    `;

    // إرسال الإيميل إذا عندنا API Key
    if (process.env.RESEND_API_KEY && updated.email) {
      try {
        await resend.emails.send({
          from: FROM,
          to: updated.email,
          subject,
          html,
        });
      } catch (mailErr) {
        console.error('Resend error:', mailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    if (e?.message === 'UNAUTHORIZED') {
      return NextResponse.json({ success: false, error: 'UNAUTHORIZED' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'NOT_FOUND' }, { status: 404 });
  }
}