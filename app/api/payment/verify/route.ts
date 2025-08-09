// app/api/payment/verify/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { PaymentStatus, ApplicationStatus } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any,
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      return NextResponse.json({ success: false, errorMessage: 'Missing session_id' }, { status: 400 });
    }

    // 1) لقاه مباشرة فـ DB
    let app = await prisma.visaApplication.findFirst({
      where: { paymentSessionId: sessionId },
      select: {
        trackingCode: true,
        fullName: true,
        paymentStatus: true,
        status: true,
        amountPaid: true,
        currency: true,
        updatedAt: true,
      },
    });

    // 2) إلا ما لقاوش، رجع لـ Stripe
    if (!app) {
      const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_intent'] });
      const trackingCode = session.metadata?.trackingCode || null;

      if (!trackingCode) {
        return NextResponse.json({ success: false, errorMessage: 'No tracking code found' }, { status: 404 });
      }

      // جرّب تجيب السجل بهاد التراكينغ
      app = await prisma.visaApplication.findUnique({
        where: { trackingCode },
        select: {
          trackingCode: true,
          fullName: true,
          paymentStatus: true,
          status: true,
          amountPaid: true,
          currency: true,
          updatedAt: true,
        },
      });

      // 2-b) Soft-sync إلى كان الدفع ناجح ومازال DB ما تحدّثتش
      if (session.payment_status === 'paid' && app) {
        const amount = session.amount_total != null ? session.amount_total / 100 : null;
        const currency = session.currency?.toUpperCase() || 'EUR';

        await prisma.visaApplication.update({
          where: { trackingCode },
          data: {
            paymentStatus: PaymentStatus.PAID,
            status: ApplicationStatus.PENDING,
            amountPaid: amount != null ? amount : undefined,
            currency,
          },
        });

        // رجّع النسخة المحدثة
        app = await prisma.visaApplication.findUnique({
          where: { trackingCode },
          select: {
            trackingCode: true,
            fullName: true,
            paymentStatus: true,
            status: true,
            amountPaid: true,
            currency: true,
            updatedAt: true,
          },
        });
      }
    }

    if (!app) {
      return NextResponse.json({ success: false, errorMessage: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, app });
  } catch (e: any) {
    console.error('verify error:', e?.message || e);
    return NextResponse.json({ success: false, errorMessage: 'Verify failed' }, { status: 500 });
  }
}