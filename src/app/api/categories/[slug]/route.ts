import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ message: 'Invalid admin credentials.' }, { status: 403 });
  }

  const { slug } = params;
  try {
    const catData = await request.json();
    const updated = await db.categories.update(slug, catData);
    if (!updated) {
      return NextResponse.json({ message: 'Category not found.' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ message: 'Invalid admin credentials.' }, { status: 403 });
  }

  const { slug } = params;
  try {
    const deleted = await db.categories.delete(slug);
    if (!deleted) {
      return NextResponse.json({ message: 'Category not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Category deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
