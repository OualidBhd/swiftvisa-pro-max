// lib/sendEmail.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail(to: string, trackingCode: string) {
  if (!to || !trackingCode) {
    throw new Error('Missing email or tracking code');
  }

  try {
    const response = await resend.emails.send({
      from: 'SwiftVisa <onboarding@resend.dev>', // مؤقتاً للبيئة التجريبية
      to,
      subject: 'Your Visa Application - Tracking Code',
      html: `
        <p>Dear Applicant,</p>
        <p>Thank you for submitting your visa application to <strong>SwiftVisa</strong>.</p>
        <p>Your tracking code is: <strong>${trackingCode}</strong></p>
        <p>You can track your application using your email and this code.</p>
        <p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/tracking" target="_blank" style="color: #1D4ED8;">
            Track your application
          </a>
        </p>
      `,
    });

    return response;
  } catch (error: any) {
    console.error('Resend send error:', error?.message || error);
    throw new Error('Failed to send email');
  }
}