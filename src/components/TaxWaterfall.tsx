'use client';

import React, { useState } from 'react';
import { SimulationParams } from '@/types/financial';

interface TaxWaterfallProps {
  params: SimulationParams;
}

export const TaxWaterfall: React.FC<TaxWaterfallProps> = ({ params }) => {
  const [rothConversionAnnual, setRothConversionAnnual] = useState<number>(50000);
  const [conversionYears, setConversionYears] = useState<number>(7);

  // Asset 3-Bucket Distribution based on liquid assets
  const taxableRatio = 0.35;
  const taxDeferredRatio = 0.45;
  const taxFreeRatio = 0.20;

  const totalAssets = params.initialCapital;
  const taxableAsset = totalAssets * taxableRatio;
  const taxDeferredAsset = totalAssets * taxDeferredRatio;
  const taxFreeAsset = totalAssets * taxFreeRatio;

  // Calculate Roth Conversion Optimization Impact
  const totalConverted = Math.min(taxDeferredAsset, rothConversionAnnual * conversionYears);
  const currentBracketRate = 0.12; // Lower tax bracket in early retirement gap years
  const futureRmdBracketRate = 0.28; // Heavy tax bracket when RMDs kick in at age 73
  const upfrontTaxPaid = totalConverted * currentBracketRate;
  const futureTaxAvoided = totalConverted * futureRmdBracketRate;
  const lifetimeTaxSavings = Math.max(0, futureTaxAvoided - upfrontTaxPaid);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            资产三桶税收瀑布流与 Roth 转换税筹引擎 (Tax Waterfall & Roth Arbitrage)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            对标美区 RIA 税收筹划标准，管理应税、递延税与免税三桶资金分配，并在低税率窗口期进行 Roth Conversion 套利
          </p>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
          <span className="text-[11px] text-amber-300 font-bold">
            🛡️ 预估终身税收节约: ¥{(lifetimeTaxSavings/10000).toFixed(1)}万
          </span>
        </div>
      </div>

      {/* 3-Bucket Visual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bucket 1: Taxable */}
        <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4.5 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-blue-400">1. 应税资产桶 (Taxable)</span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">35% 权重</span>
          </div>
          <div className="text-xl font-black font-mono text-slate-100">
            ¥{(taxableAsset/10000).toFixed(1)}万
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            普通证券账户、活期存款。每年产生分红与资本利得税，流动性最强，无提取年龄限制。
          </p>
          <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 flex justify-between">
            <span>税收特征:</span>
            <span className="text-blue-300 font-medium">资本利得税 (Cap Gains)</span>
          </div>
        </div>

        {/* Bucket 2: Tax-Deferred */}
        <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4.5 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-amber-400">2. 递延税资产桶 (Tax-Deferred)</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">45% 权重</span>
          </div>
          <div className="text-xl font-black font-mono text-slate-100">
            ¥{(taxDeferredAsset/10000).toFixed(1)}万
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            传统 401(k)、传统 IRA、企业年金。存入时免税，投资收益免税增长，73岁触发 RMD 强制提款。
          </p>
          <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 flex justify-between">
            <span>税收特征:</span>
            <span className="text-amber-300 font-medium">取款按普通收入纳税</span>
          </div>
        </div>

        {/* Bucket 3: Tax-Free */}
        <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4.5 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-emerald-400">3. 永久免税资产桶 (Tax-Free)</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">20% 权重</span>
          </div>
          <div className="text-xl font-black font-mono text-slate-100">
            ¥{((taxFreeAsset + totalConverted)/10000).toFixed(1)}万
            {totalConverted > 0 && (
              <span className="text-xs font-normal text-emerald-400 ml-2">
                (+¥{(totalConverted/10000).toFixed(1)}万 转换转入)
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Roth IRA、Roth 401(k)、HSA 医疗账户。税后资金存入，未来本金与巨大复利收益 100% 永久免税！
          </p>
          <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 flex justify-between">
            <span>税收特征:</span>
            <span className="text-emerald-300 font-medium">终身 100% 免税传承</span>
          </div>
        </div>
      </div>

      {/* Interactive Roth Conversion Optimization Sandbox */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
            ⚡ Roth Conversion 税率差套利沙盘 (Tax Bracket Arbitrage Sandbox)
          </h3>
          <span className="text-[10px] text-cyan-400 font-mono">
            建议窗口期: 退休早期 (无工薪收入，税率处于 12% 洼地)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">每年从递延账户转换金额:</span>
              <span className="font-bold font-mono text-amber-400">¥{(rothConversionAnnual/10000).toFixed(1)}万/年</span>
            </div>
            <input
              type="range"
              min={10000}
              max={200000}
              step={10000}
              value={rothConversionAnnual}
              onChange={(e) => setRothConversionAnnual(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">持续转换年限 (退休早期窗口):</span>
              <span className="font-bold font-mono text-cyan-400">{conversionYears} 年</span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              value={conversionYears}
              onChange={(e) => setConversionYears(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Arbitrage Result Breakdown */}
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-lg flex flex-wrap justify-between items-center gap-3 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">累计转换金额</span>
            <span className="font-mono font-bold text-slate-100">¥{(totalConverted/10000).toFixed(1)}万</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">当期缴纳低档税 (12%)</span>
            <span className="font-mono font-bold text-rose-400">¥{(upfrontTaxPaid/10000).toFixed(1)}万</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">规避未来高税与RMD (28%)</span>
            <span className="font-mono font-bold text-emerald-400">¥{(futureTaxAvoided/10000).toFixed(1)}万</span>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-md">
            <span className="text-emerald-400 block text-[10px] font-medium">净税筹套利收益</span>
            <span className="font-mono font-black text-emerald-300 text-sm">+¥{(lifetimeTaxSavings/10000).toFixed(1)}万</span>
          </div>
        </div>
      </div>
    </div>
  );
};
