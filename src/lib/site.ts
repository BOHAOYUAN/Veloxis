import { publicSiteDefaults, validContactEmail, validSiteOrigin } from './pilotConfig';

const configuredSiteUrl = validSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL ?? publicSiteDefaults.siteUrl);

export const siteConfig = {
  name: 'Veloxis',
  title: 'Veloxis — Retirement scenario conversations for independent advisors',
  description: 'A browser-based retirement scenario visualizer that compares current and proposed plans with the same simulated market paths.',
  siteUrl: configuredSiteUrl,
  pilotCheckoutUrl: process.env.NEXT_PUBLIC_DODO_PILOT_URL,
  contactEmail: validContactEmail(process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? publicSiteDefaults.contactEmail),
  // Enable only after the payment and fulfillment rehearsal is verified.
  pilotEnrollmentOpen: process.env.PILOT_ENROLLMENT_OPEN === 'true',
};

export function absoluteUrl(path = '/') {
  if (!configuredSiteUrl) return path;
  return new URL(path, configuredSiteUrl).toString();
}
