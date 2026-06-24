import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { file: string[] } }
) {
  try {
    const fileSegments = params.file;
    const scrapperv2Dir = path.join(process.cwd(), '..', 'scrapperv2');
    const filePath = path.join(scrapperv2Dir, ...fileSegments);

    // Prevent directory traversal attacks
    if (!filePath.startsWith(scrapperv2Dir)) {
      return new Response('Access Denied', { status: 403 });
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      return new Response('File Not Found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    let contentType = 'application/octet-stream';
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.css') contentType = 'text/css';
    else if (ext === '.js') contentType = 'application/javascript';
    else if (ext === '.html') contentType = 'text/html';

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, must-revalidate',
      },
    });
  } catch (error: any) {
    return new Response(`Error serving asset: ${error.message}`, { status: 500 });
  }
}
