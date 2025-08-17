import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.ADMIN_FROM_EMAIL || 'SwiftVisa <noreply@swiftvisaonline.com>';
const TRACK_COOKIE = 'sv_track';

// 👇 هذا هو المهم
export async function POST(req: NextRequest) {
  try {
    const jar = await cookies();
    const raw = jar.get(TRACK_COOKIE)?.value;
    if (!raw) {
      return NextResponse.json({ success: false, error: 'NO_SESSION' }, { status: 401 });
    }
    const { code } = JSON.parse(raw) as { code: string };

    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ success: false, error: 'NO_FILE' }, { status: 400 });
    }

    const app = await prisma.visaApplication.findUnique({
      where: { trackingCode: code },
      select: { id: true, email: true, trackingCode: true, additionalDocs: true },
    });
    if (!app) {
      return NextResponse.json({ success: false, error: 'NOT_FOUND' }, { status: 404 });
    }

    // Cloudinary upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploaded: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: `swiftvisa/${app.trackingCode}` }, (error, result) =>
          error ? reject(error) : resolve(result)
        )
        .end(buffer);
    });
    const url: string = uploaded.secure_url;

    const prev = app.additionalDocs ? String(app.additionalDocs) : '';
    const next = prev ? `${prev},${url}` : url;

    await prisma.visaApplication.update({
      where: { id: app.id },
      data: { additionalDocs: next },
    });

    // Send email
    if (process.env.RESEND_API_KEY && app.email) {
      await resend.emails.send({
        from: FROM,
        to: app.email,
        subject: `📎 توصلنا بالوثيقة الإضافية — كود: ${app.trackingCode}`,
        html: `<p>تم استلام الوثيقة الجديدة بنجاح ✅</p><p>رابط الوثيقة: <a href="${url}">${url}</a></p>`,
      });
    }

    return NextResponse.json({ success: true, url });
  } catch (e) {
    console.error('add-document error:', e);
    return NextResponse.json({ success: false, error: 'SERVER_ERROR' }, { status: 500 });
  }
}