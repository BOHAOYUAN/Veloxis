'use client';

import React, { useMemo, useState } from 'react';
import { ACCOUNT_LABELS, ACCOUNT_TYPES, summarizeHousehold } from '@/lib/household';
import { AnnualCashFlow, FinancialAccount, FinancialGoal, HouseholdWorkspace as Workspace } from '@/types/household';

interface HouseholdWorkspaceProps {
  workspace: Workspace;
  hydrated: boolean;
  onChange: (updater: (current: Workspace) => Workspace) => void;
  onResetDemo: () => void;
  onApplyToPlan: () => void;
}

const money = (amount: number, currency: string) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency, maximumFractionDigits: 0,
}).format(amount);

function nextId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function HouseholdWorkspace({ workspace, hydrated, onChange, onResetDemo, onApplyToPlan }: HouseholdWorkspaceProps) {
  const summary = useMemo(() => summarizeHousehold(workspace), [workspace]);
  const [notice, setNotice] = useState('');
  const updateProfile = (key: keyof Workspace['profile'], value: string | number) => {
    onChange(current => ({ ...current, profile: { ...current.profile, [key]: value } }));
  };
  const updateAccount = (id: string, patch: Partial<FinancialAccount>) => {
    onChange(current => ({ ...current, accounts: current.accounts.map(item => item.id === id ? { ...item, ...patch } : item) }));
  };
  const updateCashFlow = (id: string, patch: Partial<AnnualCashFlow>) => {
    onChange(current => ({ ...current, cashFlows: current.cashFlows.map(item => item.id === id ? { ...item, ...patch } : item) }));
  };
  const updateGoal = (id: string, patch: Partial<FinancialGoal>) => {
    onChange(current => ({ ...current, goals: current.goals.map(item => item.id === id ? { ...item, ...patch } : item) }));
  };
  const remove = (collection: 'accounts' | 'cashFlows' | 'goals', id: string) => {
    onChange(current => ({ ...current, [collection]: current[collection].filter(item => item.id !== id) }));
  };
  const apply = () => {
    onApplyToPlan();
    setNotice('Baseline plan synced from this household inventory.');
  };

  return (
    <section className="space-y-6">
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-mono text-cyan-400">PERSONAL · LOCAL-FIRST · V1</p>
            <h2 className="mt-1 text-xl font-black text-slate-100">Household planning workspace</h2>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">Your information stays in this browser. Values are planning inputs and simulated outputs, not investment, tax, legal, or financial advice.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={apply} className="rounded-xl bg-cyan-400 px-4 py-2 text-xs font-black text-slate-950 hover:bg-cyan-300">Sync baseline plan</button>
            <button onClick={onResetDemo} className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-slate-800">Restore sample data</button>
          </div>
        </div>
        {notice && <p className="mt-3 text-xs text-emerald-400">{notice}</p>}
        {!hydrated && <p className="mt-3 text-xs text-amber-300">Loading browser-local data…</p>}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ['Net worth', summary.netWorth], ['Investable assets', summary.investableAssets],
          ['Annual income', summary.annualIncome], ['Annual expenses', summary.annualExpenses], ['Annual surplus', summary.annualSurplus],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
            <p className={`mt-1 font-mono text-lg font-bold ${Number(value) < 0 ? 'text-rose-400' : 'text-slate-100'}`}>{money(Number(value), workspace.profile.currency)}</p>
          </div>
        ))}
      </div>

      <Panel title="Household profile" subtitle="US and USD are defaults; both are data fields, not hard-coded rules.">
        <div className="grid gap-3 md:grid-cols-3">
          <Field label="Household name"><input value={workspace.profile.householdName} onChange={e => updateProfile('householdName', e.target.value)} /></Field>
          <Field label="Planning jurisdiction"><input value={workspace.profile.jurisdiction} onChange={e => updateProfile('jurisdiction', e.target.value.toUpperCase())} /></Field>
          <Field label="Currency"><input value={workspace.profile.currency} maxLength={3} onChange={e => updateProfile('currency', e.target.value.toUpperCase())} /></Field>
          <Field label="Current age"><input type="number" value={workspace.profile.currentAge} onChange={e => updateProfile('currentAge', Number(e.target.value))} /></Field>
          <Field label="Retirement age"><input type="number" value={workspace.profile.retirementAge} onChange={e => updateProfile('retirementAge', Number(e.target.value))} /></Field>
          <Field label="Longevity age"><input type="number" value={workspace.profile.longevityAge} onChange={e => updateProfile('longevityAge', Number(e.target.value))} /></Field>
        </div>
      </Panel>

      <Panel title="Accounts and liabilities" subtitle="Only accounts marked “include” become the opening capital for retirement simulation.">
        <div className="space-y-2">
          {workspace.accounts.map(account => <div key={account.id} className="grid gap-2 rounded-xl bg-slate-950/60 p-3 md:grid-cols-[1.4fr_1.1fr_1fr_auto_auto] md:items-center">
            <input value={account.name} aria-label="Account name" onChange={e => updateAccount(account.id, { name: e.target.value })} />
            <select value={account.type} aria-label="Account type" onChange={e => updateAccount(account.id, { type: e.target.value as FinancialAccount['type'] })}>{ACCOUNT_TYPES.map(type => <option key={type} value={type}>{ACCOUNT_LABELS[type]}</option>)}</select>
            <input type="number" min="0" value={account.balance} aria-label="Account balance" onChange={e => updateAccount(account.id, { balance: Number(e.target.value) })} />
            <label className="flex items-center gap-2 whitespace-nowrap text-xs text-slate-400"><input type="checkbox" checked={account.includeInRetirementPlan} onChange={e => updateAccount(account.id, { includeInRetirementPlan: e.target.checked })} />Include</label>
            <button onClick={() => remove('accounts', account.id)} className="text-xs text-rose-400 hover:text-rose-300">Remove</button>
          </div>)}
        </div>
        <button onClick={() => onChange(current => ({ ...current, accounts: [...current.accounts, { id: nextId('account'), name: 'New account', type: 'BROKERAGE', balance: 0, includeInRetirementPlan: true }] }))} className="mt-3 text-xs font-bold text-cyan-400 hover:text-cyan-300">+ Add account</button>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Annual income and expenses" subtitle="Use annual, pre-tax planning amounts for this first version.">
          <div className="space-y-2">{workspace.cashFlows.map(item => <div key={item.id} className="grid gap-2 rounded-xl bg-slate-950/60 p-3 md:grid-cols-[1.5fr_1fr_1fr_auto] md:items-center">
            <input value={item.name} aria-label="Cash flow name" onChange={e => updateCashFlow(item.id, { name: e.target.value })} />
            <select value={item.type} aria-label="Cash flow type" onChange={e => updateCashFlow(item.id, { type: e.target.value as AnnualCashFlow['type'] })}><option value="INCOME">Income</option><option value="EXPENSE">Expense</option></select>
            <input type="number" min="0" value={item.annualAmount} aria-label="Annual amount" onChange={e => updateCashFlow(item.id, { annualAmount: Number(e.target.value) })} />
            <button onClick={() => remove('cashFlows', item.id)} className="text-xs text-rose-400 hover:text-rose-300">Remove</button>
          </div>)}</div>
          <button onClick={() => onChange(current => ({ ...current, cashFlows: [...current.cashFlows, { id: nextId('cashflow'), name: 'New expense', type: 'EXPENSE', annualAmount: 0 }] }))} className="mt-3 text-xs font-bold text-cyan-400 hover:text-cyan-300">+ Add income or expense</button>
        </Panel>

        <Panel title="Financial goals" subtitle={`Total target: ${money(summary.goalTargetTotal, workspace.profile.currency)}`}>
          <div className="space-y-2">{workspace.goals.map(goal => <div key={goal.id} className="grid gap-2 rounded-xl bg-slate-950/60 p-3 md:grid-cols-[1.5fr_1fr_1fr_auto] md:items-center">
            <input value={goal.name} aria-label="Goal name" onChange={e => updateGoal(goal.id, { name: e.target.value })} />
            <input type="number" min="1" value={goal.targetAmount} aria-label="Goal amount" onChange={e => updateGoal(goal.id, { targetAmount: Number(e.target.value) })} />
            <input type="number" min="2025" value={goal.targetYear} aria-label="Goal year" onChange={e => updateGoal(goal.id, { targetYear: Number(e.target.value) })} />
            <button onClick={() => remove('goals', goal.id)} className="text-xs text-rose-400 hover:text-rose-300">Remove</button>
          </div>)}</div>
          <button onClick={() => onChange(current => ({ ...current, goals: [...current.goals, { id: nextId('goal'), name: 'New goal', targetAmount: 100000, targetYear: new Date().getFullYear() + 5 }] }))} className="mt-3 text-xs font-bold text-cyan-400 hover:text-cyan-300">+ Add goal</button>
        </Panel>
      </div>
    </section>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl"><h3 className="font-bold text-slate-100">{title}</h3><p className="mt-1 text-xs text-slate-500">{subtitle}</p><div className="mt-4">{children}</div></section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-xs text-slate-400"><span className="mb-1 block">{label}</span>{children}</label>;
}
