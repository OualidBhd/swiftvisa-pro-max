import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma }  from '@/lib/prisma'; // ✅ استدعاء Prisma Client

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, trackingCode, subject, message, attachment } = await req.json();

    // 1. تخزين التذكرة في قاعدة البيانات
    const newTicket = await prisma.supportTicket.create({
      data: {
        email,
        trackingCode,
        subject,
        message,
        attachment,
      },
    });

    // 2. إعداد الإيميل
    const emailContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2 style="color: #1F2D5A;">تم استلام طلب الدعم الخاص بك</h2>
        <p>مرحباً،</p>
        <p>نشكر لك تواصلك معنا، هذا هو ملخص طلبك:</p>
        <p><strong>رقم التتبع:</strong> ${trackingCode}</p>
        <p><strong>الموضوع:</strong> ${subject}</p>
        <p><strong>الرسالة:</strong></p>
        <p style="background-color: #f8f9fa; padding: 10px; border-radius: 5px;">${message}</p>
        ${attachment ? `<p><strong>📎 المرفق:</strong> <a href="${attachment}" style="color: #1F2D5A; text-decoration: underline;">تحميل الملف</a></p>` : ''}
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #555;">فريق <strong>SwiftVisa</strong></p>
      </div>
    `;

    // 3. إرسال البريد الإلكتروني عبر Resend
    await resend.emails.send({
      from: 'SwiftVisa <noreply@swiftvisaonline.com>',
      to: email,
      subject: `🎟️ تذكرة دعم - ${subject}`,
      html: emailContent,
    });

    return NextResponse.json({ success: true, ticket: newTicket });
  } catch (error) {
    console.error('Email or DB Error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء إنشاء التذكرة أو إرسال البريد الإلكتروني' },
      { status: 500 }
    );
  }
}