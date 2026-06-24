import { MetadataRoute } from 'next';
import { db } from '../lib/db';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await db.settings.get();
  const domain = settings?.siteDomain || 'https://yononewgamess.com';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/go/'],
    },
    sitemap: `${domain}/sitemap.xml`,
  };
}
