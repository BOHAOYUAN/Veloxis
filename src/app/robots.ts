import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
    ],
    sitemap: siteConfig.siteUrl ? `${siteConfig.siteUrl}/sitemap.xml` : undefined,
  };
}
