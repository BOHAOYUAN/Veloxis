'use client';

import React, { useState } from 'react';
import { useMonteCarlo } from '@/hooks/useMonteCarlo';
import { MonteCarloChart } from '@/components/MonteCarloChart';
import { FinancialSliders } from '@/components/FinancialSliders';
import { StressMatrix } from '@/components/StressMatrix';
import { AIPlanSummary } from '@/components/AIPlanSummary';
import { CashflowSankey } from '@/components/CashflowSankey';
import { TaxWaterfall } from '@/components/TaxWaterfall';
import { EstateTopology } from '@/components/EstateTopology';

type ActiveTabType = 'MONTE_CARLO' | 'CASHFLOW' | 'TAX_WATERFALL' | 'ESTATE' | 'STRESS_TEST';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('MONTE_CARLO');
  const {
    params,
    updateParam,
    simulationResult,
    sensitivityMatrix,
    activeScenarioId,
    applyStressScenario,
    stressScenarios,
  } = useMonteCarlo();

  const m = simulationResult.metrics;

  return (
    <main className="min-h-screen bg-[#070a12] text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Bar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl backdrop-blur-xl shadow-2xl">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-cyan-500/30">
                V
              </div>
              <div>
                <h1 className="text-lg font-black tracking-wider text-slate-100 flex items-center gap-2">
                  VELOXIS WEALTH OS
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded-full font-mono">
                    v2.0 Next.js 15 + React 19 + TypeScript
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  机构级 RIA 财富规划与蒙特卡洛量化沙盘平台 (10,000 Path Native Client-Side Engine)
                </p>
              </div>
            </div>
          </div>

          {/* KPI Mini Status Pills */}
          <div className="flex flex-wrap gap-2.5">
            <div className="bg-slate-950/80 border border-slate-800 px-3.5 py-1.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block font-medium">85岁生存概率</span>
              <span className="text-sm font-bold font-mono text-emerald-400">{(m.survivalRate85 * 100).toFixed(1)}%</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 px-3.5 py-1.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block font-medium">退休中位资产</span>
              <span className="text-sm font-bold font-mono text-amber-400">¥{(m.medianRetirementAsset / 10000).toFixed(1)}万</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 px-3.5 py-1.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block font-medium">10,000次耗时</span>
              <span className="text-sm font-bold font-mono text-cyan-400">{simulationResult.executionTimeMs.toFixed(1)}ms</span>
            </div>
          </div>
        </header>

        {/* 5-Tab Navigation Bar */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800/80 pb-3">
          <button
            onClick={() => setActiveTab('MONTE_CARLO')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'MONTE_CARLO'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            📈 蒙特卡洛扇形推演 (Monte Carlo Fan)
          </button>
          <button
            onClick={() => setActiveTab('CASHFLOW')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'CASHFLOW'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            🌊 终身现金流桑基图 (Cashflow Sankey)
          </button>
          <button
            onClick={() => setActiveTab('TAX_WATERFALL')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'TAX_WATERFALL'
                ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/25 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            💧 资产三桶税收瀑布流 (% 3-Bucket Tax Waterfall)
          </button>
          <button
            onClick={() => setActiveTab('ESTATE')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'ESTATE'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            🏛️ 财富传承与信托拓扑 (Estate Topology)
          </button>
          <button
            onClick={() => setActiveTab('STRESS_TEST')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'STRESS_TEST'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25 font-black'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
            }`}
          >
            🔥 宏观压力测试矩阵 (Stress Matrix)
          </button>
        </div>

        {/* Tab Content Display Area */}
        {activeTab === 'MONTE_CARLO' && (
          <div className="space-y-6">
            <MonteCarloChart data={simulationResult} />
            <FinancialSliders params={params} updateParam={updateParam} />
            <AIPlanSummary data={simulationResult} />
          </div>
        )}

        {activeTab === 'CASHFLOW' && (
          <div className="space-y-6">
            <CashflowSankey params={params} />
            <FinancialSliders params={params} updateParam={updateParam} />
          </div>
        )}

        {activeTab === 'TAX_WATERFALL' && (
          <div className="space-y-6">
            <TaxWaterfall params={params} />
            <FinancialSliders params={params} updateParam={updateParam} />
          </div>
        )}

        {activeTab === 'ESTATE' && (
          <div className="space-y-6">
            <EstateTopology params={params} />
            <FinancialSliders params={params} updateParam={updateParam} />
          </div>
        )}

        {activeTab === 'STRESS_TEST' && (
          <StressMatrix
            matrix={sensitivityMatrix}
            stressScenarios={stressScenarios}
            activeScenarioId={activeScenarioId}
            onApplyScenario={applyStressScenario}
          />
        )}

        {/* Professional Footer */}
        <footer className="text-center text-xs text-slate-400 pt-6 pb-4 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Veloxis Wealth OS · Benchmarked for RightCapital / eMoney Architectural Standards</span>
          <span className="font-mono text-cyan-500/80">100% Client-Side Pure TypeScript & React 19</span>
        </footer>

      </div>
    </main>
  );
}