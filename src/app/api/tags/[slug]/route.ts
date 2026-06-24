import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ message: 'Invalid admin credentials.' }, { status: 403 });
  }

  const { slug } = params;
  try {
    const deleted = await db.tags.delete(slug);
    if (!deleted) {
      return NextResponse.json({ message: 'Tag not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Tag deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
