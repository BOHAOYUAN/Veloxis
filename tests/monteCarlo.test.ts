import { describe, expect, it } from 'vitest';
import {
  boxMullerGaussian,
  computePercentile,
  computeSensitivityMatrix,
  createSeededRandom,
  runDeterministicProjection,
  runMonteCarloSimulation,
  STRESS_SCENARIOS,
} from '@/lib/engine/monteCarlo';
import { SimulationParams } from '@/types/financial';

const baseParams: SimulationParams = {
  currentAge: 35,
  retirementAge: 60,
  maxAge: 95,
  initialCapital: 500000,
  annualIncome: 180000,
  annualSavings: 80000,
  baselineAnnualSavings: 80000,
  retirementAnnualExpense: 100000,
  annualSocialSecurity: 30000,
  socialSecurityClaimAge: 67,
  expectedReturn: 0.07,
  inflationRate: 0.025,
  volatility: 0.14,
  simulationsCount: 400,
  randomSeed: 42,
  cashFlows: [
    { name: 'Salary', type: 'INCOME', annualAmount: 180000, startAge: 35, endAge: 59, inflationCategory: 'general' },
    { name: 'Living', type: 'EXPENSE', annualAmount: 100000, startAge: 35, endAge: 95, inflationCategory: 'general' },
  ],
  goals: [],
};

describe('Monte Carlo financial engine', () => {
  it('produces an approximately standard normal distribution from a seeded generator', () => {
    const random = createSeededRandom(12345);
    const sample = Array.from({ length: 10000 }, () => boxMullerGaussian(random));
    const mean = sample.reduce((sum, value) => sum + value, 0) / sample.length;
    const variance = sample.reduce((sum, value) => sum + value * value, 0) / sample.length - mean * mean;

    expect(Math.abs(mean)).toBeLessThan(0.08);
    expect(Math.abs(variance - 1)).toBeLessThan(0.08);
  });

  it('computes ordered percentiles', () => {
    const values = new Float64Array([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
    expect(computePercentile(values, 0.1)).toBeLessThanOrEqual(computePercentile(values, 0.5));
    expect(computePercentile(values, 0.5)).toBeLessThanOrEqual(computePercentile(values, 0.9));
  });

  it('returns identical financial results for identical inputs and seeds', () => {
    const first = runMonteCarloSimulation(baseParams);
    const second = runMonteCarloSimulation(baseParams);

    expect(second.yearlyDistributions).toEqual(first.yearlyDistributions);
    expect(second.metrics).toEqual(first.metrics);
  });

  it('changes simulated distributions when the seed changes', () => {
    const first = runMonteCarloSimulation(baseParams);
    const second = runMonteCarloSimulation({ ...baseParams, randomSeed: 43 });

    expect(second.yearlyDistributions).not.toEqual(first.yearlyDistributions);
  });

  it.each([80, 85, 95])('uses maxAge %i as the plan-end success horizon', maxAge => {
    const result = runMonteCarloSimulation({ ...baseParams, maxAge });
    const lastYear = result.yearlyDistributions.at(-1)!;

    expect(result.metrics.planEndAge).toBe(maxAge);
    expect(result.metrics.ruinProbabilityAtPlanEnd).toBe(lastYear.ruinProbability);
    expect(result.metrics.successProbabilityAtPlanEnd).toBe(1 - lastYear.ruinProbability);
  });

  it('starts retirement cash flows at the retirement age and preserves the ledger identity', () => {
    const projection = runDeterministicProjection({
      ...baseParams,
      currentAge: 58,
      retirementAge: 60,
      maxAge: 70,
      initialCapital: 100000,
      annualIncome: 100000,
      annualSavings: 50000,
      baselineAnnualSavings: 50000,
      retirementAnnualExpense: 40000,
      annualSocialSecurity: 0,
      cashFlows: [
        { name: 'Salary', type: 'INCOME', annualAmount: 100000, startAge: 58, endAge: 59, inflationCategory: 'general' },
        { name: 'Living', type: 'EXPENSE', annualAmount: 50000, startAge: 58, endAge: 70, inflationCategory: 'general' },
      ],
      goals: [],
    });
    const age59 = projection.find(year => year.age === 59)!;
    const age60 = projection.find(year => year.age === 60)!;

    expect(age59.contributions).toBe(50000);
    expect(age59.retirementExpenses).toBe(0);
    expect(age60.earnedIncome).toBe(0);
    expect(age60.contributions).toBe(0);
    expect(age60.retirementExpenses).toBe(40000);
    for (const year of projection) {
      expect(year.endingAssets).toBeCloseTo(
        year.openingAssets + year.investmentReturn + year.contributions - year.withdrawals,
      );
    }
  });

  it('honors recurring cash-flow age ranges and inflation categories', () => {
    const projection = runDeterministicProjection({
      ...baseParams,
      expectedReturn: 0.025,
      inflationRate: 0.025,
      annualSavings: 0,
      baselineAnnualSavings: 0,
      cashFlows: [{
        name: 'One-year nominal income', type: 'INCOME', annualAmount: 100000,
        startAge: 36, endAge: 36, inflationCategory: 'none',
      }],
    });

    expect(projection.find(year => year.age === 35)?.earnedIncome).toBe(0);
    expect(projection.find(year => year.age === 36)?.earnedIncome).toBeCloseTo(100000 / 1.025);
    expect(projection.find(year => year.age === 37)?.earnedIncome).toBe(0);
  });

  it('applies stress assumptions and creates a valid sensitivity matrix', () => {
    const patch = STRESS_SCENARIOS.HIGH_INFLATION.getPatch(baseParams);
    const stressed = runMonteCarloSimulation({ ...baseParams, ...patch });
    const baseline = runMonteCarloSimulation(baseParams);
    const matrix = computeSensitivityMatrix(baseParams);

    expect(stressed.metrics.successProbabilityAtPlanEnd)
      .toBeLessThanOrEqual(baseline.metrics.successProbabilityAtPlanEnd);
    expect(matrix.matrix).toHaveLength(4);
    expect(matrix.matrix[0].items).toHaveLength(4);
  });
});
