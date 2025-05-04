import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

// توليد كود تتبع فريد
const generateTrackingCode = (): string => {
  const part = Math.random().toString(36).substring(2, 8).toUpperCase();
  const date = Date.now().toString(36).toUpperCase();
  return `${part}-${date}`;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
console.log('Received data:', body); // <-- أضف هذا السطر
  const trackingCode = generateTrackingCode();

  if (!body.email) {
    return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
  }

  try {
    const created = await prisma.application.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        countryOfOrigin: body.countryOfOrigin,
        destinationCountry: body.destinationCountry,
        visaType: body.visaType,
        ...(body.travelDate && { travelDate: new Date(body.travelDate) }),
        passportImage: body.passportImage,
        residencePermit: body.residencePermit,
        personalPhoto: body.personalPhoto,
        additionalDocs: body.additionalDocs || '',
        trackingCode,
      },
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"SwiftVisa" <${process.env.EMAIL_SERVER_USER}>`,
      to: body.email,
      subject: 'Your Visa Application Tracking Code',
      html: `
        <p>Thank you for submitting your visa application.</p>
        <p>Your tracking code is: <strong>${trackingCode}</strong></p>
        <p>You can use this code with your email to track your application status on our website.</p>
        <p><a href="http://localhost:3000/tracking" target="_blank">Track your application</a></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, application: created });
  } catch (err) {
    console.error('Error saving or sending email:', err);
    return NextResponse.json({ success: false, error: 'Failed to submit application' }, { status: 500 });
  }
}