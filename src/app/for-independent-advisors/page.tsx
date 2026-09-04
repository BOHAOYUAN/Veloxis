import { Metadata } from 'next';
import { MarketingShell, PageHeading, PilotCallout, PrimaryLink, ProofPoint } from '@/components/marketing/MarketingShell';
import { StructuredData } from '@/components/marketing/StructuredData';
import { absoluteUrl, siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Retirement scenario conversations for independent advisors | Veloxis',
  description: 'Show a current and proposed retirement plan side by side using the same simulated market paths.',
  alternates: { canonical: absoluteUrl('/for-independent-advisors') },
};

export default function AdvisorsPage() {
  return <MarketingShell><StructuredData value={{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Veloxis for independent advisors', description: siteConfig.description }} /><PageHeading eyebrow="For independent advisors" title="Make retirement trade-offs easier to explain."><p>Veloxis is a browser-based scenario visualizer for a focused client conversation: what changes when a retirement plan changes?</p></PageHeading><section className="mx-auto grid max-w-6xl gap-5 px-5 py-12 md:grid-cols-3 md:px-8"><ProofPoint icon="paths" title="Compare like with like">Current and proposed plans use the same seeded market paths, so the comparison is not confused by a fresh random draw.</ProofPoint><ProofPoint icon="ledger" title="Trace the story yearly">A shared cash-flow ledger shows opening assets, income, savings, spending, withdrawals, and ending assets by age.</ProofPoint><ProofPoint icon="local" title="Use a synthetic demo">The public evaluation uses a fictional household only. Do not enter identifying or account information.</ProofPoint></section><section className="bg-white py-14"><div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[0.9fr_1.1fr] md:px-8"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">One meeting, one question</p><h2 className="mt-3 text-3xl font-black tracking-tight text-[#111c3d]">What is the difference between staying the course and changing the plan?</h2></div><ol className="space-y-5 border-l-2 border-blue-200 pl-6 text-slate-700"><li><strong>1. Start with a baseline.</strong><br />A current plan is derived from the household assumptions.</li><li><strong>2. Change explicit levers.</strong><br />Retirement age, savings, retirement spending, or Social Security claim age.</li><li><strong>3. Explain calculated deltas.</strong><br />The result reports the actual change in plan-end success probability and modeled assets.</li></ol></div></section><section className="mx-auto max-w-6xl px-5 py-12 md:px-8"><PilotCallout /></section><section className="mx-auto max-w-6xl px-5 pb-16 md:px-8"><PrimaryLink href="/demo">Explore the synthetic demo</PrimaryLink></section></MarketingShell>;
}

