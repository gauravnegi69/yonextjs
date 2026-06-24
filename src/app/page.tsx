import React from 'react';
import { db } from '../lib/db';
import { LandingPageContainer } from '../components/LandingPageContainer';
import PublicShell from '../components/PublicShell';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await db.settings.get();
  return {
    title: settings?.siteTitle || 'Yono Hub – Premium App Discovery & Play Platform',
    description: settings?.siteDescription || 'Discover, compare and download premium rummy and skill apps.',
    alternates: {
      canonical: '/',
    },
  };
}

export default async function HomeRoute() {
  const [apps, categories, collections, settings] = await Promise.all([
    db.apps.find(),
    db.categories.find(),
    db.collections.find(),
    db.settings.get()
  ]);

  // Clean data for client components
  const cleanApps = JSON.parse(JSON.stringify(apps));
  const cleanCategories = JSON.parse(JSON.stringify(categories));
  const cleanCollections = JSON.parse(JSON.stringify(collections));
  const cleanSettings = JSON.parse(JSON.stringify(settings));

  return (
    <PublicShell>
      <LandingPageContainer
        apps={cleanApps}
        categories={cleanCategories}
        collections={cleanCollections}
        settings={cleanSettings}
      />
    </PublicShell>
  );
}
