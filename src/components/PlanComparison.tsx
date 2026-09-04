'use client';

import React from 'react';
import { createProposedPlanFromCurrent } from '@/lib/household';
import { HouseholdWorkspace } from '@/types/household';
import { ScenarioComparison } from '@/types/financial';
import { PlanInsights } from '@/components/PlanInsights';

interface PlanComparisonProps {
  workspace: HouseholdWorkspace;
  comparison: ScenarioComparison;
  onChange: (updater: (current: HouseholdWorkspace) => HouseholdWorkspace) => void;
}

export function PlanComparison({ workspace, comparison, onChange }: PlanComparisonProps) {
  const formatMoney = (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: workspace.profile.currency, maximumFractionDigits: 0,
  }).format(amount);
  const updateProposed = (
    key: keyof HouseholdWorkspace['proposedPlan'],
    value: number,
  ) => onChange(current => ({
    ...current,
    proposedPlan: { ...current.proposedPlan, [key]: value },
  }));

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-mono text-cyan-400">SAME HOUSEHOLD · SAME RANDOM SEED</p>
            <h2 className="mt-1 text-xl font-black text-slate-100">Current Plan vs Proposed Plan</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">Current Plan is derived from the household workspace. Proposed Plan can change four explicit levers and reruns the same simulated market paths.</p>
          </div>
          <button onClick={() => onChange(current => ({ ...current, proposedPlan: createProposedPlanFromCurrent(current) }))} className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800">Reset Proposed to Current</button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PlanCard name="Current Plan" result={comparison.current} formatMoney={formatMoney} />
        <PlanCard name="Proposed Plan" result={comparison.proposed} formatMoney={formatMoney} proposed />
      </div>

      <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-5">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-100">Proposed Plan levers</h3>
          <p className="mt-1 text-xs text-slate-500">Values update this synthetic scenario. Monetary inputs use today&apos;s dollars.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Control label="Retirement age" value={workspace.proposedPlan.retirementAge} min={workspace.profile.currentAge + 1} max={workspace.profile.longevityAge - 1} step={1} onChange={value => updateProposed('retirementAge', value)} suffix="years" />
          <Control label="Annual savings" value={workspace.proposedPlan.annualSavings} min={0} max={Math.max(300000, comparison.current.params.annualIncome)} step={1000} onChange={value => updateProposed('annualSavings', value)} format={formatMoney} />
          <Control label="Retirement spending" value={workspace.proposedPlan.retirementAnnualExpense} min={10000} max={Math.max(300000, comparison.current.params.retirementAnnualExpense * 2)} step={1000} onChange={value => updateProposed('retirementAnnualExpense', value)} format={formatMoney} />
          <Control label="Social Security claim age" value={workspace.proposedPlan.socialSecurityClaimAge} min={62} max={70} step={1} onChange={value => updateProposed('socialSecurityClaimAge', value)} suffix="years" />
        </div>
      </div>

      <PlanInsights comparison={comparison} currency={workspace.profile.currency} />
    </section>
  );
}

function PlanCard({
  name,
  result,
  formatMoney,
  proposed = false,
}: {
  name: string;
  result: ScenarioComparison['current'];
  formatMoney: (amount: number) => string;
  proposed?: boolean;
}) {
  const metrics = result.metrics;
  return (
    <article className={`rounded-2xl border p-5 ${proposed ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-slate-800 bg-slate-950/60'}`}>
      <div className="flex items-start justify-between">
        <div><p className="text-xs font-bold uppercase tracking-widest text-slate-500">{name}</p><p className="mt-1 text-xs text-slate-400">Seed {result.params.randomSeed}</p></div>
        <p className={`font-mono text-3xl font-black ${metrics.successProbabilityAtPlanEnd >= 0.8 ? 'text-emerald-300' : metrics.successProbabilityAtPlanEnd >= 0.6 ? 'text-amber-300' : 'text-rose-300'}`}>{(metrics.successProbabilityAtPlanEnd * 100).toFixed(1)}%</p>
      </div>
      <p className="mt-1 text-right text-[11px] text-slate-500">success at age {metrics.planEndAge}</p>
      <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
        <Metric label="Retirement age" value={`${result.params.retirementAge}`} />
        <Metric label="SS claim age" value={`${result.params.socialSecurityClaimAge}`} />
        <Metric label="Annual savings" value={formatMoney(result.params.annualSavings)} />
        <Metric label="Retirement spending" value={formatMoney(result.params.retirementAnnualExpense)} />
        <Metric label="Median at retirement" value={formatMoney(metrics.medianRetirementAsset)} />
        <Metric label="Median ending assets" value={formatMoney(metrics.medianEndingAsset)} />
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3"><p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 font-mono font-bold text-slate-100">{value}</p></div>;
}

function Control({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  suffix,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  suffix?: string;
}) {
  return (
    <label className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-400">
      <span className="flex justify-between gap-2"><span>{label}</span><strong className="font-mono text-cyan-300">{format ? format(value) : value} {suffix}</strong></span>
      <input className="mt-3 w-full accent-cyan-400" type="range" min={min} max={max} step={step} value={value} onChange={event => onChange(Number(event.target.value))} />
    </label>
  );
}
