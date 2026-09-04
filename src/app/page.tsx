import { Metadata } from 'next';
import { MarketingShell, PilotCallout, PrimaryLink, ProofPoint } from '@/components/marketing/MarketingShell';
import { faqSchema, softwareApplicationSchema, StructuredData } from '@/components/marketing/StructuredData';
import { createDemoHouseholdWorkspace, derivePlanScenarios } from '@/lib/household';
import { comparePlanScenarios } from '@/lib/scenarios';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Veloxis — Retirement scenario conversations for independent advisors',
  description: 'A browser-based retirement scenario visualizer for explaining current and proposed plans with the same simulated market paths.',
  alternates: { canonical: absoluteUrl('/') },
};

export default function HomePage() {
  return (
    <MarketingShell>
      <StructuredData value={softwareApplicationSchema} />
      <StructuredData value={faqSchema} />
      <section className="overflow-hidden border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Retirement scenario conversations</p>
            <h1 className="mt-4 text-5xl font-black tracking-[-0.055em] text-[#111c3d] md:text-7xl">Show what changed. Explain why it matters.</h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">Veloxis helps independent advisors compare a current retirement plan with a proposed plan using the same simulated market paths and a shared annual cash-flow ledger.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><PrimaryLink href="/demo">Explore the synthetic demo</PrimaryLink><PrimaryLink href="/for-independent-advisors">How it fits a client meeting</PrimaryLink></div>
            <p className="mt-5 text-sm text-slate-500">Educational scenario visualizer only. It is not financial, investment, tax, or legal advice.</p>
          </div>
          <ScenarioPreview />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8"><div className="grid gap-5 md:grid-cols-3"><ProofPoint icon="paths" title="Same market paths">Compare two plans using one seeded sequence of simulated returns instead of mistaking random variation for an improvement.</ProofPoint><ProofPoint icon="ledger" title="A yearly explanation">Trace the modeled result through a clear annual ledger, from opening assets to spending and ending assets.</ProofPoint><ProofPoint icon="local" title="A bounded public demo">Evaluate a fictional household scenario only. The public pilot does not accept client personal or account data.</ProofPoint></div></section>
      <section className="border-y border-slate-200 bg-white"><div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[0.85fr_1.15fr] md:px-8"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Built for one focused question</p><h2 className="mt-4 text-3xl font-black tracking-tight text-[#111c3d]">How can an independent advisor compare a current and proposed retirement plan in a client meeting?</h2></div><div className="space-y-6 text-base leading-8 text-slate-600"><p>Start with a baseline. Change only the retirement age, annual savings, retirement spending, or Social Security claim age. Then show the calculated difference rather than a generic recommendation.</p><p>Veloxis is a focused conversation tool—not a replacement for planning, compliance, tax, or portfolio-management systems.</p></div></div></section>
      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8"><PilotCallout /></section>
    </MarketingShell>
  );
}

function ScenarioPreview() {
  const syntheticWorkspace = createDemoHouseholdWorkspace();
  const scenarios = derivePlanScenarios(syntheticWorkspace);
  const comparison = comparePlanScenarios(scenarios.current, scenarios.proposed);
  const formatProbability = (value: number) => `${(value * 100).toFixed(1)}%`;
  return (
    <div className="relative rounded-3xl bg-[#111c3d] p-5 shadow-2xl shadow-blue-950/20 md:p-7">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="relative rounded-2xl border border-white/10 bg-slate-950/50 p-5 text-white">
        <div className="flex items-center justify-between"><div><p className="font-mono text-xs text-cyan-300">SYNTHETIC RETIREMENT CASE</p><p className="mt-1 text-sm font-bold">Same household · Same seed</p></div><span className="rounded-full bg-cyan-300/15 px-2.5 py-1 text-xs font-bold text-cyan-200">Scenario view</span></div>
        <div className="mt-7 grid grid-cols-2 gap-3"><MetricCard label="Current success" value={formatProbability(comparison.current.metrics.successProbabilityAtPlanEnd)} tone="text-slate-100" /><MetricCard label="Proposed success" value={formatProbability(comparison.proposed.metrics.successProbabilityAtPlanEnd)} tone="text-emerald-300" /></div>
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4"><div className="flex items-end gap-2" aria-label="Illustrative comparison only"><span className="h-12 flex-1 rounded-t bg-slate-500/70" /><span className="h-20 flex-1 rounded-t bg-cyan-400/80" /><span className="h-16 flex-1 rounded-t bg-blue-400/60" /><span className="h-28 flex-1 rounded-t bg-emerald-400/80" /><span className="h-24 flex-1 rounded-t bg-cyan-300/70" /></div><p className="mt-3 text-xs leading-5 text-slate-300">Illustrative presentation only. Open the demo to inspect the calculated synthetic scenario.</p></div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, tone }: { label: string; value: string; tone: string }) {
  return <div className="rounded-xl border border-white/10 bg-white/5 p-3"><p className="text-xs text-slate-400">{label}</p><p className={`mt-1 font-mono text-2xl font-black ${tone}`}>{value}</p></div>;
}
