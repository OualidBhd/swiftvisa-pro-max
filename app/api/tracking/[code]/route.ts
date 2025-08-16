import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic'; export const revalidate = 0;

export async function GET(_req: Request, { params }: { params: { code: string } }) {
  const app = await prisma.visaApplication.findUnique({
    where: { trackingCode: params.code },
    select: { fullName: true, email: true, visaType: true, travelDate: true, trackingCode: true, status: true, paymentStatus: true, updatedAt: true },
  });
  if (!app) return NextResponse.json({ success: false }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
  return NextResponse.json({ success: true, application: app }, { headers: { 'Cache-Control': 'no-store' } });
}