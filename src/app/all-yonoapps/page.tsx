import React from 'react';
import { db } from '../../lib/db';
import { AllYonoAppsPage } from '../../components/AllYonoAppsPage';
import { Metadata } from 'next';
import PublicShell from '../../components/PublicShell';

export const metadata: Metadata = {
  title: 'All Yono Games Lobbies - Download Verified APKs | Yono Hub',
  description: 'Browse the complete collection of verified Yono games lobbies. Filter by category, tags, and compare.',
  alternates: {
    canonical: '/all-yonoapps',
  },
};

export default async function AllYonoAppsRoute() {
  // Server-side fetching
  const [apps, categories, settings] = await Promise.all([
    db.apps.find(),
    db.categories.find(),
    db.settings.get()
  ]);

  // Clean data for client (remove MongoDB Mongo ObjectID instances)
  const cleanApps = JSON.parse(JSON.stringify(apps));
  const cleanCategories = JSON.parse(JSON.stringify(categories));
  const cleanSettings = JSON.parse(JSON.stringify(settings));

  return (
    <PublicShell>
      <AllYonoAppsPage
        apps={cleanApps}
        categories={cleanCategories}
        cardStyle={cleanSettings?.cardStyle || 'default'}
      />
    </PublicShell>
  );
}
