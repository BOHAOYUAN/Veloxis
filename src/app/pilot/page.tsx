import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { MarketingShell, PageHeading, PrimaryLink } from '@/components/marketing/MarketingShell';
import { PilotEnrollment } from '@/components/marketing/PilotEnrollment';
import { absoluteUrl, siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: siteConfig.pilotOfferPublished ? 'Founding Advisor Pilot' : 'Advisor Workflow Evaluation',
  description: siteConfig.pilotOfferPublished
    ? 'A focused 30-day evaluation of Veloxis for independent advisor retirement scenario conversations.'
    : 'Evaluate the Veloxis retirement scenario conversation workflow with fictional household data.',
  alternates: { canonical: absoluteUrl('/pilot') },
};

const paidInclusions = [
  'Two guided fictional client-meeting cases and facilitation notes',
  'Written onboarding delivered within two business days after payment is verified',
  '30 days of email support from delivery, with up to three exchanges',
  'A response within two business days for each included support exchange',
  'A closing feedback prompt to shape the next product decision',
];

const feedbackSteps = [
  'Open one of the two fictional household cases',
  'Change one proposed-plan assumption and inspect the calculated delta',
  'Use the annual ledger to explain why the result changed',
  'Tell the builder what was confusing, untrustworthy, or missing from the meeting flow',
];

export default function PilotPage() {
  const commercialOffer = siteConfig.pilotOfferPublished;
  const items = commercialOffer ? paidInclusions : feedbackSteps;
  return (
    <MarketingShell>
      <PageHeading eyebrow={commercialOffer ? 'Founding Advisor Pilot' : 'Advisor Workflow Evaluation'} title={commercialOffer ? 'Evaluate one focused retirement conversation for $99.' : 'Test the workflow before it becomes a paid product.'}>
        <p>{commercialOffer ? 'A guided, time-boxed product evaluation for independent advisors who want to test a clearer Current Plan versus Proposed Plan discussion.' : 'A portfolio-stage evaluation for independent advisors who want to test a clearer Current Plan versus Proposed Plan discussion using fictional data.'}</p>
      </PageHeading>
      <section className="mx-auto grid max-w-6xl items-start gap-8 px-5 py-14 md:grid-cols-[1.1fr_0.9fr] md:px-8">
        <div className="min-w-0">
          <h2 className="text-2xl font-black tracking-tight text-[#111c3d]">{commercialOffer ? 'Included in the pilot' : 'A 10-minute evaluation path'}</h2>
          <ul className="mt-6 space-y-4 text-slate-700">
            {items.map(item => <li key={item} className="flex gap-3"><CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" /><span>{item}</span></li>)}
          </ul>
          <h2 className="mt-10 text-xl font-black text-[#111c3d]">{commercialOffer ? 'The demo is free. The pilot is guided support.' : 'This is validation, not a checkout page.'}</h2>
          <p className="mt-3 leading-7 text-slate-600">{commercialOffer ? 'Your purchase covers the case guides, written onboarding and limited support—not exclusive access to the public demo, a software subscription, or promised future features.' : 'No payment, order, reservation, or software subscription is offered from this site. Commercial enrollment will remain unavailable until the hosting and fulfillment release gates are complete.'}</p>
          <h2 className="mt-10 text-xl font-black text-[#111c3d]">Not included</h2>
          <p className="mt-3 leading-7 text-slate-600">No client-data storage, account connections, tax calculations, financial advice, compliance review, or production advisor workflow. Use fictional data for internal evaluation only.</p>
          {commercialOffer ? <><h2 className="mt-10 text-xl font-black text-[#111c3d]">Delivery and refund</h2><p className="mt-3 leading-7 text-slate-600">The case materials are delivered by email within two business days after payment is verified. Your 30-day support period starts on delivery. You may request a full refund within seven calendar days after delivery. Read the <Link href="/terms" className="font-bold text-blue-700 underline hover:text-blue-900">pilot terms</Link> before purchasing.</p></> : <><h2 className="mt-10 text-xl font-black text-[#111c3d]">What useful feedback looks like</h2><p className="mt-3 leading-7 text-slate-600">Describe the last real meeting step this could replace or improve, where you lost confidence in the output, and whether you would return to the workflow for a second fictional case. General praise is less useful than a specific objection.</p></>}
        </div>
        <PilotEnrollment />
      </section>
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-4 px-5 py-10 md:px-8">
          <PrimaryLink href="/workspace">Open the workspace preview</PrimaryLink>
          <PrimaryLink href="/demo">Try the guided demo</PrimaryLink>
          <PrimaryLink href="/methodology">Review the calculation boundary</PrimaryLink>
        </div>
      </section>
    </MarketingShell>
  );
}
