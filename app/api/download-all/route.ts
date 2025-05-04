import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import JSZip from 'jszip';
import fetch from 'node-fetch';
import type { Application } from '@prisma/client';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const apps = await prisma.application.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    if (!apps.length) {
      return new Response(JSON.stringify({ success: false, error: 'No files found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const app = apps[0] as Application;
    const zip = new JSZip();

    const files = [
      { name: 'passportImage', url: (app as any).passportImage },
      { name: 'residencePermit', url: (app as any).residencePermit },
      { name: 'personalPhoto', url: (app as any).personalPhoto },
      { name: 'additionalDocs', url: (app as any).additionalDocs },
    ];

    for (const file of files) {
      if (file.url) {
        const res = await fetch(file.url);
        if (!res.ok) continue;

        const buffer = await res.arrayBuffer();
        const extension = file.url.split('.').pop()?.split('?')[0] || 'file';
        zip.file(`${file.name}.${extension}`, buffer);
      }
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    return new Response(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=documents.zip',
      },
    });
  } catch (err) {
    console.error('[DOWNLOAD ZIP ERROR]', err);
    return new Response(JSON.stringify({ success: false, error: 'Failed to generate zip' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}