// lib/sendPaymentEmail.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendPaymentEmail(to: string, trackingCode: string, amount: number, currency: string) {
  if (!to || !trackingCode || !amount) {
    throw new Error('Missing required payment email fields');
  }

  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'SwiftVisa <noreply@swiftvisaonline.com>',
      to,
      subject: 'تم استلام دفعتك – SwiftVisa',
      html: `
        <p>مرحباً،</p>
        <p>نشكر لك الدفع. تم استلام مبلغ <strong>${amount} ${currency}</strong> بنجاح.</p>
        <p>رقم تتبع طلبك هو: <strong>${trackingCode}</strong></p>
        <p>يمكنك تتبع طلبك عبر الرابط التالي:</p>
        <p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/tracking" target="_blank" style="color: #1D4ED8;">
            تتبع طلبك الآن
          </a>
        </p>
        <p>مع تحياتنا،<br/>فريق SwiftVisa</p>
      `,
    });

    console.log('✅ Payment confirmation email sent:', response);
    return response;
  } catch (error: any) {
    console.error('❌ sendPaymentEmail error:', error?.message || error);
    throw new Error('Failed to send payment confirmation email');
  }
}