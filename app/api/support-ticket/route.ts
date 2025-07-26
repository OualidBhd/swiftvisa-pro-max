import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, trackingCode, subject, message, attachment } = await req.json();

    if (!email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'المرجو ملء جميع الحقول المطلوبة.' },
        { status: 400 }
      );
    }

    // إنشاء سجل في قاعدة البيانات
    const newTicket = await prisma.supportTicket.create({
      data: {
        email,
        trackingCode: trackingCode || null,
        subject,
        message,
        attachment: attachment || null,
      },
    });

    // إرسال بريد تأكيد
    await resend.emails.send({
      from: 'SwiftVisa <noreply@swiftvisaonline.com>',
      to: email,
      subject: `✅ تم استلام طلب الدعم: ${subject}`,
      html: `
        <p>مرحباً،</p>
        <p>لقد استلمنا طلب الدعم الخاص بك.</p>
        <p><b>رمز التتبع:</b> ${trackingCode || 'غير محدد'}</p>
        <p><b>الموضوع:</b> ${subject}</p>
        <p><b>الرسالة:</b></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ success: true, ticket: newTicket });
  } catch (error) {
    console.error('❌ خطأ في إنشاء تذكرة الدعم:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ غير متوقع.' },
      { status: 500 }
    );
  }
}