import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  const isAdmin = await verifyAdmin(request);
  if (!isAdmin) {
    return NextResponse.json({ message: 'Invalid admin credentials.' }, { status: 403 });
  }

  try {
    const metrics = await db.analytics.find();
    const apps = await db.apps.find();

    const results = metrics.map(m => {
      const app = apps.find(a => a.slug === m.appSlug);
      return {
        name: app ? app.name : m.appSlug,
        slug: m.appSlug,
        views: m.views,
        clicks: m.clicks,
        ctr: parseFloat(m.ctr.toFixed(2)),
        history: m.history
      };
    });

    const totalViews = results.reduce((sum, r) => sum + r.views, 0);
    const totalClicks = results.reduce((sum, r) => sum + r.clicks, 0);
    const averageCtr = totalViews > 0 ? parseFloat(((totalClicks / totalViews) * 100).toFixed(2)) : 0;

    const topAppsByViews = [...results].sort((a, b) => b.views - a.views).slice(0, 5);
    const topAppsByClicks = [...results].sort((a, b) => b.clicks - a.clicks).slice(0, 5);

    return NextResponse.json({
      totalViews,
      totalClicks,
      averageCtr,
      appsAnalytics: results,
      topAppsByViews,
      topAppsByClicks
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
