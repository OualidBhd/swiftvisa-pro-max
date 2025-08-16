import { NextResponse } from 'next/server';

const ADMIN_COOKIE = 'sv_admin';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}