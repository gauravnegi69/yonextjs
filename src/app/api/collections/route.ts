import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const list = await db.collections.find();
    return NextResponse.json(list);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
