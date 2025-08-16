import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import type { ApplicationStatus, PaymentStatus } from '@prisma/client';

export const runtime = 'nodejs';        // مهم: ماشي edge
export const dynamic = 'force-dynamic'; // بلا كاش

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {  
  apiVersion: '2025-07-30.basil' as any  
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

function log(...args: any[]) {
  console.log('[WEBHOOK]', ...args);
}

export async function POST(req: Request) {
  log('HIT', req.url);

  const sig = req.headers.get('stripe-signature');
  if (!sig) {
    log('❌ Missing stripe-signature header');
    return new NextResponse('No signature', { status: 400 });
  }

  // raw body ضروري للتحقق
  let event: Stripe.Event;
  try {
    const rawBody = Buffer.from(await req.arrayBuffer());
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    log('Signature OK →', event.type);
  } catch (err: any) {
    log('❌ Signature verify failed:', err?.message || err);
    // رجّع 400 باش Stripe يعرف أنه فشل
    return new NextResponse('Invalid signature', { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const trackingCode = session.metadata?.trackingCode || null;
      const currency = (session.currency || 'eur').toUpperCase();
      const amount = session.amount_total != null ? session.amount_total / 100 : null;

      // لقا الطلب
      const app =
        (trackingCode &&
          (await prisma.visaApplication.findFirst({
            where: { trackingCode },
            select: { id: true, email: true, trackingCode: true, receiptEmailSentAt: true },
          }))) ||
        (await prisma.visaApplication.findFirst({
          where: { paymentSessionId: session.id },
          select: { id: true, email: true, trackingCode: true, receiptEmailSentAt: true },
        }));

      if (!app) {
        log('⚠️ No application matched', { trackingCode, sessionId: session.id });
        return NextResponse.json({ received: true });
      }

      // حدّث الدفع + حالة الطلب
      const data = {
        paymentStatus: 'PAID' as PaymentStatus,
        status: 'PENDING' as ApplicationStatus,
        paymentSessionId: session.id,
        paymentIntentId:
          typeof session.payment_intent === 'string' ? session.payment_intent : null,
        currency,
        amountPaid: amount ?? undefined,
      };

      if (trackingCode) {
        await prisma.visaApplication.update({ where: { trackingCode }, data });
      } else {
        await prisma.visaApplication.updateMany({ where: { paymentSessionId: session.id }, data });
      }
      log('✅ Updated to PAID / PENDING', { code: trackingCode ?? app.trackingCode });
    }

    if (
      event.type === 'checkout.session.async_payment_failed' ||
      event.type === 'checkout.session.expired'
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      const trackingCode = session.metadata?.trackingCode || null;

      const data = {
        paymentStatus: 'FAILED' as PaymentStatus,
        status: 'AWAITING_PAYMENT' as ApplicationStatus,
      };

      if (trackingCode) {
        await prisma.visaApplication.update({ where: { trackingCode }, data });
      } else {
        await prisma.visaApplication.updateMany({ where: { paymentSessionId: session.id }, data });
      }
      log('ℹ️ Marked FAILED/AWAITING_PAYMENT', { trackingCode });
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    log('❌ Handler error:', e);
    // رجّع 200 باش Stripe ما يعاودش بزّاف
    return NextResponse.json({ received: true });
  }
}