'use client';

import React from 'react';
import { isLiability, summarizeTaxAllocation, TAX_CATEGORY_LABELS } from '@/lib/household';
import { HouseholdWorkspace, TaxCategory } from '@/types/household';

interface TaxWaterfallProps {
  workspace: HouseholdWorkspace;
}

const categories: Array<{ id: Exclude<TaxCategory, 'nonInvestment'>; color: string; bar: string }> = [
  { id: 'taxable', color: 'text-cyan-300', bar: 'bg-cyan-400' },
  { id: 'taxDeferred', color: 'text-amber-300', bar: 'bg-amber-400' },
  { id: 'taxFree', color: 'text-emerald-300', bar: 'bg-emerald-400' },
];

export function TaxWaterfall({ workspace }: TaxWaterfallProps) {
  const accounts = workspace.accounts.filter(account => (
    account.includeInRetirementPlan && !isLiability(account) && account.taxCategory !== 'nonInvestment'
  ));
  const allocation = summarizeTaxAllocation(workspace);
  const total = allocation.totalClassifiedInvestments;
  const format = (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: workspace.profile.currency, maximumFractionDigits: 0,
  }).format(amount);

  return (
    <section className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl">
      <div className="border-b border-slate-800 pb-4">
        <p className="text-xs font-mono text-amber-400">ACCOUNT-SOURCED · NO ASSUMED RATIOS</p>
        <h2 className="mt-1 text-base font-bold text-slate-100">Investment tax allocation</h2>
        <p className="mt-1 text-xs text-slate-400">
          Balances are grouped only by the tax category entered for each account. No tax rate or Roth-conversion savings is inferred.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {categories.map(category => {
          const balance = allocation[category.id];
          const percentage = total > 0 ? balance / total : 0;
          return (
            <div key={category.id} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-xs font-bold text-slate-300">{TAX_CATEGORY_LABELS[category.id]}</p>
              <p className={`mt-2 font-mono text-xl font-black ${category.color}`}>{format(balance)}</p>
              <p className="mt-1 text-xs text-slate-500">{(percentage * 100).toFixed(1)}% of classified investments</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className={`h-full ${category.bar}`} style={{ width: `${percentage * 100}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full min-w-[560px] text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-500">
            <tr><th className="px-4 py-3">Account</th><th className="px-4 py-3">Tax category</th><th className="px-4 py-3 text-right">Entered balance</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {accounts.map(account => (
              <tr key={account.id} className="text-slate-300">
                <td className="px-4 py-3">{account.name}</td>
                <td className="px-4 py-3">{TAX_CATEGORY_LABELS[account.taxCategory]}</td>
                <td className="px-4 py-3 text-right font-mono">{format(account.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-100">
        Educational allocation view only. It does not calculate tax liability, conversion eligibility, or tax savings.
      </p>
    </section>
  );
}
