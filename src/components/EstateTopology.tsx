'use client';

import React, { useState } from 'react';
import { isLiability, summarizeEstate } from '@/lib/household';
import { HouseholdWorkspace } from '@/types/household';

interface EstateTopologyProps {
  workspace: HouseholdWorkspace;
}

export function EstateTopology({ workspace }: EstateTopologyProps) {
  const [showTrustRoute, setShowTrustRoute] = useState(true);
  const estate = summarizeEstate(workspace);
  const format = (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: workspace.profile.currency, maximumFractionDigits: 0,
  }).format(amount);

  return (
    <section className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-mono text-purple-400">EDUCATIONAL OWNERSHIP MAP</p>
          <h2 className="mt-1 text-base font-bold text-slate-100">Estate transfer topology</h2>
          <p className="mt-1 text-xs text-slate-400">Uses entered balances only; no growth, probate cost, tax, or legal outcome is assumed.</p>
        </div>
        <button onClick={() => setShowTrustRoute(value => !value)} className="rounded-xl border border-purple-500/40 bg-purple-500/10 px-3 py-2 text-xs font-bold text-purple-200">
          View {showTrustRoute ? 'will / probate route' : 'illustrative trust route'}
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Entered assets" value={format(estate.enteredAssets)} />
        <Metric label="Entered liabilities" value={format(estate.enteredLiabilities)} />
        <Metric label="Indicative net estate" value={format(estate.indicativeNetEstate)} accent />
      </div>

      <div className="grid items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-5 text-center md:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <Node title="Household assets" description={`${workspace.accounts.filter(account => !isLiability(account)).length} entered asset accounts`} />
        <Arrow />
        {showTrustRoute ? (
          <Node title="Illustrative trust route" description="Ownership and beneficiary details are not modeled" highlight />
        ) : (
          <Node title="Will / probate route" description="Timing and cost depend on jurisdiction and facts" />
        )}
        <Arrow />
        <Node title="Beneficiaries" description="No distribution, basis, or estate-tax result calculated" />
      </div>

      <p className="rounded-xl border border-purple-500/20 bg-purple-500/5 px-4 py-3 text-xs leading-relaxed text-purple-100">
        This view is an educational conversation aid, not legal or tax advice. Actual ownership, beneficiary designations, jurisdiction, debts, expenses, and governing documents can materially change an estate outcome.
      </p>
    </section>
  );
}

function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"><p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p><p className={`mt-1 font-mono text-lg font-bold ${accent ? 'text-purple-300' : 'text-slate-100'}`}>{value}</p></div>;
}

function Node({ title, description, highlight = false }: { title: string; description: string; highlight?: boolean }) {
  return <div className={`rounded-xl border p-4 ${highlight ? 'border-purple-500/50 bg-purple-500/10' : 'border-slate-700 bg-slate-900'}`}><p className="text-sm font-bold text-slate-100">{title}</p><p className="mt-1 text-xs text-slate-400">{description}</p></div>;
}

function Arrow() {
  return <span className="text-xl text-purple-400">→</span>;
}
