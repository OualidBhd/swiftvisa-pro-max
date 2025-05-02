import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.formData();

    const fullName = data.get('fullName') as string;
    const email = data.get('email') as string;
    const countryOfOrigin = data.get('countryOfOrigin') as string;
    const destinationCountry = data.get('destinationCountry') as string;
    const visaType = data.get('visaType') as string;
    const travelDate = data.get('travelDate') as string;

    // NOTE: في هاد المرحلة، الملفات مازال ما كنديروش ليهم upload، نحتافض فقط بالأسماء
    const passportImage = (data.get('passportImage') as File)?.name || '';
    const residencePermit = (data.get('residencePermit') as File)?.name || '';
    const personalPhoto = (data.get('personalPhoto') as File)?.name || '';
    const additionalDocs = (data.get('additionalDocs') as File)?.name || null;

    // ملاحظة: حالياً userId ثابت حتى نربط login لاحقاً
    const userId = 'demo-user-id'; // استبدل بقيمة حقيقية من الجلسة لاحقاً

    const created = await prisma.application.create({
      data: {
        fullName,
        email,
        countryOfOrigin,
        destinationCountry,
        visaType,
        type: visaType,
        travelDate: new Date(travelDate),
        passportImage,
        residencePermit,
        personalPhoto,
        additionalDocs,
        userId,
      },
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 });
  }
}