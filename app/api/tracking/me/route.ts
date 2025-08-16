import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // ما يتكاشّاش
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const jar = cookies();
    const raw = (await jar).get('sv_track')?.value;
    if (!raw) {
      return NextResponse.json({ success: false, error: 'NO_SESSION' }, { status: 401 });
    }

    const { code, email } = JSON.parse(raw) as { email?: string; code: string };
    if (!code) {
      return NextResponse.json({ success: false, error: 'INVALID_SESSION' }, { status: 400 });
    }

    const origin = new URL(req.url).origin;

    // إذا /api/tracking عندك كتحتاج email زيدو، إذا ماكاتحتاجوش حيدو
    const res = await fetch(`${origin}/api/tracking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackingCode: code, email }),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({} as any));
    if (!res.ok || !data?.success || !data?.application) {
      return NextResponse.json(
        { success: false, error: data?.error || 'NOT_FOUND' },
        { status: res.status || 404 }
      );
    }

    return NextResponse.json({ success: true, application: data.application });
  } catch (err) {
    console.error('tracking/me error:', err);
    return NextResponse.json({ success: false, error: 'SERVER_ERROR' }, { status: 500 });
  }
}