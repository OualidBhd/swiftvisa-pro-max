import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // apiVersion اختياري

export async function POST(req: Request) {
  try {
    const { trackingCode, amount } = await req.json();
    if (!trackingCode) {
      return NextResponse.json({ success: false, error: 'trackingCode required' }, { status: 400 });
    }

    // اجعلها دومينك فالإنتاج بمتغير بيئي
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      metadata: { trackingCode },                      // مهم باش نربط الدفع بالطلب
      client_reference_id: trackingCode,               // اختياري
      success_url: `${baseUrl}/payment-success?code=${encodeURIComponent(trackingCode)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/dashboard?code=${encodeURIComponent(trackingCode)}&canceled=1`,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: `Visa Application (${trackingCode})` },
            unit_amount: Math.round(Number(amount ?? 0.99) * 100), // بالسنتم
          },
          quantity: 1,
        },
      ],
    });

    return NextResponse.json({ success: true, id: session.id, url: session.url });
  } catch (e: any) {
    console.error('create-session error:', e);
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}