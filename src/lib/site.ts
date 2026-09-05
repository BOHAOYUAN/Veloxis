const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');

export const siteConfig = {
  name: 'Veloxis',
  title: 'Veloxis — Retirement scenario conversations for independent advisors',
  description: 'A browser-based retirement scenario visualizer that compares current and proposed plans with the same simulated market paths.',
  siteUrl: configuredSiteUrl,
  pilotCheckoutUrl: process.env.NEXT_PUBLIC_DODO_PILOT_URL,
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
};

export function absoluteUrl(path = '/') {
  if (!configuredSiteUrl) return path;
  return new URL(path, configuredSiteUrl).toString();
}
