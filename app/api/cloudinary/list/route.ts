import { NextResponse } from 'next/server';

export async function GET() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const folder = ''; // خليه فارغ ولا عيّن اسم فولدر معين

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?prefix=${folder}&max_results=30`,
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  const data = await res.json();

  if (data.error) {
    return NextResponse.json({ success: false, error: data.error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, resources: data.resources });
}