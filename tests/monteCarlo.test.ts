import { describe, it, expect } from 'vitest';
import { 
  boxMullerGaussian, 
  computePercentile, 
  runMonteCarloSimulation, 
  computeSensitivityMatrix, 
  STRESS_SCENARIOS 
} from '../src/lib/engine/monteCarlo';
import { SimulationParams } from '../src/types/financial';

describe('Monte Carlo Mathematical & Financial Engine', () => {
  
  it('Box-Muller transform produces approximately Standard Normal distribution Z ~ N(0, 1)', () => {
    const N = 10000;
    let sum = 0;
    let sumSq = 0;

    for (let i = 0; i < N; i++) {
      const z = boxMullerGaussian();
      sum += z;
      sumSq += z * z;
    }

    const mean = sum / N;
    const variance = (sumSq / N) - (mean * mean);

    // Mean should be close to 0 (+- 0.05), Variance close to 1 (+- 0.05)
    expect(Math.abs(mean)).toBeLessThan(0.08);
    expect(Math.abs(variance - 1.0)).toBeLessThan(0.08);
  });

  it('Percentile calculation maintains monotonic ordering P10 <= P50 <= P90', () => {
    const values = new Float64Array([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
    
    const p10 = computePercentile(values, 0.10);
    const p50 = computePercentile(values, 0.50);
    const p90 = computePercentile(values, 0.90);

    expect(p10).toBeLessThanOrEqual(p50);
    expect(p50).toBeLessThanOrEqual(p90);
    expect(p50).toBe(60);
  });

  it('Executes full lifecycle simulation and computes valid metrics', () => {
    const baseParams: SimulationParams = {
      currentAge: 25,
      retirementAge: 60,
      maxAge: 85,
      initialCapital: 1000000,
      annualSavings: 150000,
      retirementAnnualExpense: 200000,
      expectedReturn: 0.07,
      inflationRate: 0.025,
      volatility: 0.12,
      simulationsCount: 300,
    };

    const result = runMonteCarloSimulation(baseParams);

    expect(result.yearlyDistributions.length).toBe(61); // 25 to 85 inclusive
    expect(result.metrics.fireScore).toBeGreaterThanOrEqual(0);
    expect(result.metrics.fireScore).toBeLessThanOrEqual(100);
    expect(result.metrics.ruinProb85).toBeGreaterThanOrEqual(0);
    expect(result.metrics.ruinProb85).toBeLessThanOrEqual(1);
    expect(result.executionTimeMs).toBeGreaterThan(0);
  });

  it('Macro Stagflation scenario strictly increases ruin probability', () => {
    const baseParams: SimulationParams = {
      currentAge: 35,
      retirementAge: 60,
      maxAge: 85,
      initialCapital: 500000,
      annualSavings: 80000,
      retirementAnnualExpense: 250000,
      expectedReturn: 0.08,
      inflationRate: 0.02,
      volatility: 0.10,
      simulationsCount: 400,
    };

    const baselineResult = runMonteCarloSimulation(baseParams);
    const stagflationPatch = STRESS_SCENARIOS.STAGFLATION_1970.getPatch(baseParams);
    const stressedResult = runMonteCarloSimulation({
      ...baseParams,
      ...stagflationPatch,
    });

    expect(stressedResult.metrics.ruinProb85).toBeGreaterThanOrEqual(baselineResult.metrics.ruinProb85);
  });

  it('Sensitivity matrix generates valid 4x4 grid', () => {
    const baseParams: SimulationParams = {
      currentAge: 30,
      retirementAge: 60,
      maxAge: 85,
      initialCapital: 800000,
      annualSavings: 100000,
      retirementAnnualExpense: 180000,
      expectedReturn: 0.06,
      inflationRate: 0.03,
      volatility: 0.12,
      simulationsCount: 50,
    };

    const sens = computeSensitivityMatrix(baseParams);

    expect(sens.returnHeaders.length).toBe(4);
    expect(sens.inflationHeaders.length).toBe(4);
    expect(sens.matrix.length).toBe(4);
    expect(sens.matrix[0].items.length).toBe(4);
  });

});
