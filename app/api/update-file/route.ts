import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { applicationId, field, url } = await req.json();

  if (!applicationId || !url || !['passportImage', 'residencePermit', 'personalPhoto', 'additionalDocs'].includes(field)) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }

  try {
    await prisma.visaApplication.update({
      where: { id: applicationId },
      data: { [field]: url },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update file' }, { status: 500 });
  }
}