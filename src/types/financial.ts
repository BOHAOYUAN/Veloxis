/**
 * Financial simulation contracts. Monetary values use today's dollars;
 * expectedReturn is nominal and inflationRate is used to derive a real return.
 */

export interface SimulationGoal {
  name: string;
  age: number;
  amount: number;
}

export interface SimulationCashFlow {
  name: string;
  type: 'INCOME' | 'EXPENSE';
  annualAmount: number;
  startAge: number;
  endAge: number;
  inflationCategory: 'none' | 'general';
}

export interface SimulationParams {
  currentAge: number;
  retirementAge: number;
  maxAge: number;
  initialCapital: number;
  annualIncome: number;
  annualSavings: number;
  baselineAnnualSavings: number;
  retirementAnnualExpense: number;
  annualSocialSecurity: number;
  socialSecurityClaimAge: number;
  expectedReturn: number;
  inflationRate: number;
  volatility: number;
  simulationsCount: number;
  randomSeed: number;
  cashFlows: SimulationCashFlow[];
  goals: SimulationGoal[];
  shockAge?: number;
  shockExpense?: number;
}

export interface ProjectionYear {
  age: number;
  openingAssets: number;
  investmentReturn: number;
  earnedIncome: number;
  socialSecurityIncome: number;
  contributions: number;
  livingExpenses: number;
  retirementExpenses: number;
  goalExpenses: number;
  withdrawals: number;
  unfundedExpenses: number;
  endingAssets: number;
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
  planEndAge: number;
  ruinProbabilityAtPlanEnd: number;
  successProbabilityAtPlanEnd: number;
  medianRetirementAsset: number;
  medianPeakAsset: number;
  peakAge: number;
  medianEndingAsset: number;
  planHealthScore: number;
  ruinAgeP10: number | null;
}

export interface SimulationResult {
  params: SimulationParams;
  yearlyDistributions: SimulationYearPoint[];
  metrics: SimulationMetrics;
  calculatedAt: string;
  executionTimeMs: number;
}

export interface PlanScenario {
  id: 'current' | 'proposed';
  name: string;
  params: SimulationParams;
  updatedAt: string;
}

export interface ScenarioComparison {
  current: SimulationResult;
  proposed: SimulationResult;
  successProbabilityDelta: number;
  medianRetirementAssetDelta: number;
  medianEndingAssetDelta: number;
  annualSavingsDelta: number;
  retirementExpenseDelta: number;
  retirementAgeDelta: number;
  socialSecurityClaimAgeDelta: number;
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
  planHealthScore: number;
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
