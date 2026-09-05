'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SimulationResult, SimulationYearPoint } from '@/types/financial';

interface MonteCarloChartProps {
  data: SimulationResult;
  currency: string;
}

export const MonteCarloChart: React.FC<MonteCarloChartProps> = ({ data, currency }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoverPoint, setHoverPoint] = useState<SimulationYearPoint | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const formatMoney = useCallback((value: number): string => new Intl.NumberFormat('en-US', {
    style: 'currency', currency, notation: 'compact', maximumFractionDigits: 1,
  }).format(value), [currency]);

  const renderChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);
    const width = rect.width;
    const height = rect.height;

    // Margins
    const padLeft = 70;
    const padRight = 30;
    const padTop = 25;
    const padBottom = 40;
    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    ctx.clearRect(0, 0, width, height);

    const points = data.yearlyDistributions;
    if (points.length < 2) return;

    let maxAsset = 0;
    for (const p of points) {
      if (p.p90 > maxAsset) maxAsset = p.p90;
    }
    maxAsset = Math.max(maxAsset * 1.15, 1000000);

    const minAge = points[0].age;
    const maxAge = points[points.length - 1].age;

    const getX = (age: number) => padLeft + ((age - minAge) / (maxAge - minAge)) * chartW;
    const getY = (val: number) => padTop + chartH - (Math.max(0, val) / maxAsset) * chartH;

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    const gridRows = 5;
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';

    for (let i = 0; i <= gridRows; i++) {
      const yVal = (maxAsset / gridRows) * i;
      const yPos = getY(yVal);

      ctx.beginPath();
      ctx.moveTo(padLeft, yPos);
      ctx.lineTo(padLeft + chartW, yPos);
      ctx.stroke();

      ctx.fillText(formatMoney(yVal), padLeft - 8, yPos + 4);
    }

    // X Axis Labels
    ctx.textAlign = 'center';
    for (let i = 0; i < points.length; i += 10) {
      const pt = points[i];
      const xPos = getX(pt.age);
      ctx.fillText(`${pt.age}`, xPos, height - 15);
    }

    // Shaded Confidence Band (P10 - P90)
    ctx.beginPath();
    ctx.moveTo(getX(points[0].age), getY(points[0].p90));
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(getX(points[i].age), getY(points[i].p90));
    }
    for (let i = points.length - 1; i >= 0; i--) {
      ctx.lineTo(getX(points[i].age), getY(points[i].p10));
    }
    ctx.closePath();
    const gradBand = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
    gradBand.addColorStop(0, 'rgba(0, 229, 255, 0.20)');
    gradBand.addColorStop(1, 'rgba(0, 229, 255, 0.02)');
    ctx.fillStyle = gradBand;
    ctx.fill();

    // P90 Line (Cyan)
    ctx.beginPath();
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2;
    for (let i = 0; i < points.length; i++) {
      const x = getX(points[i].age);
      const y = getY(points[i].p90);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // P50 Median Line (Gold)
    ctx.beginPath();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 3;
    for (let i = 0; i < points.length; i++) {
      const x = getX(points[i].age);
      const y = getY(points[i].p50);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // P10 Line (Red/Orange)
    ctx.beginPath();
    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 2;
    for (let i = 0; i < points.length; i++) {
      const x = getX(points[i].age);
      const y = getY(points[i].p10);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Retirement Vertical Milestone
    const retAge = data.params.retirementAge;
    if (retAge >= minAge && retAge <= maxAge) {
      const retX = getX(retAge);
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      ctx.moveTo(retX, padTop);
      ctx.lineTo(retX, padTop + chartH);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Retire (${retAge})`, retX, padTop - 8);
    }

    // Hover Indicator
    if (hoverPoint) {
      const hx = getX(hoverPoint.age);
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.setLineDash([2, 2]);
      ctx.moveTo(hx, padTop);
      ctx.lineTo(hx, padTop + chartH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Circle on P50
      ctx.beginPath();
      ctx.arc(hx, getY(hoverPoint.p50), 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [data, formatMoney, hoverPoint]);

  useEffect(() => {
    renderChart();
    const handleResize = () => renderChart();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderChart]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const padLeft = 70;
    const padRight = 30;
    const chartW = rect.width - padLeft - padRight;

    if (mouseX < padLeft || mouseX > rect.width - padRight) {
      setHoverPoint(null);
      setMousePos(null);
      return;
    }

    const points = data.yearlyDistributions;
    const ratio = (mouseX - padLeft) / chartW;
    const targetIdx = Math.min(points.length - 1, Math.max(0, Math.round(ratio * (points.length - 1))));

    setHoverPoint(points[targetIdx]);
    setMousePos({ x: e.clientX - rect.left, y: mouseY });
  };

  const handleMouseLeave = () => {
    setHoverPoint(null);
    setMousePos(null);
  };

  return (
    <div className="relative w-full h-[400px] bg-slate-900/80 rounded-2xl p-4 border border-slate-800 backdrop-blur-md shadow-xl">
      <div className="flex justify-between items-center mb-2 px-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Lifetime invested-assets confidence range</h3>
          <p className="text-xs text-slate-400">Seeded log-normal simulation · {data.params.simulationsCount.toLocaleString()} paths · seed {data.params.randomSeed}</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-cyan-400 font-medium"><span className="w-2.5 h-0.5 bg-cyan-400 rounded"></span>P90</span>
          <span className="flex items-center gap-1.5 text-amber-400 font-medium"><span className="w-2.5 h-0.5 bg-amber-400 rounded"></span>P50</span>
          <span className="flex items-center gap-1.5 text-rose-400 font-medium"><span className="w-2.5 h-0.5 bg-rose-400 rounded"></span>P10</span>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-[320px] cursor-crosshair"
      />

      {/* Floating HUD Tooltip */}
      {hoverPoint && mousePos && (
        <div
          style={{ left: `${mousePos.x + 15}px`, top: `${Math.min(200, mousePos.y)}px` }}
          className="absolute pointer-events-none bg-slate-950/95 border border-slate-700 text-slate-100 rounded-xl p-3 shadow-2xl text-xs z-30 min-w-[170px] backdrop-blur-md"
        >
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1.5 flex justify-between">
            <span>Age {hoverPoint.age}</span>
            <span className="text-cyan-400 font-mono">{hoverPoint.age >= data.params.retirementAge ? 'Retirement' : 'Accumulation'}</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-cyan-400"><span>P90:</span><span className="font-mono font-bold">{formatMoney(hoverPoint.p90)}</span></div>
            <div className="flex justify-between text-amber-400"><span>P50:</span><span className="font-mono font-bold">{formatMoney(hoverPoint.p50)}</span></div>
            <div className="flex justify-between text-rose-400"><span>P10:</span><span className="font-mono font-bold">{formatMoney(hoverPoint.p10)}</span></div>
            <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800/80">
              <span>Asset exhaustion:</span>
              <span className="font-mono font-bold text-rose-300">{(hoverPoint.ruinProbability * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
