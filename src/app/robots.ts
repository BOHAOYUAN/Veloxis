import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/workspace' },
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: '/workspace' },
      { userAgent: 'GPTBot', allow: '/', disallow: '/workspace' },
    ],
    sitemap: siteConfig.siteUrl ? `${siteConfig.siteUrl}/sitemap.xml` : undefined,
  };
}
