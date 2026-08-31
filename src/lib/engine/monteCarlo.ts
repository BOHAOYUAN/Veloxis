import { 
  SimulationParams, 
  SimulationResult, 
  SimulationYearPoint, 
  SimulationMetrics, 
  StressScenario,
  SensitivityMatrix,
  SensitivityCell
} from '@/types/financial';

/**
 * Box-Muller Transform: Converts 2 independent uniform random variables U1, U2 ~ U(0, 1)
 * into a standard normal Gaussian random variable Z ~ N(0, 1)
 */
export function boxMullerGaussian(): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

/**
 * Helper to compute precise percentile from a sorted float array
 */
export function computePercentile(sortedValues: Float64Array, p: number): number {
  const n = sortedValues.length;
  if (n === 0) return 0;
  const index = Math.min(n - 1, Math.max(0, Math.floor(p * n)));
  return sortedValues[index];
}

/**
 * High-Performance Client-Side Monte Carlo Simulation Engine
 * Executes N Geometric Brownian Motion lifetime asset accumulation and decumulation paths
 */
export function runMonteCarloSimulation(params: SimulationParams): SimulationResult {
  const startTime = performance.now();
  const {
    currentAge,
    retirementAge,
    maxAge,
    initialCapital,
    annualSavings,
    retirementAnnualExpense,
    expectedReturn,
    inflationRate,
    volatility,
    simulationsCount,
    shockAge,
    shockExpense = 0,
  } = params;

  const totalYears = maxAge - currentAge + 1;
  const numSims = simulationsCount || 1000;

  // 2D Array: assetsMatrix[simIndex][yearIndex]
  const assetPaths = new Float64Array(numSims * totalYears);

  // Initialize age 0
  for (let s = 0; s < numSims; s++) {
    assetPaths[s * totalYears + 0] = initialCapital;
  }

  // Pre-calculate drift under Ito's lemma
  const dt = 1.0;
  const drift = (expectedReturn - inflationRate) - 0.5 * volatility * volatility;
  const volSqrtDt = volatility * Math.sqrt(dt);

  // Time-stepping forward simulation
  for (let y = 1; y < totalYears; y++) {
    const age = currentAge + y;
    const isAccumulation = age <= retirementAge;

    for (let s = 0; s < numSims; s++) {
      const prevAsset = assetPaths[s * totalYears + (y - 1)];

      if (prevAsset <= 0) {
        assetPaths[s * totalYears + y] = 0;
        continue;
      }

      const z = boxMullerGaussian();
      const annualReturnFactor = Math.exp(drift * dt + volSqrtDt * z);

      let currentAsset = prevAsset * annualReturnFactor;

      if (isAccumulation) {
        currentAsset += annualSavings;
      } else {
        currentAsset -= retirementAnnualExpense;
      }

      if (shockAge && age === shockAge) {
        currentAsset -= shockExpense;
      }

      assetPaths[s * totalYears + y] = Math.max(0, currentAsset);
    }
  }

  // Quantile Extraction & Distribution Analytics
  const yearlyDistributions: SimulationYearPoint[] = [];
  const tempSorted = new Float64Array(numSims);

  let ruinAt85Count = 0;
  let ruinAtMaxCount = 0;
  let medianRetirementAsset = 0;
  let medianEndingAsset = 0;
  let maxMedianAsset = 0;
  let peakAge = currentAge;

  for (let y = 0; y < totalYears; y++) {
    const age = currentAge + y;

    for (let s = 0; s < numSims; s++) {
      tempSorted[s] = assetPaths[s * totalYears + y];
    }
    tempSorted.sort();

    let sum = 0;
    let ruinCount = 0;
    for (let s = 0; s < numSims; s++) {
      sum += tempSorted[s];
      if (tempSorted[s] <= 0) ruinCount++;
    }

    const p10 = computePercentile(tempSorted, 0.10);
    const p25 = computePercentile(tempSorted, 0.25);
    const p50 = computePercentile(tempSorted, 0.50);
    const p75 = computePercentile(tempSorted, 0.75);
    const p90 = computePercentile(tempSorted, 0.90);
    const mean = sum / numSims;
    const ruinProbability = ruinCount / numSims;

    yearlyDistributions.push({
      age,
      p10,
      p25,
      p50,
      p75,
      p90,
      median: p50,
      mean,
      ruinCount,
      ruinProbability,
    });

    if (age === 85) ruinAt85Count = ruinCount;
    if (age === maxAge) {
      ruinAtMaxCount = ruinCount;
      medianEndingAsset = p50;
    }
    if (age === retirementAge) {
      medianRetirementAsset = p50;
    }
    if (p50 > maxMedianAsset) {
      maxMedianAsset = p50;
      peakAge = age;
    }
  }

  const ruinProb85 = ruinAt85Count / numSims;
  const ruinProbMax = ruinAtMaxCount / numSims;
  const survivalRate85 = 1.0 - ruinProb85;

  // FIRE Health Index (0-100 Score)
  let fireScore = Math.round((1 - ruinProb85) * 70 + Math.min(30, (medianRetirementAsset / (retirementAnnualExpense * 25)) * 30));
  fireScore = Math.max(0, Math.min(100, isNaN(fireScore) ? 0 : fireScore));

  let ruinAgeP10: number | null = null;
  for (const pt of yearlyDistributions) {
    if (pt.p10 <= 0 && pt.age >= retirementAge) {
      ruinAgeP10 = pt.age;
      break;
    }
  }

  const metrics: SimulationMetrics = {
    ruinProb85,
    ruinProbMax,
    medianRetirementAsset,
    medianPeakAsset: maxMedianAsset,
    peakAge,
    medianEndingAsset,
    fireScore,
    ruinAgeP10,
    safeAnnualSpendP50: medianRetirementAsset * 0.04,
    survivalRate85,
  };

  const executionTimeMs = performance.now() - startTime;

  return {
    params,
    yearlyDistributions,
    metrics,
    calculatedAt: new Date().toISOString(),
    executionTimeMs,
  };
}

/**
 * Macro Stress Scenarios Preset Suite
 */
export const STRESS_SCENARIOS: Record<string, StressScenario> = {
  SUBPRIME_2008: {
    id: 'SUBPRIME_2008',
    name: '2008 Subprime Liquidity Crisis',
    desc: 'Simulates severe equity market contraction (-20% return in first 2 retirement years, +50% volatility)',
    color: '#ef4444',
    icon: '📉',
    getPatch: (base: SimulationParams) => ({
      expectedReturn: Math.max(0.01, base.expectedReturn - 0.035),
      volatility: Math.min(0.35, base.volatility * 1.5),
    }),
  },
  STAGFLATION_1970: {
    id: 'STAGFLATION_1970',
    name: '1970s Severe Stagflation Shock',
    desc: 'Persistent high inflation (7.5%) coupled with compressed real asset returns',
    color: '#f59e0b',
    icon: '🔥',
    getPatch: () => ({
      inflationRate: 0.075,
      expectedReturn: 0.045,
      volatility: 0.18,
    }),
  },
  MEDICAL_SHOCK: {
    id: 'MEDICAL_SHOCK',
    name: 'Age 55 Major Healthcare Outlay',
    desc: 'Injects a sudden ,000 uninsured medical emergency at age 55 right before retirement',
    color: '#06b6d4',
    icon: '🏥',
    getPatch: () => ({
      shockAge: 55,
      shockExpense: 500000,
    }),
  },
  LONGEVITY_105: {
    id: 'LONGEVITY_105',
    name: 'Centenarian Longevity Horizon',
    desc: 'Extends life trajectory to age 105 to test 45-year continuous decumulation endurance',
    color: '#8b5cf6',
    icon: '⏳',
    getPatch: () => ({
      maxAge: 105,
    }),
  },
};

/**
 * 4x4 Return vs Inflation Sensitivity Matrix Generator
 */
export function computeSensitivityMatrix(baseParams: SimulationParams): SensitivityMatrix {
  const returnRates = [0.04, 0.06, 0.08, 0.10];
  const inflationRates = [0.02, 0.03, 0.04, 0.05];
  const matrix: SensitivityMatrix['matrix'] = [];

  for (const r of returnRates) {
    const row: SensitivityCell[] = [];
    for (const inf of inflationRates) {
      const p: SimulationParams = {
        ...baseParams,
        expectedReturn: r,
        inflationRate: inf,
        simulationsCount: 150,
      };
      const res = runMonteCarloSimulation(p);
      row.push({
        returnRate: r,
        inflationRate: inf,
        ruinProb: res.metrics.ruinProb85,
        fireScore: res.metrics.fireScore,
        ruinPercentText: `${(res.metrics.ruinProb85 * 100).toFixed(0)}%`,
      });
    }
    matrix.push({
      returnRate: r,
      returnPercentText: `${(r * 100).toFixed(0)}%`,
      items: row,
    });
  }

  return {
    returnHeaders: returnRates,
    inflationHeaders: inflationRates,
    inflationHeaderLabels: inflationRates.map(inf => `${(inf * 100).toFixed(0)}%`),
    matrix,
  };
}
