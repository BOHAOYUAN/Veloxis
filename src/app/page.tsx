'use client';

import React, { useMemo, useState } from 'react';
import { CashflowSankey } from '@/components/CashflowSankey';
import { EstateTopology } from '@/components/EstateTopology';
import { HouseholdWorkspace } from '@/components/HouseholdWorkspace';
import { MonteCarloChart } from '@/components/MonteCarloChart';
import { PlanComparison } from '@/components/PlanComparison';
import { StressMatrix } from '@/components/StressMatrix';
import { TaxWaterfall } from '@/components/TaxWaterfall';
import { useHouseholdWorkspace } from '@/hooks/useHouseholdWorkspace';
import {
  computeSensitivityMatrix,
  runDeterministicProjection,
  STRESS_SCENARIOS,
} from '@/lib/engine/monteCarlo';
import { derivePlanScenarios, summarizeHousehold } from '@/lib/household';
import { comparePlanScenarios } from '@/lib/scenarios';
import { StressScenario } from '@/types/financial';

type ActiveTab = 'PROFILE' | 'COMPARE' | 'MONTE_CARLO' | 'CASHFLOW' | 'TAX' | 'ESTATE' | 'STRESS';
type PlanId = 'current' | 'proposed';

const tabs: Array<{ id: ActiveTab; label: string }> = [
  { id: 'PROFILE', label: 'Household' },
  { id: 'COMPARE', label: 'Current vs Proposed' },
  { id: 'MONTE_CARLO', label: 'Monte Carlo' },
  { id: 'CASHFLOW', label: 'Cash-flow map' },
  { id: 'TAX', label: 'Tax allocation' },
  { id: 'ESTATE', label: 'Estate map' },
  { id: 'STRESS', label: 'Stress test' },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('COMPARE');
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('proposed');
  const [activeStressScenario, setActiveStressScenario] = useState<StressScenario | null>(null);
  const { workspace, hydrated, updateWorkspace, resetDemo } = useHouseholdWorkspace();
  const scenarios = useMemo(() => derivePlanScenarios(workspace), [workspace]);
  const comparison = useMemo(
    () => comparePlanScenarios(scenarios.current, scenarios.proposed),
    [scenarios],
  );
  const selectedResult = comparison[selectedPlanId];
  const selectedParams = selectedResult.params;
  const selectedProjection = useMemo(
    () => runDeterministicProjection(selectedParams),
    [selectedParams],
  );
  const stressParams = useMemo(() => activeStressScenario
    ? { ...selectedParams, ...activeStressScenario.getPatch(selectedParams) }
    : selectedParams,
  [activeStressScenario, selectedParams]);
  const sensitivityMatrix = useMemo(
    () => computeSensitivityMatrix(stressParams),
    [stressParams],
  );
  const householdSummary = summarizeHousehold(workspace);
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
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg font-black tracking-wider">VELOXIS WEALTH OS</h1>
                  <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] text-cyan-300">DETERMINISTIC PLANNING LAB</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">Local-first household planning simulator · {workspace.profile.jurisdiction} / {workspace.profile.currency}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <HeaderMetric label="Current success" value={`${(comparison.current.metrics.successProbabilityAtPlanEnd * 100).toFixed(1)}%`} tone="text-slate-100" />
              <HeaderMetric label="Proposed success" value={`${(comparison.proposed.metrics.successProbabilityAtPlanEnd * 100).toFixed(1)}%`} tone="text-emerald-300" />
              <HeaderMetric label="Shared seed" value={`${workspace.assumptions.randomSeed}`} tone="text-cyan-300" />
            </div>
          </div>
        </header>

        <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2 text-xs text-amber-100">Planning simulator only. Do not use its output as investment, tax, legal, or financial advice.</p>

        <nav className="module-nav flex gap-2 overflow-x-auto border-b border-slate-800 pb-3" aria-label="Planning modules">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition ${activeTab === tab.id ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20' : 'border border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}>{tab.label}</button>
          ))}
        </nav>

        {activeTab === 'PROFILE' && (
          <HouseholdWorkspace
            workspace={workspace}
            hydrated={hydrated}
            onChange={updateWorkspace}
            onResetDemo={resetDemo}
            onApplyToPlan={() => setActiveTab('COMPARE')}
          />
        )}

        {activeTab === 'COMPARE' && <PlanComparison workspace={workspace} comparison={comparison} onChange={updateWorkspace} />}

        {['MONTE_CARLO', 'CASHFLOW', 'STRESS'].includes(activeTab) && (
          <PlanToggle selected={selectedPlanId} onChange={planId => { setSelectedPlanId(planId); setActiveStressScenario(null); }} />
        )}

        {activeTab === 'MONTE_CARLO' && (
          <div className="space-y-4">
            <MonteCarloChart data={selectedResult} currency={workspace.profile.currency} />
            <p className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-xs text-slate-400">This fan chart uses {selectedResult.params.simulationsCount.toLocaleString()} seeded paths. Reopening the plan with the same inputs and seed produces the same financial distributions.</p>
          </div>
        )}

        {activeTab === 'CASHFLOW' && <CashflowSankey projection={selectedProjection} currency={workspace.profile.currency} planName={selectedPlanId === 'current' ? 'Current Plan' : 'Proposed Plan'} />}
        {activeTab === 'TAX' && <TaxWaterfall workspace={workspace} />}
        {activeTab === 'ESTATE' && <EstateTopology workspace={workspace} />}
        {activeTab === 'STRESS' && (
          <StressMatrix
            matrix={sensitivityMatrix}
            stressScenarios={STRESS_SCENARIOS}
            activeScenarioId={activeStressScenario?.id ?? null}
            onApplyScenario={setActiveStressScenario}
          />
        )}

        <footer className="flex flex-col items-center justify-between gap-2 border-t border-slate-900 pb-4 pt-6 text-center text-xs text-slate-500 sm:flex-row">
          <span>{workspace.profile.householdName} · Net worth {formatMoney(householdSummary.netWorth)}</span>
          <span className="font-mono text-cyan-500/80">Local-first · calculation-backed · no external data transfer</span>
        </footer>
      </div>
    </main>
  );
}

function HeaderMetric({ label, value, tone }: { label: string; value: string; tone: string }) {
  return <div className="min-w-28 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-center"><span className="block text-[10px] text-slate-500">{label}</span><span className={`font-mono text-sm font-bold ${tone}`}>{value}</span></div>;
}

function PlanToggle({ selected, onChange }: { selected: PlanId; onChange: (plan: PlanId) => void }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-2">
      <p className="pl-2 text-xs text-slate-500">Viewing plan</p>
      <div className="flex gap-1">
        {(['current', 'proposed'] as const).map(plan => (
          <button key={plan} onClick={() => onChange(plan)} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${selected === plan ? 'bg-cyan-400 text-slate-950' : 'text-slate-400 hover:bg-slate-800'}`}>{plan === 'current' ? 'Current Plan' : 'Proposed Plan'}</button>
        ))}
      </div>
    </div>
  );
}
