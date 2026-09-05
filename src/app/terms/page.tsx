import { Metadata } from 'next';
import Link from 'next/link';
import { MarketingShell, PageHeading } from '@/components/marketing/MarketingShell';
import { absoluteUrl, siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Founding Advisor Pilot terms',
  description: 'Purchase, delivery, support, permitted-use, and refund terms for the Veloxis Founding Advisor Pilot.',
  alternates: { canonical: absoluteUrl('/terms') },
};

const terms = [
  ['What you purchase', 'A one-time, 30-day evaluation that includes two guided fictional retirement meeting cases, facilitation notes, written onboarding, and up to three email support exchanges. It is not a software subscription or a promise of future product features.'],
  ['Delivery', 'The 30-day period begins when the materials are delivered. Delivery is by email within two business days after payment is verified. Each included support exchange receives a response within two business days.'],
  ['Permitted use', 'Use the materials and public demo only for internal evaluation with fictional data. Do not enter client names, contact details, account information, documents, or other personal financial information.'],
  ['Refunds', 'You may request a full refund within seven calendar days after delivery. Send the request from the purchasing email address. Approved refunds return to the original payment method through Dodo Payments.'],
  ['Planning boundary', 'Veloxis provides educational simulations for product evaluation. Outputs are not investment, tax, legal, or financial advice, and the pilot does not include compliance review.'],
  ['Availability', 'The public demo and pilot materials are provided as available during this early evaluation. Calculation or access issues reported during the pilot will be investigated, but uninterrupted availability is not guaranteed.'],
];

export default function TermsPage() {
  return <MarketingShell><PageHeading eyebrow="Founding Advisor Pilot terms" title="Know exactly what the $99 pilot includes."><p>Effective September 5, 2026. These terms describe the limited first-pilot offer shown on this site.</p></PageHeading><section className="mx-auto max-w-4xl px-5 py-14 md:px-8"><div className="space-y-4">{terms.map(([title, body]) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="text-xl font-black text-[#111c3d]">{title}</h2><p className="mt-3 leading-7 text-slate-600">{body}</p></article>)}</div><aside className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-blue-950"><h2 className="font-bold">Questions or refund requests</h2>{siteConfig.contactEmail ? <p className="mt-2 leading-7">Email <a className="font-bold underline" href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>. Include the purchasing email address and, for refunds, the payment reference.</p> : <p className="mt-2 leading-7">Enrollment remains closed until a public support email is configured.</p>}<p className="mt-3 text-sm">Payment checkout and receipts are provided by Dodo Payments as merchant of record. Review the terms presented at checkout as part of the purchase.</p></aside><p className="mt-8 text-sm leading-6 text-slate-500">These pilot terms are an operational description of the offer and should be reviewed for your business and jurisdiction before broader commercial launch. See the <Link href="/privacy" className="font-bold text-blue-700">privacy notice</Link>.</p></section></MarketingShell>;
}
