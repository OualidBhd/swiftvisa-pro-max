// lib/sendEmail.ts
import nodemailer from 'nodemailer';

export async function sendTrackingEmail(to: string, trackingCode: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: 'تأكيد تقديم طلب الفيزا',
    html: `
      <p>شكرًا لتقديم طلبك.</p>
      <p>رمز تتبع طلبك هو: <strong>${trackingCode}</strong></p>
      <p>يمكنك متابعة حالة طلبك من خلال صفحة التتبع.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}