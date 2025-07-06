import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { id, status } = await req.json();

  try {
    await prisma.visaApplication.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update status' }, { status: 500 });
  }
}