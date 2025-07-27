import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // بلا apiVersion

export async function POST(req: Request) {
  try {
    const { amount, trackingCode } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Visa Application (${trackingCode})`,
            },
            unit_amount: Math.round(amount * 100), // مثلا 49.99 => 4999
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-failed`,
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (err) {
    console.error('❌ Stripe error:', err);
    return NextResponse.json({ success: false, error: 'Stripe session failed' }, { status: 500 });
  }
}