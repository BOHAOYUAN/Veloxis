import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

const paths = ['', '/demo', '/for-independent-advisors', '/methodology', '/privacy', '/pilot', '/terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteConfig.siteUrl) return [];
  return paths.map(path => ({ url: `${siteConfig.siteUrl}${path}`, lastModified: new Date() }));
}
