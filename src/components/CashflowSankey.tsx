'use client';

import React, { useState } from 'react';
import { SimulationParams } from '@/types/financial';

interface CashflowSankeyProps {
  params: SimulationParams;
}

export const CashflowSankey: React.FC<CashflowSankeyProps> = ({ params }) => {
  const [selectedAge, setSelectedAge] = useState<number>(params.currentAge);
  
  const isRetired = selectedAge >= params.retirementAge;
  
  // Calculate dynamic inflows based on age and params
  const annualIncome = isRetired ? 0 : (params.annualSavings / 0.35); // Estimated salary assuming 35% savings rate
  const socialSecurity = selectedAge >= 67 ? 180000 : selectedAge >= 62 ? 120000 : 0;
  const portfolioDrawdown = isRetired ? Math.max(0, params.retirementAnnualExpense - socialSecurity) : 0;
  const totalInflow = annualIncome + socialSecurity + portfolioDrawdown;

  // Calculate dynamic outflows
  const livingExpenses = isRetired 
    ? Math.min(params.retirementAnnualExpense, totalInflow * 0.70)
    : (annualIncome * 0.45);
  const estimatedTax = isRetired 
    ? (portfolioDrawdown * 0.12 + socialSecurity * 0.08)
    : (annualIncome * 0.20);
  const discretionary = isRetired ? (totalInflow * 0.15) : (annualIncome * 0.10);
  const annualSavings = isRetired ? 0 : Math.max(0, totalInflow - livingExpenses - estimatedTax - discretionary);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            终身动态现金流拓扑与流向桑基图 (Living Cashflow Sankey)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            动态模拟从工薪积累期至退休取用期，资金从多源流入到多账户归集与支出的完整能量流向
          </p>
        </div>

        {/* Age Selector Slider */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">推演年龄:</span>
          <input
            type="range"
            min={params.currentAge}
            max={85}
            value={selectedAge}
            onChange={(e) => setSelectedAge(Number(e.target.value))}
            className="w-28 accent-cyan-400 cursor-pointer"
          />
          <span className="text-sm font-bold font-mono text-cyan-400 w-12 text-right">
            {selectedAge} 岁
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
            isRetired ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
          }`}>
            {isRetired ? '退休期' : '积累期'}
          </span>
        </div>
      </div>

      {/* Interactive SVG Sankey Diagram */}
      <div className="relative w-full overflow-hidden bg-slate-950/90 rounded-xl p-6 border border-slate-800/80 min-h-[360px] flex items-center justify-center">
        <svg viewBox="0 0 800 320" className="w-full h-auto max-h-[380px]">
          <defs>
            <linearGradient id="flowInflow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="flowOutflow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="flowSavings" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* LEFT NODES: Inflow Sources */}
          {!isRetired && (
            <g transform="translate(40, 40)">
              <rect width="130" height="48" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
              <text x="12" y="20" fill="#94a3b8" fontSize="10">主营主动收入 (Salary)</text>
              <text x="12" y="38" fill="#10b981" fontSize="13" fontWeight="bold" fontFamily="monospace">¥{(annualIncome/10000).toFixed(1)}万/年</text>
            </g>
          )}

          {socialSecurity > 0 && (
            <g transform={`translate(40, ${isRetired ? 60 : 130})`}>
              <rect width="130" height="48" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
              <text x="12" y="20" fill="#94a3b8" fontSize="10">国家社保 / 养老金 (SS)</text>
              <text x="12" y="38" fill="#10b981" fontSize="13" fontWeight="bold" fontFamily="monospace">¥{(socialSecurity/10000).toFixed(1)}万/年</text>
            </g>
          )}

          {isRetired && (
            <g transform="translate(40, 160)">
              <rect width="130" height="48" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="12" y="20" fill="#94a3b8" fontSize="10">投资组合提取 (Portfolio)</text>
              <text x="12" y="38" fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="monospace">¥{(portfolioDrawdown/10000).toFixed(1)}万/年</text>
            </g>
          )}

          {/* CENTER HUB: Total Cashflow Pool */}
          <g transform="translate(340, 95)">
            <rect width="120" height="110" rx="12" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" filter="drop-shadow(0 0 12px rgba(6,182,212,0.25))" />
            <text x="60" y="32" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">年度现金总池</text>
            <text x="60" y="52" fill="#94a3b8" fontSize="9" textAnchor="middle">(Total Inflow Pool)</text>
            <text x="60" y="84" fill="#22d3ee" fontSize="16" fontWeight="900" fontFamily="monospace" textAnchor="middle">¥{(totalInflow/10000).toFixed(1)}万</text>
          </g>

          {/* CURVED BEZIER CONNECTIONS LEFT -> CENTER */}
          <path d={`M 170 64 C 250 64, 250 125, 340 125`} fill="none" stroke="url(#flowInflow)" strokeWidth="6" strokeLinecap="round" />
          {socialSecurity > 0 && (
            <path d={`M 170 ${isRetired ? 84 : 154} C 250 ${isRetired ? 84 : 154}, 250 150, 340 150`} fill="none" stroke="url(#flowInflow)" strokeWidth="5" strokeLinecap="round" />
          )}
          {isRetired && (
            <path d="M 170 184 C 250 184, 250 175, 340 175" fill="none" stroke="url(#flowInflow)" strokeWidth="7" strokeLinecap="round" />
          )}

          {/* RIGHT NODES: Outflow Destinations */}
          <g transform="translate(630, 25)">
            <rect width="130" height="44" rx="8" fill="#0f172a" stroke="#f43f5e" strokeWidth="1.5" />
            <text x="12" y="18" fill="#94a3b8" fontSize="10">刚性生活支出 (Living)</text>
            <text x="12" y="34" fill="#fb7185" fontSize="12" fontWeight="bold" fontFamily="monospace">¥{(livingExpenses/10000).toFixed(1)}万/年</text>
          </g>

          <g transform="translate(630, 95)">
            <rect width="130" height="44" rx="8" fill="#0f172a" stroke="#fb923c" strokeWidth="1.5" />
            <text x="12" y="18" fill="#94a3b8" fontSize="10">综合预估税收 (Taxes)</text>
            <text x="12" y="34" fill="#fb923c" fontSize="12" fontWeight="bold" fontFamily="monospace">¥{(estimatedTax/10000).toFixed(1)}万/年</text>
          </g>

          <g transform="translate(630, 165)">
            <rect width="130" height="44" rx="8" fill="#0f172a" stroke="#a855f7" strokeWidth="1.5" />
            <text x="12" y="18" fill="#94a3b8" fontSize="10">品质医疗/娱乐 (Health)</text>
            <text x="12" y="34" fill="#c084fc" fontSize="12" fontWeight="bold" fontFamily="monospace">¥{(discretionary/10000).toFixed(1)}万/年</text>
          </g>

          {!isRetired && (
            <g transform="translate(630, 235)">
              <rect width="130" height="44" rx="8" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
              <text x="12" y="18" fill="#94a3b8" fontSize="10">净储蓄与再投资 (Invest)</text>
              <text x="12" y="34" fill="#60a5fa" fontSize="12" fontWeight="bold" fontFamily="monospace">¥{(annualSavings/10000).toFixed(1)}万/年</text>
            </g>
          )}

          {/* CURVED BEZIER CONNECTIONS CENTER -> RIGHT */}
          <path d="M 460 120 C 530 120, 530 47, 630 47" fill="none" stroke="url(#flowOutflow)" strokeWidth="6" strokeLinecap="round" />
          <path d="M 460 145 C 530 145, 530 117, 630 117" fill="none" stroke="url(#flowOutflow)" strokeWidth="4" strokeLinecap="round" />
          <path d="M 460 165 C 530 165, 530 187, 630 187" fill="none" stroke="url(#flowOutflow)" strokeWidth="3" strokeLinecap="round" />
          {!isRetired && (
            <path d="M 460 185 C 530 185, 530 257, 630 257" fill="none" stroke="url(#flowSavings)" strokeWidth="5" strokeLinecap="round" />
          )}
        </svg>
      </div>

      {/* Summary KPI Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
          <span className="text-[11px] text-slate-400 block">净储蓄率 (Savings Rate)</span>
          <span className="text-base font-bold font-mono text-emerald-400">
            {totalInflow > 0 ? ((annualSavings / totalInflow) * 100).toFixed(1) : '0.0'}%
          </span>
        </div>
        <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
          <span className="text-[11px] text-slate-400 block">综合有效税负 (Effective Tax)</span>
          <span className="text-base font-bold font-mono text-amber-400">
            {totalInflow > 0 ? ((estimatedTax / totalInflow) * 100).toFixed(1) : '0.0'}%
          </span>
        </div>
        <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
          <span className="text-[11px] text-slate-400 block">提款安全边际 (Safe Harbor Buffer)</span>
          <span className="text-base font-bold font-mono text-cyan-400">
            {isRetired ? `${(params.initialCapital / Math.max(1, params.retirementAnnualExpense)).toFixed(1)} 年覆盖` : '积累增长中'}
          </span>
        </div>
      </div>
    </div>
  );
};
