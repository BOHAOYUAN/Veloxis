'use client';

import React from 'react';
import { SimulationParams } from '@/types/financial';

interface FinancialSlidersProps {
  params: SimulationParams;
  updateParam: <K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => void;
  onResetPreset?: (type: string) => void;
}

export const FinancialSliders: React.FC<FinancialSlidersProps> = ({ params, updateParam }) => {
  return (
    <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 backdrop-blur-md shadow-xl space-y-5">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <span className="text-cyan-400">⚙️</span> 财务推演核心参数沙盘
        </h3>
        <span className="text-xs text-slate-400 font-mono">10,000 Paths Real-Time</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 当前年龄 / 退休年龄 */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400">当前年龄 → 规划退休年龄</span>
            <span className="font-bold text-cyan-400 font-mono">{params.currentAge} 岁 → {params.retirementAge} 岁</span>
          </div>
          <div className="flex gap-3">
            <input
              type="range"
              min={18}
              max={65}
              value={params.currentAge}
              onChange={e => updateParam('currentAge', parseInt(e.target.value))}
              className="w-1/2 accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <input
              type="range"
              min={Math.max(params.currentAge + 1, 40)}
              max={80}
              value={params.retirementAge}
              onChange={e => updateParam('retirementAge', parseInt(e.target.value))}
              className="w-1/2 accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* 初始生息资产 */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400">初始总资产 (生息本金)</span>
            <span className="font-bold text-amber-400 font-mono">¥{(params.initialCapital / 10000).toFixed(0)} 万</span>
          </div>
          <input
            type="range"
            min={0}
            max={10000000}
            step={50000}
            value={params.initialCapital}
            onChange={e => updateParam('initialCapital', parseInt(e.target.value))}
            className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* 年储蓄额 */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400">退休前每年净储蓄结余</span>
            <span className="font-bold text-emerald-400 font-mono">¥{(params.annualSavings / 10000).toFixed(0)} 万/年</span>
          </div>
          <input
            type="range"
            min={0}
            max={2000000}
            step={10000}
            value={params.annualSavings}
            onChange={e => updateParam('annualSavings', parseInt(e.target.value))}
            className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* 退休后年支出 */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400">退休后每年目标生活开销</span>
            <span className="font-bold text-rose-400 font-mono">¥{(params.retirementAnnualExpense / 10000).toFixed(0)} 万/年</span>
          </div>
          <input
            type="range"
            min={50000}
            max={1500000}
            step={10000}
            value={params.retirementAnnualExpense}
            onChange={e => updateParam('retirementAnnualExpense', parseInt(e.target.value))}
            className="w-full accent-rose-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* 预期年化回报率 */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400">组合名义预期年化回报 (μ)</span>
            <span className="font-bold text-purple-400 font-mono">{(params.expectedReturn * 100).toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min={0.02}
            max={0.18}
            step={0.005}
            value={params.expectedReturn}
            onChange={e => updateParam('expectedReturn', parseFloat(e.target.value))}
            className="w-full accent-purple-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        {/* 组合波动率 (σ) */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400">年化年收益波动率 (σ)</span>
            <span className="font-bold text-slate-300 font-mono">{(params.volatility * 100).toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min={0.05}
            max={0.35}
            step={0.01}
            value={params.volatility}
            onChange={e => updateParam('volatility', parseFloat(e.target.value))}
            className="w-full accent-slate-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};