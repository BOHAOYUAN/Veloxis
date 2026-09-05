'use client';

import React, { useMemo, useState } from 'react';
import { ProjectionYear } from '@/types/financial';

interface CashflowSankeyProps {
  projection: ProjectionYear[];
  currency: string;
  planName: string;
}

export function CashflowSankey({ projection, currency, planName }: CashflowSankeyProps) {
  const [selectedAge, setSelectedAge] = useState(projection[1]?.age ?? projection[0]?.age ?? 0);
  const minAge = projection[0]?.age ?? 0;
  const maxAge = projection.at(-1)?.age ?? minAge;

  const visibleAge = Math.max(minAge, Math.min(maxAge, selectedAge));

  const year = useMemo(
    () => projection.find(item => item.age === visibleAge) ?? projection[0],
    [projection, visibleAge],
  );
  if (!year) return null;

  const format = (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency, maximumFractionDigits: 0,
  }).format(amount);
  const inflows = [
    ['Earned income', year.earnedIncome, 'text-cyan-300'],
    ['Social Security estimate', year.socialSecurityIncome, 'text-blue-300'],
    ['Portfolio withdrawal', year.withdrawals, 'text-amber-300'],
  ] as const;
  const outflows = [
    ['Living expenses', year.livingExpenses, 'text-rose-300'],
    ['Retirement expenses', year.retirementExpenses, 'text-orange-300'],
    ['Goal expenses', year.goalExpenses, 'text-purple-300'],
    ['Portfolio contribution', year.contributions, 'text-emerald-300'],
  ] as const;

  return (
    <section className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-mono text-cyan-400">SHARED ANNUAL LEDGER · {planName.toUpperCase()}</p>
          <h2 className="mt-1 text-base font-bold text-slate-100">Annual cash-flow map</h2>
          <p className="mt-1 text-xs text-slate-400">Every value below comes from the same projection ledger used by the plan.</p>
        </div>
        <label className="rounded-xl border border-slate-800 bg-slate-950/80 px-4 py-2 text-xs text-slate-400">
          Age <span className="ml-2 font-mono font-bold text-cyan-300">{visibleAge}</span>
          <input className="mt-2 block w-48 accent-cyan-400" type="range" min={minAge} max={maxAge} value={visibleAge} onChange={event => setSelectedAge(Number(event.target.value))} />
        </label>
      </div>

      <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1.15fr_auto_1fr]">
        <FlowColumn title="Inflows" items={inflows} format={format} />
        <div className="hidden items-center text-2xl text-cyan-500 lg:flex">→</div>
        <div className="flex flex-col justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-cyan-400">Household ledger</p>
          <p className="mt-3 text-sm text-slate-400">Opening assets</p>
          <p className="font-mono text-xl font-black text-slate-100">{format(year.openingAssets)}</p>
          <p className="mt-3 text-sm text-slate-400">Expected investment return</p>
          <p className={`font-mono text-lg font-bold ${year.investmentReturn >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{format(year.investmentReturn)}</p>
          <div className="my-4 h-px bg-slate-800" />
          <p className="text-sm text-slate-400">Ending assets</p>
          <p className="font-mono text-2xl font-black text-cyan-300">{format(year.endingAssets)}</p>
        </div>
        <div className="hidden items-center text-2xl text-cyan-500 lg:flex">→</div>
        <FlowColumn title="Uses of cash" items={outflows} format={format} />
      </div>

      {year.unfundedExpenses > 0 && (
        <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
          Unfunded expenses at age {year.age}: {format(year.unfundedExpenses)}. The projection has exhausted available assets.
        </p>
      )}
    </section>
  );
}

function FlowColumn({
  title,
  items,
  format,
}: {
  title: string;
  items: ReadonlyArray<readonly [string, number, string]>;
  format: (amount: number) => string;
}) {
  return (
    <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">{title}</p>
      {items.map(([label, value, color]) => (
        <div key={label} className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
          <p className="text-[11px] text-slate-500">{label}</p>
          <p className={`mt-1 font-mono text-sm font-bold ${color}`}>{format(value)}</p>
        </div>
      ))}
    </div>
  );
}
