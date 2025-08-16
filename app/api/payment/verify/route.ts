import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import type { ApplicationStatus, PaymentStatus } from '@prisma/client';
import { sendPaymentEmail } from '@/lib/sendPaymentEmail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'missing session_id' }, { status: 400 });
    }

    // 1) جب السيشن من Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_intent'] });

    // 2) تحقق من الدفع
    const isPaid = session.payment_status === 'paid';
    const intentSucceeded =
      typeof session.payment_intent === 'object' &&
      (session.payment_intent as Stripe.PaymentIntent).status === 'succeeded';
    const isComplete = session.status === 'complete';
    const paid = (isPaid || intentSucceeded) && isComplete;

    // 3) جيب trackingCode
    const trackingCode = session.metadata?.trackingCode || session.client_reference_id || null;

    if (!paid) {
      return NextResponse.json({ success: false, error: 'not paid', session }, { status: 200 });
    }
    if (!trackingCode) {
      return NextResponse.json({ success: false, error: 'missing trackingCode in session', session }, { status: 200 });
    }

    // 4) حدّث السجل فالداتابيز (مهم! كان ناقص عندك)
    const updateData = {
      paymentStatus: 'PAID' as PaymentStatus,
      status: 'PENDING' as ApplicationStatus, // قيد المعالجة
      paymentSessionId: session.id,
      paymentIntentId:
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : (session.payment_intent as Stripe.PaymentIntent | null)?.id ?? null,
      currency: (session.currency || 'eur').toUpperCase(),
      amountPaid: session.amount_total != null ? session.amount_total / 100 : undefined,
    };

    const res1 = await prisma.visaApplication.updateMany({
      where: { trackingCode },
      data: updateData,
    });
    if (res1.count === 0) {
      // لو ما لقاوش بالتتبع، جرّب بالجلسة
      await prisma.visaApplication.updateMany({
        where: { paymentSessionId: session.id },
        data: updateData,
      });
    }

    // 5) جيب آخر نسخة طريّة من الطلب
    const app = await prisma.visaApplication.findFirst({
      where: { trackingCode },
      select: {
        trackingCode: true,
        status: true,
        paymentStatus: true,
        amountPaid: true,   // Prisma.Decimal
        currency: true,
        fullName: true,
        email: true,
        receiptEmailSentAt: true,
        updatedAt: true,
      },
    });

    // 6) حوّل Decimal -> number للإيميل
    const amount =
      app?.amountPaid == null
        ? null
        : typeof (app.amountPaid as any).toNumber === 'function'
        ? (app.amountPaid as any).toNumber()
        : Number(app.amountPaid);

    // 7) ابعث إيصال الدفع مرة واحدة فقط
    if (app && !app.receiptEmailSentAt && app.email && amount != null) {
      try {
        await sendPaymentEmail(app.email, app.trackingCode, amount, app.currency || 'EUR');
        await prisma.visaApplication.update({
          where: { trackingCode: app.trackingCode },
          data: { receiptEmailSentAt: new Date() },
        });
      } catch (mailErr) {
        console.error('✉️ sendPaymentEmail error:', mailErr);
      }
    }

    return NextResponse.json(
      { success: true, app, sessionId },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (e: any) {
    console.error('verify error:', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}