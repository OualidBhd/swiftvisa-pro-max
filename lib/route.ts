import { NextRequest, NextResponse } from 'next/server';
import { prisma } from './prisma';
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  try {
    const applications = await prisma.visaApplication.findMany({
      where: { id: userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, applications });
  } catch (err) {
    console.error('[ERROR FETCHING APPLICATIONS]', err);
    return NextResponse.json(
      { success: false, error: 'Unable to fetch applications' },
      { status: 500 }
    );
  }
}