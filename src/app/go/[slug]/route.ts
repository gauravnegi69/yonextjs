import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';

type Props = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function GET(request: NextRequest, { params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  try {
    const app = await db.apps.findOne({ slug });

    if (!app || !app.downloadUrl) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Register click metrics in database
    await db.analytics.recordClick(slug);

    // Redirect user to the target apk URL
    return NextResponse.redirect(new URL(app.downloadUrl));
  } catch (err) {
    console.error('Redirection error:', err);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
