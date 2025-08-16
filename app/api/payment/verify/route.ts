import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import type { ApplicationStatus, PaymentStatus } from '@prisma/client';

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

    // 1) جيب الجلسة من Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_intent'] });

    // 2) تأكد الدفع صحيح
    const isPaid = session.payment_status === 'paid';
    const intentSucceeded =
      typeof session.payment_intent === 'object' &&
      (session.payment_intent as Stripe.PaymentIntent).status === 'succeeded';
    const isComplete = session.status === 'complete';

    const paid = (isPaid || intentSucceeded) && isComplete;

    // 3) trackingCode
    const trackingCode = session.metadata?.trackingCode || session.client_reference_id || null;

    if (!paid) {
      return NextResponse.json(
        { success: false, error: 'not paid', session },
        { status: 200, headers: { 'Cache-Control': 'no-store' } }
      );
    }
    if (!trackingCode) {
      return NextResponse.json(
        { success: false, error: 'missing trackingCode in session', session },
        { status: 200, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // 4) حدّث الطلب (بدون Webhook)
    const data = {
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

    // جرّب بالتتبع أولاً، ثم بالجلسة إذا ما لقا
    const res1 = await prisma.visaApplication.updateMany({ where: { trackingCode }, data });
    if (res1.count === 0) {
      await prisma.visaApplication.updateMany({ where: { paymentSessionId: session.id }, data });
    }

    // 5) رجّع نسخة طريّة للواجهة
    const app = await prisma.visaApplication.findFirst({
      where: { trackingCode },
      select: {
        trackingCode: true,
        status: true,
        paymentStatus: true,
        amountPaid: true,
        currency: true,
        fullName: true,
        email: true,
        visaType: true,
        travelDate: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { success: true, app, sessionId },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (e: any) {
    console.error('verify error:', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}