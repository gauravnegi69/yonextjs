import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await db.settings.get();
    const { adminPasscode, ...publicSettings } = settings as any;
    return NextResponse.json(publicSettings);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ message: 'Invalid admin credentials.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const updated = await db.settings.update(body);
    const { adminPasscode, ...publicSettings } = updated as any;
    return NextResponse.json(publicSettings);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
