import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ message: 'Invalid admin credentials.' }, { status: 401 });
  }
  return NextResponse.json({ valid: true });
}
