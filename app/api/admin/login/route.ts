// app/api/admin/login/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
const COOKIE = 'sv_admin';
const isProd = process.env.NODE_ENV === 'production';

export async function POST(req: Request) {
  const { email, code } = await req.json();

  if (!code || code !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ ok: false, error: 'INVALID_CODE' }, { status: 401 });
  }
  if (process.env.ADMIN_EMAIL && email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ ok: false, error: 'INVALID_EMAIL' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, JSON.stringify({ email: email || 'admin' }), {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return res;
}