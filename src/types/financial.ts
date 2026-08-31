/**
 * Veloxis Wealth OS - Comprehensive Financial Simulation Types
 * Standardized for RIA (Registered Investment Advisor) Quantitative Modeling
 */

export interface SimulationParams {
  currentAge: number;
  retirementAge: number;
  maxAge: number;
  initialCapital: number;
  annualSavings: number;
  retirementAnnualExpense: number;
  expectedReturn: number;
  inflationRate: number;
  volatility: number;
  simulationsCount: number;
  shockAge?: number;
  shockExpense?: number;
}

export interface SimulationYearPoint {
  age: number;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  median: number;
  mean: number;
  ruinCount: number;
  ruinProbability: number;
}

export interface SimulationMetrics {
  ruinProb85: number;
  ruinProbMax: number;
  medianRetirementAsset: number;
  medianPeakAsset: number;
  peakAge: number;
  medianEndingAsset: number;
  fireScore: number;
  ruinAgeP10: number | null;
  safeAnnualSpendP50: number;
  survivalRate85: number;
}

export interface SimulationResult {
  params: SimulationParams;
  yearlyDistributions: SimulationYearPoint[];
  metrics: SimulationMetrics;
  calculatedAt: string;
  executionTimeMs: number;
}

export interface StressScenario {
  id: string;
  name: string;
  desc: string;
  color: string;
  icon: string;
  getPatch: (base: SimulationParams) => Partial<SimulationParams>;
}

export interface SensitivityCell {
  returnRate: number;
  inflationRate: number;
  ruinProb: number;
  fireScore: number;
  ruinPercentText: string;
}

export interface SensitivityMatrix {
  returnHeaders: number[];
  inflationHeaders: number[];
  inflationHeaderLabels: string[];
  matrix: {
    returnRate: number;
    returnPercentText: string;
    items: SensitivityCell[];
  }[];
}

export interface AIPlanDiagnosis {
  overallHealthStatus: 'HEALTHY' | 'MODERATE_RISK' | 'HIGH_RISK';
  fireHealthScore: number;
  primaryRiskFactor: string;
  recommendations: string[];
  retirementFeasibility: string;
  taxOptimizationAdvice: string;
}
