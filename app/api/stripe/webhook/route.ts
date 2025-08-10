// app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import type { ApplicationStatus, PaymentStatus } from '@prisma/client';
import { sendPaymentEmail } from '@/lib/sendPaymentEmail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;
  try {
    // raw body ضروري للتحقق من التوقيع
    const bodyBuffer = Buffer.from(await req.arrayBuffer());
    event = stripe.webhooks.constructEvent(bodyBuffer, sig, endpointSecret);
  } catch (err: any) {
    console.error('❌ Webhook signature verify failed:', err?.message || err);
    return new NextResponse('Invalid signature', { status: 400 });
  }

  try {
    // --------- الدفع ناجح ----------
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const trackingCode = session.metadata?.trackingCode || null;
      const currency = session.currency?.toUpperCase() || 'EUR';
      const amount =
        session.amount_total != null ? session.amount_total / 100 : null;

      // أحياناً metadata كتكون فارغة، كنحاول نلقاه عبر session.id
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
        console.warn('⚠️ No application matched for this session.', {
          trackingCode,
          sessionId: session.id,
        });
        return NextResponse.json({ received: true });
      }

      // حدّث السجل: هنا نفصل where حسب اللي متوفر
      if (trackingCode) {
        await prisma.visaApplication.update({
          where: { trackingCode },
          data: {
            paymentStatus: 'PAID' as PaymentStatus,
            status: 'PENDING' as ApplicationStatus,
            paymentSessionId: session.id,
            paymentIntentId:
              typeof session.payment_intent === 'string'
                ? session.payment_intent
                : null,
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
            paymentIntentId:
              typeof session.payment_intent === 'string'
                ? session.payment_intent
                : null,
            currency,
            amountPaid: amount ?? undefined,
          },
        });
      }

      console.log('✅ Application updated to PAID/PENDING', {
        trackingCode: trackingCode ?? appExists.trackingCode,
        sessionId: session.id,
        amount,
        currency,
      });

      // إيصال الدفع (مرة واحدة فقط)
      if (!appExists.receiptEmailSentAt && appExists.email && amount) {
        try {
          await sendPaymentEmail(
            appExists.email,
            appExists.trackingCode,
            amount,
            currency
          );
          await prisma.visaApplication.update({
            where: { trackingCode: appExists.trackingCode },
            data: { receiptEmailSentAt: new Date() },
          });
        } catch (mailErr) {
          console.error('✉️ sendPaymentEmail error:', mailErr);
        }
      }
    }

    // --------- الدفع فشل / الجلسة سالات ----------
    if (
      event.type === 'checkout.session.async_payment_failed' ||
      event.type === 'checkout.session.expired'
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      const trackingCode = session.metadata?.trackingCode || null;

      try {
        if (trackingCode) {
          await prisma.visaApplication.update({
            where: { trackingCode },
            data: {
              paymentStatus: 'FAILED' as PaymentStatus,
              status: 'AWAITING_PAYMENT' as ApplicationStatus,
            },
          });
        } else {
          await prisma.visaApplication.updateMany({
            where: { paymentSessionId: session.id },
            data: {
              paymentStatus: 'FAILED' as PaymentStatus,
              status: 'AWAITING_PAYMENT' as ApplicationStatus,
            },
          });
        }
        console.log('ℹ️ Marked as FAILED/AWAITING_PAYMENT', {
          trackingCode,
          sessionId: session.id,
        });
      } catch (e) {
        console.error('Update failed on failed/expired event:', e);
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error('❌ Webhook handler error:', e);
    // رجّع 200 باش Stripe مايعيدش الإرسال بلا نهاية
    return NextResponse.json({ received: true });
  }
}