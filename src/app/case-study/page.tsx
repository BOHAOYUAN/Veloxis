import { Metadata } from 'next';
import { ArrowRight, CheckCircle2, Code2, GitCompareArrows, ShieldCheck } from 'lucide-react';
import { MarketingShell, PageHeading, PrimaryLink } from '@/components/marketing/MarketingShell';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Engineering Case Study',
  description: 'How Veloxis isolates retirement-plan changes with a shared annual ledger, paired market paths, and deterministic verification.',
  alternates: { canonical: absoluteUrl('/case-study') },
};

const decisions = [
  {
    title: 'Pair the random paths',
    body: 'Current and Proposed use the same seed and the same simulated return sequence. The comparison delta therefore reflects changed plan inputs instead of two unrelated samples.',
  },
  {
    title: 'Make cash flow inspectable',
    body: 'One annual projection contract feeds the scenario summary and supporting views: opening assets, income, savings, spending, withdrawals, and ending assets.',
  },
  {
    title: 'Keep claims inside the model',
    body: 'Social Security is a user-provided estimate. Tax views show account categories without inventing tax savings. Estate views are educational scenarios, not legal conclusions.',
  },
  {
    title: 'Prefer rules over pretend AI',
    body: 'Plan insights are deterministic and calculation-backed. The build does not claim an LLM, automatic advice, or unexplained percentage improvements.',
  },
];

const verifiedContracts = [
  'The same inputs and seed reproduce the same distribution and metrics.',
  'Different seeds produce different simulated paths.',
  'Plan-end success is evaluated at the selected end age—not a hard-coded age 85.',
  'Retirement starts in the selected retirement year: saving stops and retirement spending begins.',
  'An unchanged Proposed clone matches Current; displayed deltas come from the two calculated results.',
  'Older browser-local data is migrated with explicit defaults instead of being silently discarded.',
];

export default function CaseStudyPage() {
  return (
    <MarketingShell>
      <PageHeading eyebrow="Engineering case study" title="A narrow financial-planning workflow, built for inspectability.">
        <p>Veloxis is a portfolio vertical slice: household assumptions flow through an annual ledger into a paired Current versus Proposed simulation and a calculation-backed explanation.</p>
      </PageHeading>

      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">The product question</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-[#111c3d]">How do you show that a better result came from the plan—not simulation noise?</h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-slate-600">
            <p>Running two independent Monte Carlo samples can make ordinary random variation look like a planning improvement. That is a communication problem as much as a modeling problem.</p>
            <p>Veloxis pairs the simulated market paths, limits the adjustable proposal levers, and exposes the yearly cash-flow bridge. The result is easier to explain and easier to challenge.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Data flow</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#111c3d]">One traceable vertical slice</h2>
          <div className="mt-8 grid gap-3 md:grid-cols-5">
            {['Fictional household', 'Annual cash-flow ledger', 'Current + Proposed', 'Shared-seed simulation', 'Calculated explanation'].map((step, index) => (
              <div key={step} className="relative rounded-2xl border border-slate-200 bg-[#f6f8fc] p-5">
                <span className="font-mono text-xs font-bold text-blue-700">0{index + 1}</span>
                <p className="mt-3 font-black leading-6 text-[#111c3d]">{step}</p>
                {index < 4 && <ArrowRight aria-hidden="true" className="absolute -right-2.5 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 rounded-full bg-white text-blue-700 md:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div className="flex items-center gap-3"><GitCompareArrows className="h-6 w-6 text-blue-700" /><h2 className="text-3xl font-black tracking-tight text-[#111c3d]">Four deliberate engineering decisions</h2></div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {decisions.map(decision => <article key={decision.title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><h3 className="text-xl font-black text-[#111c3d]">{decision.title}</h3><p className="mt-3 leading-7 text-slate-600">{decision.body}</p></article>)}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#111c3d] text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[0.8fr_1.2fr] md:px-8 md:py-20">
          <div>
            <div className="flex items-center gap-3 text-cyan-300"><ShieldCheck className="h-6 w-6" /><p className="text-sm font-bold uppercase tracking-[0.18em]">Verification</p></div>
            <h2 className="mt-4 text-3xl font-black tracking-tight">Contracts the test suite protects</h2>
            <p className="mt-4 leading-7 text-slate-300">Automated checks reduce regression risk. They do not make the model independently audited or appropriate for real client advice.</p>
          </div>
          <ul className="space-y-4">
            {verifiedContracts.map(item => <li key={item} className="flex gap-3 leading-7 text-slate-200"><CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-cyan-300" /><span>{item}</span></li>)}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-7"><Code2 className="h-5 w-5 text-blue-700" /><h2 className="mt-5 text-xl font-black text-[#111c3d]">What exists today</h2><p className="mt-3 leading-7 text-slate-600">Two guided synthetic cases, a browser-local workspace, deterministic comparison, supporting ledger views, responsive public pages, and automated tests.</p></article>
          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-7"><h2 className="text-xl font-black text-amber-950">What is intentionally absent</h2><p className="mt-3 leading-7 text-amber-900">No authentication, cloud client records, bank connections, document upload, automated advice, precise tax engine, or production availability promise.</p></article>
          <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-7"><h2 className="text-xl font-black text-emerald-950">The next evidence gate</h2><p className="mt-3 leading-7 text-emerald-900">Advisor interviews and repeat use must identify one recurring meeting problem before subscription infrastructure or broader planning features are built.</p></article>
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <PrimaryLink href="/demo">Inspect the guided demo</PrimaryLink>
          <PrimaryLink href="/workspace">Open the workspace</PrimaryLink>
          <a href="https://github.com/BOHAOYUAN/Veloxis" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-[#111c3d] transition hover:border-blue-400 hover:bg-blue-50">Review the source code<ArrowRight className="h-4 w-4" /></a>
        </div>
        <p className="mt-6 text-sm leading-6 text-slate-500">All examples use fictional data. Veloxis is an educational planning simulator, not investment, tax, legal, or financial advice.</p>
      </section>
    </MarketingShell>
  );
}
