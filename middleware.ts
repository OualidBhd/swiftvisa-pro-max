// middleware.ts (في root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const USER_COOKIE = 'sv_track';
const ADMIN_COOKIE = 'sv_admin';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // استثناء مسارات اللوجين/لوغ أوت
  if (
    pathname.startsWith('/admin-login') ||
    pathname.startsWith('/api/admin/login') ||
    pathname.startsWith('/api/admin/logout')
  ) return NextResponse.next();

  if (pathname.startsWith('/admin')) {
    if (!req.cookies.get(ADMIN_COOKIE)?.value) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin-login';
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith('/dashboard')) {
    if (!req.cookies.get(USER_COOKIE)?.value) {
      const url = req.nextUrl.clone();
      url.pathname = '/';
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ['/admin', '/admin/:path*', '/dashboard/:path*'] };