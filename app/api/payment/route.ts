// app/api/payment/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs'; // Stripe SDK كيحتاج Node

// إذا بغيتي تحدد نسخة الـ API دير السطر التالي وخلي التاريخ اللي فـ Dashboard ديالك:
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { amount, trackingCode } = await req.json();

    // تحقق من المبلغ
    const cents = Math.round(Number(amount) * 100);
    if (!Number.isFinite(cents) || cents < 50) {
      return NextResponse.json({ success: false, error: 'Invalid amount' }, { status: 400 });
    }

    // حدّد base URL بطريقة مرِنة: env -> Origin -> Referer -> localhost
    const envBase = process.env.NEXT_PUBLIC_APP_URL?.trim();
    let base: string | undefined =
      envBase && envBase.startsWith('http') ? envBase : undefined;

    if (!base) {
      const origin = req.headers.get('origin') || '';
      if (origin.startsWith('http')) base = origin;
    }
    if (!base) {
      const referer = req.headers.get('referer') || '';
      try {
        if (referer) base = new URL(referer).origin;
      } catch {
        /* ignore */
      }
    }
    if (!base) base = 'http://localhost:3000';

    const successUrl = new URL('/payment-success', base).toString();
    const cancelUrl  = new URL('/payment-failed', base).toString();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      // هاد الحقل ما بقاش ضروري فالإصدارات الجديدة ولكن ما يضرّش
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: `Visa Application (${trackingCode || 'N/A'})` },
            unit_amount: cents,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { trackingCode: trackingCode || '' },
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (err) {
    console.error('❌ Stripe error:', err);
    return NextResponse.json({ success: false, error: 'Stripe session failed' }, { status: 500 });
  }
}