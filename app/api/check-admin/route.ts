// app/api/check-admin/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const inputCode = body.code
  const secret = process.env.ADMIN_SECRET

  if (inputCode === secret) {
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ success: false }, { status: 401 })
  }
}