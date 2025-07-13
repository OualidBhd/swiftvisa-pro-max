import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const body = await req.json()
  const { status } = body

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