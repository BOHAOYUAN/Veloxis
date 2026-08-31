'use client';

import React, { useState } from 'react';
import { SimulationParams } from '@/types/financial';

interface EstateTopologyProps {
  params: SimulationParams;
}

export const EstateTopology: React.FC<EstateTopologyProps> = ({ params }) => {
  const [includeTrust, setIncludeTrust] = useState<boolean>(true);

  const totalEstate = params.initialCapital * 2.2; // Projected legacy estate value
  const probateCostWithoutTrust = totalEstate * 0.05; // 5% average probate/court attorney fee
  const probateTimeWithoutTrust = '12 ~ 24 个月 (法院公开审理)';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse"></span>
            高净值财富传承与家族信托拓扑 (Estate Planning & Trust Topology)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            可视化模拟生前可撤销信托 (Revocable Living Trust)、遗嘱认证法院绕行 (Probate Avoidance) 及税基重置机制
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIncludeTrust(!includeTrust)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              includeTrust
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-lg shadow-purple-500/20'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            {includeTrust ? '✅ 已配置家族信托 (Living Trust)' : '❌ 无信托 (法定继承/走法院认证)'}
          </button>
        </div>
      </div>

      {/* SVG Topology Interactive Flowchart */}
      <div className="relative w-full overflow-hidden bg-slate-950/90 rounded-xl p-6 border border-slate-800/80 min-h-[320px] flex items-center justify-center">
        <svg viewBox="0 0 800 280" className="w-full h-auto max-h-[340px]">
          <defs>
            <linearGradient id="trustFlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="probateFlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* NODE 1: Grantor / Client Estate */}
          <g transform="translate(40, 100)">
            <rect width="140" height="70" rx="10" fill="#0f172a" stroke="#a855f7" strokeWidth="2" filter="drop-shadow(0 0 10px rgba(168,85,247,0.25))" />
            <text x="70" y="24" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">委托人及配偶</text>
            <text x="70" y="40" fill="#94a3b8" fontSize="9" textAnchor="middle">(Grantor / Client)</text>
            <text x="70" y="58" fill="#c084fc" fontSize="13" fontWeight="900" fontFamily="monospace" textAnchor="middle">¥{(totalEstate/10000).toFixed(1)}万</text>
          </g>

          {/* FLOW CONNECTION: Node 1 -> Intermediate Routing */}
          {includeTrust ? (
            <>
              {/* Trust Pathway */}
              <path d="M 180 135 L 320 135" fill="none" stroke="url(#trustFlow)" strokeWidth="4" strokeDasharray="6,3" />
              <text x="250" y="125" fill="#a855f7" fontSize="9" textAnchor="middle" fontWeight="bold">自动无缝注入信托</text>

              {/* NODE 2: Revocable Living Trust */}
              <g transform="translate(320, 85)">
                <rect width="160" height="100" rx="12" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" filter="drop-shadow(0 0 14px rgba(6,182,212,0.25))" />
                <text x="80" y="26" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">生前可撤销信托</text>
                <text x="80" y="42" fill="#94a3b8" fontSize="9" textAnchor="middle">(Revocable Living Trust)</text>
                <text x="80" y="65" fill="#22d3ee" fontSize="11" fontWeight="bold" textAnchor="middle">⚡ 绕行法院认证 (0认证费)</text>
                <text x="80" y="82" fill="#34d399" fontSize="10" textAnchor="middle">100% 隐私保护 / 税基重置</text>
              </g>

              {/* FLOW CONNECTION: Node 2 -> Beneficiaries */}
              <path d="M 480 120 C 540 120, 540 65, 620 65" fill="none" stroke="url(#trustFlow)" strokeWidth="3" />
              <path d="M 480 150 C 540 150, 540 205, 620 205" fill="none" stroke="url(#trustFlow)" strokeWidth="3" />

              {/* NODE 3A: Direct Children Beneficiaries */}
              <g transform="translate(620, 35)">
                <rect width="140" height="60" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                <text x="12" y="22" fill="#e2e8f0" fontSize="10" fontWeight="bold">子女第一受益人</text>
                <text x="12" y="38" fill="#94a3b8" fontSize="9">即时无缝分配 (分批提取)</text>
                <text x="12" y="52" fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="monospace">Stepped-up Basis ✅</text>
              </g>

              {/* NODE 3B: Generation-Skipping / Dynasty */}
              <g transform="translate(620, 175)">
                <rect width="140" height="60" rx="8" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
                <text x="12" y="22" fill="#e2e8f0" fontSize="10" fontWeight="bold">孙辈信托 / 慈善捐赠</text>
                <text x="12" y="38" fill="#94a3b8" fontSize="9">GSTT 隔代防破产保护</text>
                <text x="12" y="52" fill="#60a5fa" fontSize="10" fontWeight="bold" fontFamily="monospace">资产隔离保护 ✅</text>
              </g>
            </>
          ) : (
            <>
              {/* Probate Pathway */}
              <path d="M 180 135 L 320 135" fill="none" stroke="url(#probateFlow)" strokeWidth="4" strokeDasharray="4,4" />
              <text x="250" y="125" fill="#ef4444" fontSize="9" textAnchor="middle" fontWeight="bold">触发遗嘱认证程序</text>

              {/* NODE 2: Probate Court */}
              <g transform="translate(320, 85)">
                <rect width="160" height="100" rx="12" fill="#1e111a" stroke="#ef4444" strokeWidth="2" filter="drop-shadow(0 0 14px rgba(239,68,68,0.25))" />
                <text x="80" y="26" fill="#fca5a5" fontSize="11" fontWeight="bold" textAnchor="middle">遗嘱认证法院</text>
                <text x="80" y="42" fill="#f87171" fontSize="9" textAnchor="middle">(Probate Court Process)</text>
                <text x="80" y="65" fill="#fca5a5" fontSize="11" fontWeight="bold" textAnchor="middle">🚨 耗时 12~24 个月</text>
                <text x="80" y="82" fill="#ef4444" fontSize="10" textAnchor="middle">公开资产隐私 / 诉讼风险</text>
              </g>

              {/* FLOW: Court -> Beneficiaries with fee deducted */}
              <path d="M 480 135 L 620 135" fill="none" stroke="url(#probateFlow)" strokeWidth="3" />

              <g transform="translate(620, 105)">
                <rect width="140" height="60" rx="8" fill="#0f172a" stroke="#f97316" strokeWidth="1.5" />
                <text x="12" y="22" fill="#e2e8f0" fontSize="10" fontWeight="bold">法定继承人</text>
                <text x="12" y="38" fill="#f87171" fontSize="9">扣除 ~5% 律师诉讼费</text>
                <text x="12" y="52" fill="#fb923c" fontSize="10" fontWeight="bold" fontFamily="monospace">-¥{(probateCostWithoutTrust/10000).toFixed(1)}万损耗</text>
              </g>
            </>
          )}
        </svg>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
          <span className="text-[11px] text-slate-400 block">法院认证耗时 (Probate Delay)</span>
          <span className="text-sm font-bold font-mono text-slate-100">
            {includeTrust ? '⚡ 0天 (即时继承)' : probateTimeWithoutTrust}
          </span>
        </div>
        <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
          <span className="text-[11px] text-slate-400 block">避免认证诉讼费损耗</span>
          <span className="text-sm font-bold font-mono text-emerald-400">
            {includeTrust ? `+¥${(probateCostWithoutTrust/10000).toFixed(1)}万` : '0 (全额缴纳)'}
          </span>
        </div>
        <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl">
          <span className="text-[11px] text-slate-400 block">税基重置优惠 (Step-up in Basis)</span>
          <span className="text-sm font-bold font-mono text-cyan-400">
            100% 资本利得税抹零
          </span>
        </div>
      </div>
    </div>
  );
};
