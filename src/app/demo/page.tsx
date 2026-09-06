'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import Link from 'next/link';
import { CaseOverview } from '@/components/CaseOverview';
import { CashflowSankey } from '@/components/CashflowSankey';
import { EstateTopology } from '@/components/EstateTopology';
import { MonteCarloChart } from '@/components/MonteCarloChart';
import { PlanComparison } from '@/components/PlanComparison';
import { StressMatrix } from '@/components/StressMatrix';
import { TaxWaterfall } from '@/components/TaxWaterfall';
import { computeSensitivityMatrix, runDeterministicProjection, STRESS_SCENARIOS } from '@/lib/engine/monteCarlo';
import { createDemoHouseholdWorkspace, DEMO_CASES, DemoCaseId, derivePlanScenarios, summarizeHousehold } from '@/lib/household';
import { comparePlanScenarios } from '@/lib/scenarios';
import { StressScenario } from '@/types/financial';
import { HouseholdWorkspace } from '@/types/household';

type ActiveTab = 'COMPARE' | 'MONTE_CARLO' | 'CASHFLOW' | 'TAX' | 'ESTATE' | 'STRESS';
type PlanId = 'current' | 'proposed';

const tabs: Array<{ id: ActiveTab; label: string }> = [
  { id: 'COMPARE', label: 'Current vs Proposed' },
  { id: 'MONTE_CARLO', label: 'Monte Carlo' },
  { id: 'CASHFLOW', label: 'Cash-flow map' },
  { id: 'TAX', label: 'Tax allocation' },
  { id: 'ESTATE', label: 'Estate map' },
  { id: 'STRESS', label: 'Stress test' },
];

export default function DemoPage() {
  const [activeCaseId, setActiveCaseId] = useState<DemoCaseId>('accumulator');
  const [activeTab, setActiveTab] = useState<ActiveTab>('COMPARE');
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('proposed');
  const [activeStressScenario, setActiveStressScenario] = useState<StressScenario | null>(null);
  const [workspace, setWorkspace] = useState<HouseholdWorkspace>(() => createDemoHouseholdWorkspace());
  const updateWorkspace = (updater: (current: HouseholdWorkspace) => HouseholdWorkspace) => {
    setWorkspace(current => ({ ...updater(current), updatedAt: new Date().toISOString() }));
  };
  const loadCase = (caseId: DemoCaseId) => {
    setActiveCaseId(caseId);
    setWorkspace(createDemoHouseholdWorkspace(caseId));
    setActiveStressScenario(null);
    setSelectedPlanId('proposed');
    setActiveTab('COMPARE');
  };
  const resetDemo = () => loadCase(activeCaseId);
  const calculatedWorkspace = useDeferredValue(workspace);
  const isCalculating = calculatedWorkspace !== workspace;
  const comparison = useMemo(() => {
    const scenarios = derivePlanScenarios(calculatedWorkspace);
    return comparePlanScenarios(scenarios.current, scenarios.proposed);
  }, [calculatedWorkspace]);
  const selectedResult = comparison[selectedPlanId];
  const selectedParams = selectedResult.params;
  const selectedProjection = useMemo(() => runDeterministicProjection(selectedParams), [selectedParams]);
  const stressParams = useMemo(() => activeStressScenario
    ? { ...selectedParams, ...activeStressScenario.getPatch(selectedParams) }
    : selectedParams, [activeStressScenario, selectedParams]);
  const sensitivityMatrix = useMemo(() => activeTab === 'STRESS' ? computeSensitivityMatrix(stressParams) : null, [activeTab, stressParams]);
  const householdSummary = summarizeHousehold(workspace);
  const activeCase = DEMO_CASES.find(item => item.id === activeCaseId) ?? DEMO_CASES[0];
  const formatMoney = (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: workspace.profile.currency, maximumFractionDigits: 0,
  }).format(amount);

  return (
    <main className="min-h-screen bg-[#070a12] p-4 text-slate-100 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-lg font-black shadow-lg shadow-cyan-500/20">V</div>
              <div>
                <div className="flex flex-wrap items-center gap-2"><h1 className="text-lg font-black tracking-wider">VELOXIS</h1><span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] text-cyan-300">SYNTHETIC DEMO</span></div>
                <p className="mt-1 text-xs text-slate-400">Fictional US retirement scenario · no client data · {workspace.profile.currency}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2"><HeaderMetric label="Current success" value={`${(comparison.current.metrics.successProbabilityAtPlanEnd * 100).toFixed(1)}%`} tone="text-slate-100" /><HeaderMetric label="Proposed success" value={`${(comparison.proposed.metrics.successProbabilityAtPlanEnd * 100).toFixed(1)}%`} tone="text-emerald-300" /><HeaderMetric label="Shared seed" value={`${workspace.assumptions.randomSeed}`} tone="text-cyan-300" /></div>
          </div>
        </header>
        <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm leading-6 text-amber-100"><strong>Public evaluation boundary:</strong> this is a fictional household. Do not enter client names, account information, documents, or any personal financial data. Outputs are educational planning simulations, not investment, tax, legal, or financial advice.</p>
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4" aria-labelledby="demo-case-heading">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="max-w-3xl"><p id="demo-case-heading" className="text-xs font-bold uppercase tracking-widest text-cyan-400">Choose a guided synthetic case</p><p className="mt-2 text-sm leading-6 text-slate-300">{activeCase.description}</p><p className="mt-1 text-xs leading-5 text-slate-500">Meeting question: {activeCase.meetingQuestion}</p></div>
            <div className="flex flex-col gap-2 sm:flex-row">{DEMO_CASES.map(item => <button key={item.id} onClick={() => loadCase(item.id)} className={`rounded-xl px-4 py-2.5 text-left text-xs font-bold transition ${activeCaseId === item.id ? 'bg-cyan-400 text-slate-950' : 'border border-slate-700 text-slate-300 hover:bg-slate-800'}`}>{item.label}</button>)}</div>
          </div>
        </section>
        <div className="flex flex-col justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 sm:flex-row sm:items-center"><p className="text-xs leading-5 text-slate-400">Explore the proposal levers, then reset to return to the original synthetic case.</p><button onClick={resetDemo} className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold text-slate-200 transition hover:bg-slate-800">Reset synthetic case</button></div>
        <CaseOverview params={comparison.current.params} />
        <nav className="flex flex-wrap gap-3" aria-label="Meeting steps">
          <button aria-pressed={activeTab === 'COMPARE'} onClick={() => setActiveTab('COMPARE')} className="rounded-lg border border-cyan-700 px-4 py-2 text-sm text-cyan-200">2. Compare and explain</button>
          <details className="rounded-lg border border-slate-700 p-2 text-sm"><summary className="cursor-pointer px-2">Supporting views{activeTab !== 'COMPARE' ? ` · ${tabs.find(tab => tab.id === activeTab)?.label}` : ''}</summary>
            <div className="mt-3 flex flex-wrap gap-2">{tabs.filter(tab => tab.id !== 'COMPARE').map(tab => <button aria-pressed={activeTab === tab.id} key={tab.id} onClick={() => setActiveTab(tab.id)} className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200">{tab.label}</button>)}</div>
          </details>
          <Link href="/pilot" className="px-3 py-2 text-sm text-cyan-300">Advisor evaluation</Link>
          <Link href="/" className="px-3 py-2 text-sm text-slate-400">Home</Link>
        </nav>
        <p role="status" className="text-xs text-slate-400">{isCalculating ? 'Recalculating… displayed results reflect the previous inputs.' : 'Results updated. Changes stay in this tab only; refreshing resets the case.'}</p>
        <div aria-busy={isCalculating} className="space-y-6">
        {activeTab === 'COMPARE' && <PlanComparison workspace={workspace} comparison={comparison} onChange={updateWorkspace} />}
        {activeTab === 'COMPARE' && <section className="space-y-4"><h2 className="font-bold">3. Trace the annual cash flow</h2><PlanToggle selected={selectedPlanId} onChange={setSelectedPlanId} /><CashflowSankey key={activeCaseId} projection={selectedProjection} currency={workspace.profile.currency} planName={selectedPlanId === 'current' ? 'Current Plan' : 'Proposed Plan'} /></section>}
        {['MONTE_CARLO', 'CASHFLOW', 'STRESS'].includes(activeTab) && <PlanToggle selected={selectedPlanId} onChange={planId => { setSelectedPlanId(planId); setActiveStressScenario(null); }} />}
        {activeTab === 'MONTE_CARLO' && <div className="space-y-4"><MonteCarloChart data={selectedResult} currency={workspace.profile.currency} /><p className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm leading-6 text-slate-400">This fan chart uses {selectedResult.params.simulationsCount.toLocaleString()} seeded paths. Reopening the demo with the same synthetic inputs and seed produces the same financial distributions.</p></div>}
        {activeTab === 'CASHFLOW' && <CashflowSankey projection={selectedProjection} currency={workspace.profile.currency} planName={selectedPlanId === 'current' ? 'Current Plan' : 'Proposed Plan'} />}
        {activeTab === 'TAX' && <TaxWaterfall workspace={workspace} />}
        {activeTab === 'ESTATE' && <EstateTopology workspace={workspace} />}
        {activeTab === 'STRESS' && sensitivityMatrix && <StressMatrix matrix={sensitivityMatrix} stressScenarios={STRESS_SCENARIOS} activeScenarioId={activeStressScenario?.id ?? null} onApplyScenario={setActiveStressScenario} />}
        </div>
        <footer className="flex flex-col items-center justify-between gap-3 border-t border-slate-900 pb-4 pt-6 text-center text-xs text-slate-500 sm:flex-row"><span>Synthetic household · Modeled net worth {formatMoney(householdSummary.netWorth)}</span><div className="flex flex-wrap justify-center gap-4"><Link href="/workspace" className="text-cyan-400 hover:text-cyan-300">Open full workspace preview</Link><span className="font-mono text-cyan-500/80">calculation-backed · no data persistence</span></div></footer>
      </div>
    </main>
  );
}

function HeaderMetric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return <div className="min-w-0 rounded-xl border border-slate-800 bg-slate-950/80 px-2 py-2 text-center"><span className="block text-[10px] text-slate-500">{label}</span><span className={`break-all font-mono text-sm font-bold ${tone}`}>{value}</span></div>;
}

function PlanToggle({ selected, onChange }: { selected: PlanId; onChange: (plan: PlanId) => void }) {
  return <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-2"><p className="pl-2 text-xs text-slate-500">Viewing plan</p><div className="flex gap-1">{(['current', 'proposed'] as const).map(plan => <button key={plan} onClick={() => onChange(plan)} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${selected === plan ? 'bg-cyan-400 text-slate-950' : 'text-slate-400 hover:bg-slate-800'}`}>{plan === 'current' ? 'Current Plan' : 'Proposed Plan'}</button>)}</div></div>;
}
