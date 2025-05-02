import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.formData();

  const fullName = data.get('fullName') as string;
  const email = data.get('email') as string;
  const countryOfOrigin = data.get('countryOfOrigin') as string;
  const destinationCountry = data.get('destinationCountry') as string;
  const visaType = data.get('visaType') as string;
  const travelDate = data.get('travelDate') as string;

  const passportImage = (data.get('passportImage') as File)?.name || '';
  const residencePermit = (data.get('residencePermit') as File)?.name || '';
  const personalPhoto = (data.get('personalPhoto') as File)?.name || '';
  const additionalDocs = (data.get('additionalDocs') as File)?.name || null;

  // استدعاء prisma client بشكل دينامي
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  const userId = 'demo-user-id'; // مستقبلاً: نستخرجو من السيشن أو JWT

  try {
    const created = await prisma.application.create({
      data: {
        fullName,
        email,
        countryOfOrigin,
        destinationCountry,
        visaType,
        travelDate: new Date(travelDate),
        passportImage,
        residencePermit,
        personalPhoto,
        additionalDocs,
        userId,
      },
    });

    return NextResponse.json({ success: true, application: created });
  } catch (err) {
    console.error('[ERROR CREATING APP]', err);
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 });
  }
}