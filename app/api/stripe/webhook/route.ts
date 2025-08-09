// app/api/stripe/webhook/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import type { ApplicationStatus, PaymentStatus } from '@prisma/client';
import { sendEmail } from '@/lib/sendEmail'; // ← دالتك

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;
  try {
    const bodyBuffer = Buffer.from(await req.arrayBuffer());
    event = stripe.webhooks.constructEvent(bodyBuffer, sig, endpointSecret);
  } catch (err: any) {
    console.error('❌ Webhook signature verify failed:', err?.message || err);
    return new NextResponse('Invalid signature', { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const trackingCode = session.metadata?.trackingCode || null;
      const currency = session.currency?.toUpperCase() || 'EUR';
      const amount = session.amount_total != null ? session.amount_total / 100 : null;

      if (trackingCode) {
        // 1) تحديث الطلب في قاعدة البيانات
        const app = await prisma.visaApplication.update({
          where: { trackingCode },
          data: {
            paymentStatus: 'PAID' as PaymentStatus,
            status: 'PENDING' as ApplicationStatus,
            paymentSessionId: session.id,
            paymentIntentId:
              typeof session.payment_intent === 'string' ? session.payment_intent : null,
            currency,
            amountPaid: amount ?? undefined,
          },
          select: {
            email: true,
            trackingCode: true,
            receiptEmailSentAt: true,
          },
        });

        // 2) إرسال إيميل إذا مازال ما تبعثش
        if (!app.receiptEmailSentAt && app.email) {
          try {
            await sendEmail(app.email, app.trackingCode);

            await prisma.visaApplication.update({
              where: { trackingCode },
              data: { receiptEmailSentAt: new Date() },
            });
          } catch (mailErr) {
            console.error('✉️ sendEmail error:', mailErr);
          }
        }
      }
    }

    // في حالة فشل الدفع أو انتهاء صلاحية السيشن
    if (
      event.type === 'checkout.session.async_payment_failed' ||
      event.type === 'checkout.session.expired'
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      const trackingCode = session.metadata?.trackingCode;
      if (trackingCode) {
        await prisma.visaApplication.update({
          where: { trackingCode },
          data: {
            paymentStatus: 'FAILED' as PaymentStatus,
            status: 'AWAITING_PAYMENT' as ApplicationStatus,
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error('❌ Webhook handler error:', e);
    return new NextResponse('Webhook error', { status: 500 });
  }
}