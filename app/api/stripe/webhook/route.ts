// app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import type { ApplicationStatus, PaymentStatus } from '@prisma/client';
import { sendPaymentEmail } from '@/lib/sendPaymentEmail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-07-30.basil' });
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

function log(...args: any[]) {
  console.log('[WEBHOOK]', ...args);
}

export async function POST(req: Request) {
  log('HIT', { url: req.url });

  const sig = req.headers.get('stripe-signature') || '';
  let event: Stripe.Event | null = null;

  // 1) حاول نحقق التوقيع
  try {
    const rawBody = Buffer.from(await req.arrayBuffer());
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    log('Signature OK');
  } catch (err: any) {
    log('Signature verify FAILED:', err?.message);

    // 2) فالمحلي فقط، خلّينا fallback بلا تحقق باش نعرّفو المشكل
    if (process.env.NODE_ENV === 'development') {
      try {
        const json = await req.json();
        event = json as Stripe.Event;
        log('DEV FALLBACK: parsed JSON event without signature');
      } catch (e) {
        log('DEV FALLBACK parse failed:', (e as Error).message);
        return new NextResponse('Invalid signature', { status: 400 });
      }
    } else {
      return new NextResponse('Invalid signature', { status: 400 });
    }
  }

  try {
    if (!event) {
      log('No event parsed');
      return NextResponse.json({ received: true });
    }

    log('Event type:', event.type);

    // ===== SUCCESS =====
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const trackingCode = session.metadata?.trackingCode || null;
      const currency = session.currency?.toUpperCase() || 'EUR';
      const amount = session.amount_total != null ? session.amount_total / 100 : null;

      log('Session:', { id: session.id, trackingCode, amount, currency });

      // لقا الطلب
      const appExists =
        (trackingCode &&
          (await prisma.visaApplication.findFirst({
            where: { trackingCode },
            select: { id: true, email: true, trackingCode: true, receiptEmailSentAt: true },
          }))) ||
        (await prisma.visaApplication.findFirst({
          where: { paymentSessionId: session.id },
          select: { id: true, email: true, trackingCode: true, receiptEmailSentAt: true },
        }));

      if (!appExists) {
        log('⚠️ No application matched for this session', { trackingCode, sessionId: session.id });
        return NextResponse.json({ received: true });
      }

      // حدّث
      const whereByTracking = trackingCode ? { trackingCode } : undefined;

      if (whereByTracking) {
        await prisma.visaApplication.update({
          where: whereByTracking,
          data: {
            paymentStatus: 'PAID' as PaymentStatus,
            status: 'PENDING' as ApplicationStatus,
            paymentSessionId: session.id,
            paymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
            currency,
            amountPaid: amount ?? undefined,
          },
        });
      } else {
        await prisma.visaApplication.updateMany({
          where: { paymentSessionId: session.id },
          data: {
            paymentStatus: 'PAID' as PaymentStatus,
            status: 'PENDING' as ApplicationStatus,
            paymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
            currency,
            amountPaid: amount ?? undefined,
          },
        });
      }

      log('✅ Updated to PAID/PENDING', { trackingCode: trackingCode ?? appExists.trackingCode });

      // إيصال
      if (!appExists.receiptEmailSentAt && appExists.email && amount) {
        try {
          await sendPaymentEmail(appExists.email, appExists.trackingCode, amount, currency);
          await prisma.visaApplication.update({
            where: { trackingCode: appExists.trackingCode },
            data: { receiptEmailSentAt: new Date() },
          });
          log('✉️ receipt sent to', appExists.email);
        } catch (mailErr) {
          log('✉️ sendPaymentEmail error:', mailErr);
        }
      }
    }

    // ===== FAILED / EXPIRED =====
    if (
      event.type === 'checkout.session.async_payment_failed' ||
      event.type === 'checkout.session.expired'
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      const trackingCode = session.metadata?.trackingCode || null;
      log('Mark FAILED/AWAITING_PAYMENT for', { trackingCode, sessionId: session.id });

      if (trackingCode) {
        await prisma.visaApplication.update({
          where: { trackingCode },
          data: { paymentStatus: 'FAILED' as PaymentStatus, status: 'AWAITING_PAYMENT' as ApplicationStatus },
        });
      } else {
        await prisma.visaApplication.updateMany({
          where: { paymentSessionId: session.id },
          data: { paymentStatus: 'FAILED' as PaymentStatus, status: 'AWAITING_PAYMENT' as ApplicationStatus },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    log('Handler error:', e);
    // رجّع 200 باش Stripe ما يعاودش spam
    return NextResponse.json({ received: true });
  }
}