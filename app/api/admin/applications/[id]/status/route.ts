import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const body = await req.json()
  const { status } = body

  if (!id || !status) {
    return NextResponse.json({ error: 'معلومات ناقصة' }, { status: 400 })
  }

  try {
    const updated = await db.visaApplication.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error('❌ فشل في تحديث الحالة:', err)
    return NextResponse.json({ error: 'فشل في تحديث الطلب' }, { status: 500 })
  }
}