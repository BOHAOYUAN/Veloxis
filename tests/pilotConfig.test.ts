import { describe, expect, it } from 'vitest';
import { liveCheckoutUrl, publicSiteDefaults, resolvePilotEnrollment, validContactEmail, validSiteOrigin } from '@/lib/pilotConfig';

const live = 'https://checkout.dodopayments.com/buy/pdt_example?quantity=1';
const config = { ...publicSiteDefaults, pilotEnrollmentOpen: true, pilotCheckoutUrl: live };

describe('public pilot enrollment gate', () => {
  it('requires an explicit launch flag', () => {
    expect(resolvePilotEnrollment({ ...config, pilotEnrollmentOpen: false })).toEqual({ open: false });
    expect(resolvePilotEnrollment(config)).toEqual({ open: true, checkoutUrl: live });
  });

  it.each([
    undefined, '', 'not a URL', live.replace('https:', 'http:'),
    live.replace('checkout.', 'test.checkout.'),
    live.replace('.com/', '.com.evil.example/'),
    live.replace('/buy/pdt_example', '/session/cks_example'),
    live.replace('quantity=1', 'quantity=2'),
    live + '&quantity=1', live + '&redirect_url=https://example.com', live + '#test',
    live.replace('https://', 'https://user:pass@'),
  ])('fails closed for invalid or sandbox checkout %s', (url) => {
    expect(liveCheckoutUrl(url)).toBeUndefined();
    expect(resolvePilotEnrollment({ ...config, pilotCheckoutUrl: url })).toEqual({ open: false });
  });

  it('requires valid public origin and contact', () => {
    for (const siteUrl of ['', 'http://example.com', 'https://example.com/path']) {
      expect(resolvePilotEnrollment({ ...config, siteUrl })).toEqual({ open: false });
    }
    for (const contactEmail of ['', 'not-an-email', 'a@example.com?bcc=other@example.com']) {
      expect(resolvePilotEnrollment({ ...config, contactEmail })).toEqual({ open: false });
    }
    expect(validSiteOrigin(publicSiteDefaults.siteUrl + '/')).toBe(publicSiteDefaults.siteUrl);
    expect(validContactEmail(' ' + publicSiteDefaults.contactEmail + ' ')).toBe(publicSiteDefaults.contactEmail);
  });
});
