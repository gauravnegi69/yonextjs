import React from 'react';
import { notFound } from 'next/navigation';
import { db } from '../../../lib/db';
import { AppDetailPage } from '../../../components/AppDetailPage';
import { Metadata } from 'next';
import PublicShell from '../../../components/PublicShell';

type Props = {
  params: Promise<{ slug: string }> | { slug: string };
};

// 1. Dynamic Server-Side Metadata Generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const app = await db.apps.findOne({ slug });
  const settings = await db.settings.get();

  if (!app) {
    return {
      title: 'App Not Found | Yono Hub',
      description: 'The requested Rummy or skill app details could not be found.',
    };
  }

  const domain = settings?.siteDomain || 'https://yononewgamess.com';
  const pageUrl = `${domain}/app/${app.slug}`;
  const imageUrl = app.logo.startsWith('http') ? app.logo : `${domain}${app.logo}`;

  const title = app.seoTitle || `${app.name} - Download APK & Play | Yono Hub`;
  const description = app.seoDescription || `Download ${app.name} APK. Bonus: ${app.bonus || 'N/A'}, Min Withdrawal: ${app.minWithdrawal || 'N/A'}. Discover key features, FAQs and details.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/app/${app.slug}`,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: 'video.other',
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function AppRoute({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const [app, apps, settings] = await Promise.all([
    db.apps.findOne({ slug }),
    db.apps.find(),
    db.settings.get()
  ]);

  if (!app) {
    notFound();
  }

  // Record page view count in backend analytics database
  try {
    await db.analytics.recordView(slug);
  } catch (err) {
    console.error('Failed to log page view view analytics:', err);
  }

  // Clean objects for client components
  const cleanApp = JSON.parse(JSON.stringify(app));
  const cleanApps = JSON.parse(JSON.stringify(apps));
  const cleanSettings = JSON.parse(JSON.stringify(settings));

  const domain = cleanSettings?.siteDomain || 'https://yononewgamess.com';
  const imageUrl = cleanApp.logo.startsWith('http') ? cleanApp.logo : `${domain}${cleanApp.logo}`;
  const seoDesc = cleanApp.seoDescription || `Download ${cleanApp.name} APK. Bonus: ${cleanApp.bonus || 'N/A'}.`;

  // JSON-LD SoftwareApplication schema data structure
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': cleanApp.name,
    'operatingSystem': 'Android',
    'applicationCategory': 'GameApplication',
    'image': imageUrl,
    'description': seoDesc,
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'INR'
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': cleanApp.rating || '4.5',
      'ratingCount': '125',
      'bestRating': '5',
      'worstRating': '1'
    }
  };

  return (
    <PublicShell>
      {/* Structured data LD-JSON element */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <AppDetailPage
        app={cleanApp}
        apps={cleanApps}
        settings={cleanSettings}
      />
    </PublicShell>
  );
}
