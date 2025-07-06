// middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// حماية صفحات الأدمين
export async function middleware(req: NextRequest) {
  const token = await getToken({ req })

  const isAdminPath =
    req.nextUrl.pathname.startsWith('/admin') ||
    req.nextUrl.pathname.startsWith('/api/admin')

  if (isAdminPath) {
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

// تطبيق الميدلوير فقط على مسارات الأدمين
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}