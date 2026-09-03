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
  balance: number;
  includeInRetirementPlan: boolean;
}

export interface AnnualCashFlow {
  id: string;
  name: string;
  type: CashFlowType;
  annualAmount: number;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  targetYear: number;
}

export interface PlanningAssumptions {
  expectedReturn: number;
  inflationRate: number;
  volatility: number;
  retirementSpendingRatio: number;
  simulationsCount: number;
}

export interface HouseholdWorkspace {
  version: 1;
  profile: HouseholdProfile;
  accounts: FinancialAccount[];
  cashFlows: AnnualCashFlow[];
  goals: FinancialGoal[];
  assumptions: PlanningAssumptions;
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

export type BaselineSimulationParams = SimulationParams;
