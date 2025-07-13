import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ✅ تعريف دالة PATCH بشكل صحيح لنظام App Router (Vercel)
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params
  const { status } = await req.json()

  if (!id || !status) {
    return NextResponse.json({ error: 'معطيات ناقصة' }, { status: 400 })
  }

  try {
    const updated = await db.visaApplication.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('❌ فشل تحديث الحالة:', err)
    return NextResponse.json({ error: 'فشل في تحديث الحالة' }, { status: 500 })
  }
}