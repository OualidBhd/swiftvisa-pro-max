import { NextResponse } from 'next/server';

const COOKIE_NAME = 'sv_track';
const isProd = process.env.NODE_ENV === 'production';

export async function POST(req: Request) {
  const { email, code } = await req.json();
  if (!email || !code) {
    return NextResponse.json({ ok: false, error: 'Missing email/code' }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, JSON.stringify({ email, code }), {
    httpOnly: true,
    secure: isProd,        // ⬅️ فقط فالبرو
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}