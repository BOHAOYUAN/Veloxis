import { SimulationParams } from '@/types/financial';

export type AccountType =
  | 'CASH'
  | 'BROKERAGE'
  | 'RETIREMENT'
  | 'REAL_ESTATE'
  | 'OTHER_ASSET'
  | 'MORTGAGE'
  | 'STUDENT_LOAN'
  | 'CREDIT_CARD'
  | 'OTHER_LIABILITY';

export type TaxCategory = 'taxable' | 'taxDeferred' | 'taxFree' | 'nonInvestment';
export type InflationCategory = 'none' | 'general';
export type CashFlowType = 'INCOME' | 'EXPENSE';

export interface HouseholdProfile {
  householdName: string;
  jurisdiction: string;
  currency: string;
  currentAge: number;
  retirementAge: number;
  longevityAge: number;
}

export interface FinancialAccount {
  id: string;
  name: string;
  type: AccountType;
  taxCategory: TaxCategory;
  balance: number;
  includeInRetirementPlan: boolean;
}

export interface AnnualCashFlow {
  id: string;
  name: string;
  type: CashFlowType;
  annualAmount: number;
  startAge: number;
  endAge: number;
  inflationCategory: InflationCategory;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  targetAge: number;
}

export interface SocialSecurityEstimate {
  annualBenefit: number;
  claimAge: number;
}

export interface PlanningAssumptions {
  expectedReturn: number;
  inflationRate: number;
  volatility: number;
  retirementSpendingRatio: number;
  simulationsCount: number;
  randomSeed: number;
}

export interface ProposedPlanInputs {
  retirementAge: number;
  annualSavings: number;
  retirementAnnualExpense: number;
  socialSecurityClaimAge: number;
}

export interface HouseholdWorkspace {
  version: 2;
  profile: HouseholdProfile;
  accounts: FinancialAccount[];
  cashFlows: AnnualCashFlow[];
  goals: FinancialGoal[];
  socialSecurity: SocialSecurityEstimate;
  assumptions: PlanningAssumptions;
  proposedPlan: ProposedPlanInputs;
  updatedAt: string;
}

export interface HouseholdSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  investableAssets: number;
  annualIncome: number;
  annualExpenses: number;
  annualSurplus: number;
  goalTargetTotal: number;
}

export interface TaxAllocationSummary {
  taxable: number;
  taxDeferred: number;
  taxFree: number;
  totalClassifiedInvestments: number;
}

export interface EstateSummary {
  enteredAssets: number;
  enteredLiabilities: number;
  indicativeNetEstate: number;
}

export type BaselineSimulationParams = SimulationParams;
