'use client';

import React from 'react';
import { SensitivityMatrix, StressScenario } from '@/types/financial';

interface StressMatrixProps {
  matrix: SensitivityMatrix;
  stressScenarios: Record<string, StressScenario>;
  activeScenarioId: string | null;
  onApplyScenario: (scenario: StressScenario | null) => void;
}

export const StressMatrix: React.FC<StressMatrixProps> = ({
  matrix,
  stressScenarios,
  activeScenarioId,
  onApplyScenario,
}) => {
  return (
    <div className="space-y-6">
      {/* 4 大宏观压力情景快捷施加 */}
      <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 backdrop-blur-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <span>⚡</span> 宏观黑天鹅极端压力测试情景
          </h3>
          {activeScenarioId && (
            <button
              onClick={() => onApplyScenario(null)}
              className="text-xs text-rose-400 hover:text-rose-300 bg-rose-950/40 px-2.5 py-1 rounded-lg border border-rose-900/60"
            >
              清除压力情景 (恢复基准)
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.values(stressScenarios).map(sc => {
            const isActive = activeScenarioId === sc.id;
            return (
              <div
                key={sc.id}
                onClick={() => onApplyScenario(isActive ? null : sc)}
                className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                  isActive
                    ? 'bg-slate-800 border-cyan-400 shadow-lg shadow-cyan-950/50 scale-[1.02]'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{sc.icon}</span>
                    <span className="font-semibold text-xs text-slate-200">{sc.name}</span>
                  </div>
                  {isActive && <span className="text-[10px] bg-cyan-500/20 text-cyan-400 font-bold px-2 py-0.5 rounded">生效中</span>}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{sc.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4x4 收益率 vs 通胀率 敏感性矩阵 */}
      <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 backdrop-blur-md shadow-xl">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <span>🎯</span> 收益率 × 通胀率 破产风险敏感性热力矩阵
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">测试不同宏观经济周期下 85 岁破产概率的分布敏感度</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="py-2.5 px-3 text-left">名义收益 \ 通胀</th>
                {matrix.inflationHeaderLabels.map(label => (
                  <th key={label} className="py-2.5 px-3">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {matrix.matrix.map(row => (
                <tr key={row.returnRate}>
                  <td className="py-2.5 px-3 font-bold text-slate-300 text-left font-sans">{row.returnPercentText}</td>
                  {row.items.map(cell => {
                    const ruin = cell.ruinProb;
                    const isSafe = ruin <= 0.15;
                    const isWarn = ruin > 0.15 && ruin < 0.40;
                    const isDanger = ruin >= 0.40;

                    return (
                      <td key={cell.inflationRate} className="py-2.5 px-3">
                        <div
                          className={`rounded-lg py-1.5 font-bold transition-all ${
                            isSafe
                              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                              : isWarn
                              ? 'bg-amber-950/40 text-amber-400 border border-amber-800/40'
                              : 'bg-rose-950/40 text-rose-400 border border-rose-800/40'
                          }`}
                        >
                          {cell.ruinPercentText}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-5 mt-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-emerald-400"></span>安全 (&lt;15%)</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-amber-400"></span>预警 (15%-40%)</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-rose-400"></span>高危 (&ge;40%)</span>
        </div>
      </div>
    </div>
  );
};