import { siteConfig } from '@/lib/site';

export function StructuredData({ value }: { value: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(value) }} />;
}

export const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: siteConfig.name,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: siteConfig.description,
  offers: {
    '@type': 'Offer',
    price: '99',
    priceCurrency: 'USD',
    description: 'Founding Advisor Pilot: two guided synthetic meeting cases, facilitation notes, written onboarding, and 30 days of limited email support.',
  },
};

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does Veloxis provide financial, investment, tax, or legal advice?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Veloxis is an educational scenario visualizer. Advisors remain responsible for their own professional judgment, client communications, and compliance review.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why does Veloxis use the same simulated market paths for both plans?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Using the same seeded simulated paths helps isolate the effects of changed plan inputs from ordinary random variation between simulation runs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I enter client data in the public demo?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The public pilot demo is limited to a synthetic household scenario. Do not enter personal, account, or identifying client information.',
      },
    },
  ],
};
