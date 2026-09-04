import {
  ProjectionYear,
  SensitivityCell,
  SensitivityMatrix,
  SimulationMetrics,
  SimulationParams,
  SimulationResult,
  SimulationYearPoint,
  StressScenario,
} from '@/types/financial';

export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function boxMullerGaussian(random: () => number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = random();
  while (v === 0) v = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function computePercentile(sortedValues: Float64Array, p: number): number {
  const n = sortedValues.length;
  if (n === 0) return 0;
  const index = Math.min(n - 1, Math.max(0, Math.floor(p * n)));
  return sortedValues[index];
}

function goalsAtAge(params: SimulationParams, age: number): number {
  return params.goals
    .filter(goal => goal.age === age)
    .reduce((sum, goal) => sum + goal.amount, 0);
}

function realReturn(params: SimulationParams): number {
  return (1 + params.expectedReturn) / (1 + params.inflationRate) - 1;
}

function recurringCashAtAge(params: SimulationParams, age: number): {
  income: number;
  expenses: number;
} {
  const yearsFromStart = age - params.currentAge;
  return params.cashFlows.reduce((totals, flow) => {
    if (age < flow.startAge || age > flow.endAge) return totals;
    const realValueFactor = flow.inflationCategory === 'general'
      ? 1
      : 1 / Math.pow(1 + params.inflationRate, yearsFromStart);
    const realAmount = flow.annualAmount * realValueFactor;
    if (flow.type === 'INCOME') totals.income += realAmount;
    else totals.expenses += realAmount;
    return totals;
  }, { income: 0, expenses: 0 });
}

function planCashAtAge(params: SimulationParams, age: number) {
  const retired = age >= params.retirementAge;
  const recurring = recurringCashAtAge(params, age);
  const savingsAdjustment = params.annualSavings - params.baselineAnnualSavings;
  const livingExpenses = retired ? 0 : Math.max(0, recurring.expenses - savingsAdjustment);
  const retirementExpenses = retired ? params.retirementAnnualExpense : 0;
  const socialSecurityIncome = age >= params.socialSecurityClaimAge
    ? params.annualSocialSecurity
    : 0;
  const goalExpenses = goalsAtAge(params, age)
    + (params.shockAge === age ? params.shockExpense ?? 0 : 0);
  const netCashFlow = recurring.income
    + socialSecurityIncome
    - livingExpenses
    - retirementExpenses
    - goalExpenses;
  return {
    earnedIncome: recurring.income,
    socialSecurityIncome,
    livingExpenses,
    retirementExpenses,
    goalExpenses,
    contribution: Math.max(0, netCashFlow),
    requestedWithdrawal: Math.max(0, -netCashFlow),
  };
}

/** Expected-return projection used by every deterministic cash-flow view. */
export function runDeterministicProjection(params: SimulationParams): ProjectionYear[] {
  const projection: ProjectionYear[] = [];
  let assets = params.initialCapital;

  for (let age = params.currentAge; age <= params.maxAge; age++) {
    const openingAssets = assets;
    if (age === params.currentAge) {
      projection.push({
        age,
        openingAssets,
        investmentReturn: 0,
        earnedIncome: 0,
        socialSecurityIncome: 0,
        contributions: 0,
        livingExpenses: 0,
        retirementExpenses: 0,
        goalExpenses: 0,
        withdrawals: 0,
        unfundedExpenses: 0,
        endingAssets: openingAssets,
      });
      continue;
    }
    const investmentReturn = openingAssets * realReturn(params);
    const cash = planCashAtAge(params, age);
    const availableAssets = Math.max(0, openingAssets + investmentReturn + cash.contribution);
    const withdrawals = Math.min(availableAssets, cash.requestedWithdrawal);
    const unfundedExpenses = Math.max(0, cash.requestedWithdrawal - withdrawals);
    const contributions = cash.contribution;
    const endingAssets = Math.max(0, availableAssets - withdrawals);

    projection.push({
      age,
      openingAssets,
      investmentReturn,
      earnedIncome: cash.earnedIncome,
      socialSecurityIncome: cash.socialSecurityIncome,
      contributions,
      livingExpenses: cash.livingExpenses,
      retirementExpenses: cash.retirementExpenses,
      goalExpenses: cash.goalExpenses,
      withdrawals,
      unfundedExpenses,
      endingAssets,
    });
    assets = endingAssets;
  }

  return projection;
}

/** Seeded lifetime accumulation and decumulation simulation. */
export function runMonteCarloSimulation(params: SimulationParams): SimulationResult {
  const startTime = performance.now();
  const random = createSeededRandom(params.randomSeed);
  const totalYears = params.maxAge - params.currentAge + 1;
  const numSims = params.simulationsCount || 1000;
  const assetPaths = new Float64Array(numSims * totalYears);

  for (let simulation = 0; simulation < numSims; simulation++) {
    assetPaths[simulation * totalYears] = params.initialCapital;
  }

  const drift = realReturn(params) - 0.5 * params.volatility * params.volatility;

  for (let yearIndex = 1; yearIndex < totalYears; yearIndex++) {
    const age = params.currentAge + yearIndex;
    const cash = planCashAtAge(params, age);

    for (let simulation = 0; simulation < numSims; simulation++) {
      const offset = simulation * totalYears;
      const previousAssets = assetPaths[offset + yearIndex - 1];
      const gaussian = boxMullerGaussian(random);
      if (previousAssets <= 0) {
        assetPaths[offset + yearIndex] = 0;
        continue;
      }

      const annualReturnFactor = Math.exp(drift + params.volatility * gaussian);
      const endingAssets = previousAssets * annualReturnFactor
        + cash.contribution
        - cash.requestedWithdrawal;
      assetPaths[offset + yearIndex] = Math.max(0, endingAssets);
    }
  }

  const yearlyDistributions: SimulationYearPoint[] = [];
  const tempSorted = new Float64Array(numSims);
  let medianRetirementAsset = 0;
  let medianEndingAsset = 0;
  let maxMedianAsset = 0;
  let peakAge = params.currentAge;
  let ruinAtPlanEndCount = 0;

  for (let yearIndex = 0; yearIndex < totalYears; yearIndex++) {
    const age = params.currentAge + yearIndex;
    for (let simulation = 0; simulation < numSims; simulation++) {
      tempSorted[simulation] = assetPaths[simulation * totalYears + yearIndex];
    }
    tempSorted.sort();

    let sum = 0;
    let ruinCount = 0;
    for (const value of tempSorted) {
      sum += value;
      if (value <= 0) ruinCount++;
    }

    const p10 = computePercentile(tempSorted, 0.1);
    const p25 = computePercentile(tempSorted, 0.25);
    const p50 = computePercentile(tempSorted, 0.5);
    const p75 = computePercentile(tempSorted, 0.75);
    const p90 = computePercentile(tempSorted, 0.9);
    yearlyDistributions.push({
      age,
      p10,
      p25,
      p50,
      p75,
      p90,
      median: p50,
      mean: sum / numSims,
      ruinCount,
      ruinProbability: ruinCount / numSims,
    });

    if (age === params.retirementAge) medianRetirementAsset = p50;
    if (age === params.maxAge) {
      ruinAtPlanEndCount = ruinCount;
      medianEndingAsset = p50;
    }
    if (p50 > maxMedianAsset) {
      maxMedianAsset = p50;
      peakAge = age;
    }
  }

  const ruinProbabilityAtPlanEnd = ruinAtPlanEndCount / numSims;
  const successProbabilityAtPlanEnd = 1 - ruinProbabilityAtPlanEnd;
  const fundingRatio = medianRetirementAsset / Math.max(1, params.retirementAnnualExpense * 25);
  const planHealthScore = Math.max(0, Math.min(100, Math.round(
    successProbabilityAtPlanEnd * 70 + Math.min(30, fundingRatio * 30),
  )));
  const ruinAgeP10 = yearlyDistributions.find(point => (
    point.age >= params.retirementAge && point.p10 <= 0
  ))?.age ?? null;

  const metrics: SimulationMetrics = {
    planEndAge: params.maxAge,
    ruinProbabilityAtPlanEnd,
    successProbabilityAtPlanEnd,
    medianRetirementAsset,
    medianPeakAsset: maxMedianAsset,
    peakAge,
    medianEndingAsset,
    planHealthScore,
    ruinAgeP10,
  };

  return {
    params,
    yearlyDistributions,
    metrics,
    calculatedAt: new Date().toISOString(),
    executionTimeMs: performance.now() - startTime,
  };
}

export const STRESS_SCENARIOS: Record<string, StressScenario> = {
  LOWER_RETURN: {
    id: 'LOWER_RETURN',
    name: 'Lower-return environment',
    desc: 'Reduces the expected annual return by 3.5 percentage points and raises volatility by 50%.',
    color: '#ef4444',
    icon: '📉',
    getPatch: base => ({
      expectedReturn: Math.max(0.01, base.expectedReturn - 0.035),
      volatility: Math.min(0.35, base.volatility * 1.5),
    }),
  },
  HIGH_INFLATION: {
    id: 'HIGH_INFLATION',
    name: 'High-inflation environment',
    desc: 'Uses 7.5% inflation, a 4.5% expected return, and 18% annual volatility for the full plan.',
    color: '#f59e0b',
    icon: '🔥',
    getPatch: () => ({ inflationRate: 0.075, expectedReturn: 0.045, volatility: 0.18 }),
  },
  MEDICAL_SHOCK: {
    id: 'MEDICAL_SHOCK',
    name: 'One-time healthcare outlay',
    desc: 'Adds a $500,000 one-time portfolio withdrawal at age 55.',
    color: '#06b6d4',
    icon: '🏥',
    getPatch: () => ({ shockAge: 55, shockExpense: 500000 }),
  },
  LONGEVITY_105: {
    id: 'LONGEVITY_105',
    name: 'Age-105 planning horizon',
    desc: 'Extends the plan end age to 105 while preserving the other baseline assumptions.',
    color: '#8b5cf6',
    icon: '⏳',
    getPatch: () => ({ maxAge: 105 }),
  },
};

export function computeSensitivityMatrix(baseParams: SimulationParams): SensitivityMatrix {
  const returnRates = [0.04, 0.06, 0.08, 0.1];
  const inflationRates = [0.02, 0.03, 0.04, 0.05];
  const matrix: SensitivityMatrix['matrix'] = [];

  for (const returnRate of returnRates) {
    const row: SensitivityCell[] = [];
    for (const inflationRate of inflationRates) {
      const result = runMonteCarloSimulation({
        ...baseParams,
        expectedReturn: returnRate,
        inflationRate,
        simulationsCount: 300,
      });
      row.push({
        returnRate,
        inflationRate,
        ruinProb: result.metrics.ruinProbabilityAtPlanEnd,
        planHealthScore: result.metrics.planHealthScore,
        ruinPercentText: `${(result.metrics.ruinProbabilityAtPlanEnd * 100).toFixed(0)}%`,
      });
    }
    matrix.push({
      returnRate,
      returnPercentText: `${(returnRate * 100).toFixed(0)}%`,
      items: row,
    });
  }

  return {
    returnHeaders: returnRates,
    inflationHeaders: inflationRates,
    inflationHeaderLabels: inflationRates.map(rate => `${(rate * 100).toFixed(0)}%`),
    matrix,
  };
}
