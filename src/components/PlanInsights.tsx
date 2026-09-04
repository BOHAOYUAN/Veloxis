'use client';

import React from 'react';
import { ScenarioComparison } from '@/types/financial';

interface PlanInsightsProps {
  comparison: ScenarioComparison;
  currency: string;
}

export function PlanInsights({ comparison, currency }: PlanInsightsProps) {
  const deltaPoints = comparison.successProbabilityDelta * 100;
  const improved = deltaPoints > 0.05;
  const declined = deltaPoints < -0.05;
  const formatMoney = (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency, maximumFractionDigits: 0, signDisplay: 'exceptZero',
  }).format(amount);
  const observations = [
    comparison.retirementAgeDelta !== 0
      ? `Retirement age changes by ${comparison.retirementAgeDelta > 0 ? '+' : ''}${comparison.retirementAgeDelta} years.`
      : null,
    comparison.annualSavingsDelta !== 0
      ? `Annual savings change by ${formatMoney(comparison.annualSavingsDelta)}.`
      : null,
    comparison.retirementExpenseDelta !== 0
      ? `Annual retirement spending changes by ${formatMoney(comparison.retirementExpenseDelta)}.`
      : null,
    comparison.socialSecurityClaimAgeDelta !== 0
      ? `The entered Social Security claim age changes by ${comparison.socialSecurityClaimAgeDelta > 0 ? '+' : ''}${comparison.socialSecurityClaimAgeDelta} years.`
      : null,
  ].filter((value): value is string => Boolean(value));

  return (
    <section className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
      <div className="flex flex-col justify-between gap-3 border-b border-slate-800 pb-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-mono text-cyan-400">DETERMINISTIC · CALCULATION-BACKED</p>
          <h3 className="mt-1 text-sm font-bold text-slate-100">Plan comparison insights</h3>
          <p className="mt-1 text-xs text-slate-400">Observations are generated from the two displayed simulations using the same random seed.</p>
        </div>
        <div className="text-left sm:text-right">
          <span className={`font-mono text-2xl font-black ${improved ? 'text-emerald-300' : declined ? 'text-rose-300' : 'text-slate-300'}`}>
            {deltaPoints > 0 ? '+' : ''}{deltaPoints.toFixed(1)} pp
          </span>
          <span className="block text-xs text-slate-500">success probability difference</span>
        </div>
      </div>

      <div className={`rounded-xl border p-4 ${improved ? 'border-emerald-500/30 bg-emerald-500/10' : declined ? 'border-rose-500/30 bg-rose-500/10' : 'border-slate-700 bg-slate-950/50'}`}>
        <p className="text-sm font-bold text-slate-100">
          {improved ? 'The Proposed Plan improves the simulated outcome.' : declined ? 'The Proposed Plan reduces the simulated outcome.' : 'The plans currently produce the same success probability.'}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-slate-300">
          At age {comparison.current.metrics.planEndAge}, success changes from {(comparison.current.metrics.successProbabilityAtPlanEnd * 100).toFixed(1)}% to {(comparison.proposed.metrics.successProbabilityAtPlanEnd * 100).toFixed(1)}%. Median ending assets change by {formatMoney(comparison.medianEndingAssetDelta)}.
        </p>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {(observations.length ? observations : ['No plan levers differ yet. Reset or edit the Proposed Plan to create a comparison.']).map(observation => (
          <div key={observation} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-xs text-slate-300">{observation}</div>
        ))}
      </div>

      <p className="text-[11px] text-slate-500">Simulation comparison only; not investment, tax, legal, or financial advice.</p>
    </section>
  );
}
