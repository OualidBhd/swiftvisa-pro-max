// app/api/payment/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus, PaymentStatus } from '@prisma/client';

export const runtime = 'nodejs';

// Stripe client مع apiVersion ثابت
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any,
});

export async function POST(req: Request) {
  try {
    const { trackingCode } = await req.json();

    if (!trackingCode) {
      return NextResponse.json(
        { success: false, errorMessage: 'Missing trackingCode' },
        { status: 400 }
      );
    }

    // جيب الطلب والسعر من الـ DB
    const app = await prisma.visaApplication.findUnique({
      where: { trackingCode },
      select: { priceEUR: true, paymentStatus: true, status: true },
    });

    if (!app || app.priceEUR == null) {
      return NextResponse.json(
        { success: false, errorMessage: 'Invalid tracking code or price' },
        { status: 404 }
      );
    }

    // منع إنشاء جلسة إذا الطلب مدفوع أو ماشي فـ AWAITING_PAYMENT
    const notEligible =
      app.paymentStatus === PaymentStatus.PAID ||
      app.status !== ApplicationStatus.AWAITING_PAYMENT;

    if (notEligible) {
      return NextResponse.json(
        { success: false, errorMessage: 'Already paid or not eligible' },
        { status: 400 }
      );
    }

    const cents = Math.round(Number(app.priceEUR) * 100);
    if (!Number.isFinite(cents) || cents < 50) {
      return NextResponse.json(
        { success: false, errorMessage: 'Invalid server price (< €0.50)' },
        { status: 400 }
      );
    }

    // حدّد base URL
    const envBase = process.env.NEXT_PUBLIC_APP_URL?.trim();
    let base: string | undefined = envBase?.startsWith('http') ? envBase : undefined;
    if (!base) {
      const origin = req.headers.get('origin') || '';
      if (origin.startsWith('http')) base = origin;
    }
    if (!base) {
      const referer = req.headers.get('referer') || '';
      try { if (referer) base = new URL(referer).origin; } catch {}
    }
    if (!base) base = process.env.NODE_ENV === 'production'
? 'https://swiftvisaonline.com'
: 'http://localhost:3000';

    const successUrl = new URL('/payment-success?session_id={CHECKOUT_SESSION_ID}', base).toString();
    const cancelUrl  = new URL('/payment-failed', base).toString();

    // إنشاء جلسة Stripe (بالأورو)
    const session = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: { name: `Visa Application (${trackingCode})` },
              unit_amount: cents,
            },
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { trackingCode },
      },
      { idempotencyKey: `checkout-${trackingCode}` } // حماية من الدبل كليك
    );

    // خزن الـ session.id باش الويبهوك يقدر يعمل fallback
    await prisma.visaApplication.update({
      where: { trackingCode },
      data: { paymentSessionId: session.id },
    });

    return NextResponse.json({ success: true, id: session.id, url: session.url });
  } catch (err: any) {
    console.error('❌ Create session error:', err?.message || err);
    return NextResponse.json(
      { success: false, errorMessage: 'Stripe session failed' },
      { status: 500 }
    );
  }
}