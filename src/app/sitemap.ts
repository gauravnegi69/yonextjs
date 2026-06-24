import { MetadataRoute } from 'next';
import { db } from '../lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await db.settings.get();
  const domain = settings?.siteDomain || 'https://yononewgamess.com';
  
  const apps = await db.apps.find({ status: 'active' });
  
  const staticPaths = [
    { url: `${domain}/`, lastModified: new Date() },
    { url: `${domain}/all-yonoapps`, lastModified: new Date() },
    { url: `${domain}/about-us`, lastModified: new Date() },
    { url: `${domain}/contact-us`, lastModified: new Date() },
    { url: `${domain}/privacy-policy`, lastModified: new Date() },
  ];
  
  const dynamicPaths = apps.map(app => ({
    url: `${domain}/app/${app.slug}`,
    lastModified: new Date(),
  }));
  
  return [...staticPaths, ...dynamicPaths];
}
