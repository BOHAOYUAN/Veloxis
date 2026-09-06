import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { MarketingShell, PageHeading, PrimaryLink } from '@/components/marketing/MarketingShell';
import { PilotEnrollment } from '@/components/marketing/PilotEnrollment';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Founding Advisor Pilot',
  description: 'A focused 30-day evaluation of Veloxis for independent advisor retirement scenario conversations.',
  alternates: { canonical: absoluteUrl('/pilot') },
};

const inclusions = [
  'Two guided fictional client-meeting cases and facilitation notes',
  'Written onboarding delivered within two business days after payment is verified',
  '30 days of email support from delivery, with up to three exchanges',
  'A response within two business days for each included support exchange',
  'A closing feedback prompt to shape the next product decision',
];

export default function PilotPage() {
  return (
    <MarketingShell>
      <PageHeading eyebrow="Founding Advisor Pilot" title="Evaluate one focused retirement conversation for $99.">
        <p>A guided, time-boxed product evaluation for independent advisors who want to test a clearer Current Plan versus Proposed Plan discussion.</p>
      </PageHeading>
      <section className="mx-auto grid max-w-6xl items-start gap-8 px-5 py-14 md:grid-cols-[1.1fr_0.9fr] md:px-8">
        <div className="min-w-0">
          <h2 className="text-2xl font-black tracking-tight text-[#111c3d]">Included in the pilot</h2>
          <ul className="mt-6 space-y-4 text-slate-700">
            {inclusions.map(item => <li key={item} className="flex gap-3"><CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" /><span>{item}</span></li>)}
          </ul>
          <h2 className="mt-10 text-xl font-black text-[#111c3d]">The demo is free. The pilot is guided support.</h2>
          <p className="mt-3 leading-7 text-slate-600">Your purchase covers the case guides, written onboarding and limited support—not exclusive access to the public demo, a software subscription, or promised future features.</p>
          <h2 className="mt-10 text-xl font-black text-[#111c3d]">Not included</h2>
          <p className="mt-3 leading-7 text-slate-600">No client-data storage, account connections, tax calculations, financial advice, compliance review, or production advisor workflow. Use fictional data for internal evaluation only.</p>
          <h2 className="mt-10 text-xl font-black text-[#111c3d]">Delivery and refund</h2>
          <p className="mt-3 leading-7 text-slate-600">The case materials are delivered by email within two business days after payment is verified. Your 30-day support period starts on delivery. You may request a full refund within seven calendar days after delivery. Read the <Link href="/terms" className="font-bold text-blue-700 underline hover:text-blue-900">pilot terms</Link> before purchasing.</p>
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
