import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params
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
    console.error('❌ فشل في تحديث الطلب:', err)
    return NextResponse.json({ error: 'فشل تحديث الطلب' }, { status: 500 })
  }
}