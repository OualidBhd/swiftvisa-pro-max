import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

// Generate a unique tracking code
const generateTrackingCode = (): string => {
  const part = Math.random().toString(36).substring(2, 8).toUpperCase();
  const date = Date.now().toString(36).toUpperCase();
  return `${part}-${date}`;
};

// Validate required environment variables
const validateEnv = () => {
  if (
    !process.env.EMAIL_SERVER_USER ||
    !process.env.EMAIL_SERVER_PASSWORD ||
    !process.env.NEXT_PUBLIC_BASE_URL
  ) {
    throw new Error('Required environment variables are missing.');
  }
};

// Send email using nodemailer
const sendEmail = async (to: string, trackingCode: string) => {
  validateEnv();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"SwiftVisa" <${process.env.EMAIL_SERVER_USER}>`,
    to,
    subject: 'Your Visa Application - Tracking Code',
    html: `
      <p>Dear Applicant,</p>
      <p>Thank you for submitting your visa application to <strong>SwiftVisa</strong>.</p>
      <p>Your tracking code is: <strong>${trackingCode}</strong></p>
      <p>You can track your application status at any time using your email and this code.</p>
      <p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/tracking" target="_blank">
          Click here to track your application
        </a>
      </p>
      <p>Best regards,<br/>SwiftVisa Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received application data:', body);

    // Validate required fields
    if (!body.email || !body.fullName || !body.visaType) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const trackingCode = generateTrackingCode();

    // Save application to the database
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

    // Send tracking code email
    await sendEmail(body.email, trackingCode);

    return NextResponse.json({ success: true, application: created });
  } catch (err: any) {
    console.error('Error in /apply:', err.message || err);

    return NextResponse.json(
      { success: false, error: 'An error occurred while processing your application.' },
      { status: 500 }
    );
  }
}