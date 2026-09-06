/** Public defaults confirmed by the owner. No credentials or buyer data. */
export const publicSiteDefaults = {
  siteUrl: 'https://veloxis.lumiere-private.com',
  contactEmail: 'haoyuanbo626@gmail.com',
};

export function validSiteOrigin(value: string): string | undefined {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) return undefined;
    return url.origin;
  } catch { return undefined; }
}

export function validContactEmail(value: string): string | undefined {
  const email = value.trim();
  return /^[a-zA-Z0-9.!#$%&'*+/=_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.test(email) ? email : undefined;
}

/** Only a durable, one-unit LIVE product link can appear in public enrollment. */
export function liveCheckoutUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== 'checkout.dodopayments.com' || url.port || url.username || url.password || url.hash) return undefined;
    if (!/^\/buy\/pdt_[a-zA-Z0-9]+$/.test(url.pathname)) return undefined;
    const entries = [...url.searchParams.entries()];
    if (entries.length !== 1 || entries[0][0] !== 'quantity' || entries[0][1] !== '1') return undefined;
    return url.toString();
  } catch { return undefined; }
}

export function resolvePilotEnrollment(config: {
  pilotOfferPublished: boolean;
  pilotEnrollmentOpen: boolean;
  pilotCheckoutUrl?: string;
  siteUrl?: string;
  contactEmail?: string;
}): { open: false } | { open: true; checkoutUrl: string } {
  const checkoutUrl = liveCheckoutUrl(config.pilotCheckoutUrl);
  if (!config.pilotOfferPublished || !config.pilotEnrollmentOpen || !checkoutUrl || !config.siteUrl || !validSiteOrigin(config.siteUrl) || !config.contactEmail || !validContactEmail(config.contactEmail)) return { open: false };
  return { open: true, checkoutUrl };
}
