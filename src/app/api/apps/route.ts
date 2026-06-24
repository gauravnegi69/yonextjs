import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const status = searchParams.get('status');

  const filter: any = {};
  if (category) filter.category = category;
  if (featured !== null) filter.featured = featured === 'true';
  if (status) filter.status = status;

  try {
    const list = await db.apps.find(filter);
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ message: 'Invalid admin credentials.' }, { status: 403 });
  }

  try {
    const appData = await request.json();
    if (!appData.name || !appData.slug) {
      return NextResponse.json({ message: 'Name and unique slug are required.' }, { status: 400 });
    }
    const created = await db.apps.create(appData);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
