import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: siteConfig.siteUrl ? new URL(siteConfig.siteUrl) : null,
  title: {
    default: siteConfig.title,
    template: '%s | Veloxis',
  },
  description: siteConfig.description,
  applicationName: 'Veloxis',
  category: 'Financial planning education',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: 'Veloxis',
  },
  twitter: {
    card: 'summary',
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f6f8fc] text-slate-950 antialiased selection:bg-cyan-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
