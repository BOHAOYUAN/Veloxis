import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { MarketingShell, PageHeading, PrimaryLink } from '@/components/marketing/MarketingShell';
import { softwareApplicationSchema, StructuredData } from '@/components/marketing/StructuredData';
import { absoluteUrl, siteConfig } from '@/lib/site';

export const metadata: Metadata = { title: 'Founding Advisor Pilot | Veloxis', description: 'A focused 30-day evaluation of Veloxis for independent advisor retirement scenario conversations.', alternates: { canonical: absoluteUrl('/pilot') } };

const inclusions = ['30-day evaluation access to the synthetic retirement scenario demo', 'Two fictional client-meeting scenarios', 'Written onboarding from the builder', 'A closing feedback prompt to shape the next product decision'];

export default function PilotPage() {
  const checkoutUrl = siteConfig.pilotCheckoutUrl;
  return <MarketingShell><StructuredData value={softwareApplicationSchema} /><PageHeading eyebrow="Founding Advisor Pilot" title="Evaluate one focused retirement conversation for $99."><p>A small, time-boxed product evaluation for independent advisors who want to test a clearer Current Plan versus Proposed Plan discussion.</p></PageHeading><section className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-[1.1fr_0.9fr] md:px-8"><div><h2 className="text-2xl font-black tracking-tight text-[#111c3d]">Included in the pilot</h2><ul className="mt-6 space-y-4 text-slate-700">{inclusions.map(item => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" /> <span>{item}</span></li>)}</ul><h2 className="mt-10 text-xl font-black text-[#111c3d]">Not included</h2><p className="mt-3 leading-7 text-slate-600">No client-data storage, account connections, tax calculations, financial advice, compliance review, or production advisor workflow. The pilot is for a synthetic demonstration only.</p></div><aside id="enrollment" className="rounded-2xl bg-[#111c3d] p-7 text-white shadow-xl shadow-blue-950/15"><p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">Founding price</p><p className="mt-3 text-5xl font-black">$99</p><p className="mt-2 text-slate-300">One time. No recurring subscription.</p>{checkoutUrl ? <a href={checkoutUrl} className="mt-7 flex w-full items-center justify-center rounded-lg bg-white px-5 py-3.5 text-sm font-bold text-[#111c3d] transition hover:bg-cyan-50">Purchase the founding pilot</a> : <div className="mt-7 rounded-lg border border-cyan-300/30 bg-cyan-300/10 p-4 text-sm leading-6 text-cyan-50"><strong>Invitation-only enrollment.</strong><br />A Dodo hosted checkout link will appear here once the pilot is opened for payment.</div>}<Link href="/demo" className="mt-4 block text-center text-sm font-bold text-cyan-300 hover:text-white">Explore the synthetic demo first</Link></aside></section><section className="border-t border-slate-200 bg-white"><div className="mx-auto max-w-6xl px-5 py-10 md:px-8"><PrimaryLink href="/methodology">Review the calculation boundary</PrimaryLink></div></section></MarketingShell>;
}

