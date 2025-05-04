import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const readFile = promisify(fs.readFile);

export async function POST(req: NextRequest) {
  const form = new IncomingForm({ uploadDir: '/tmp', keepExtensions: true });

  const data: any = await new Promise((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const file = data.files.file;
  const filePath = Array.isArray(file) ? file[0].filepath : file.filepath;

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'swiftvisa_uploads',
    });

    return NextResponse.json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}