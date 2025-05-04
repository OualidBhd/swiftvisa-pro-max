import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { applicationId, field } = await req.json();

    const allowedFields = ['passportImage', 'residencePermit', 'personalPhoto', 'additionalDocs'];

    if (!applicationId || !allowedFields.includes(field)) {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        [field]: '', // حذف الرابط من قاعدة البيانات
      },
    });

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}