import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    const settings = await db.settings.get();
    
    const emailMatch = email.toLowerCase() === settings.adminEmail?.toLowerCase();
    const passwordMatch = settings.adminPasswordHash ? await bcrypt.compare(password, settings.adminPasswordHash) : false;

    if (emailMatch && passwordMatch) {
      return NextResponse.json({ token: `session-${settings.adminEmail}` });
    } else {
      return NextResponse.json({ message: 'Incorrect email or password.' }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
