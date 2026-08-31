'use client';

import React, { useState } from 'react';
import { useMonteCarlo } from '@/hooks/useMonteCarlo';
import { MonteCarloChart } from '@/components/MonteCarloChart';
import { FinancialSliders } from '@/components/FinancialSliders';
import { StressMatrix } from '@/components/StressMatrix';
import { AIPlanSummary } from '@/components/AIPlanSummary';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'SIMULATOR' | 'STRESS_TEST'>('SIMULATOR');
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
        
        {/* Top Navigation Bar */}
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
                    v2.0 TypeScript RIA Engine
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  下一代客户端万次蒙特卡洛量化规划与 AI 多引擎意图解析平台
                </p>
              </div>
            </div>
          </div>

          {/* KPI Mini Pills */}
          <div className="flex gap-2.5">
            <div className="bg-slate-950/80 border border-slate-800 px-3.5 py-1.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block font-medium">85岁生存概率</span>
              <span className="text-sm font-bold font-mono text-emerald-400">{(m.survivalRate85 * 100).toFixed(1)}%</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 px-3.5 py-1.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block font-medium">退休中位净资产</span>
              <span className="text-sm font-bold font-mono text-amber-400">¥{(m.medianRetirementAsset / 10000).toFixed(1)}万</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-800 px-3.5 py-1.5 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 block font-medium">运算耗时 (10k)</span>
              <span className="text-sm font-bold font-mono text-cyan-400">{simulationResult.executionTimeMs.toFixed(1)}ms</span>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex gap-3 border-b border-slate-800/80 pb-2">
          <button
            onClick={() => setActiveTab('SIMULATOR')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'SIMULATOR'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            📈 仿真推演大盘 (Simulation Horizon)
          </button>
          <button
            onClick={() => setActiveTab('STRESS_TEST')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'STRESS_TEST'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            🔥 宏观压力测试与敏感性热力图 (Stress Testing)
          </button>
        </div>

        {/* Main Content Area */}
        {activeTab === 'SIMULATOR' ? (
          <div className="space-y-6">
            <MonteCarloChart data={simulationResult} />
            <FinancialSliders params={params} updateParam={updateParam} />
            <AIPlanSummary data={simulationResult} />
          </div>
        ) : (
          <StressMatrix
            matrix={sensitivityMatrix}
            stressScenarios={stressScenarios}
            activeScenarioId={activeScenarioId}
            onApplyScenario={applyStressScenario}
          />
        )}

        {/* Footer info */}
        <footer className="text-center text-xs text-slate-400 pt-6 pb-4 border-t border-slate-900">
          Veloxis Wealth OS · Benchmarked for Modern RIA Architectures · 100% Client-Side Pure TypeScript Computation
        </footer>

      </div>
    </main>
  );
}