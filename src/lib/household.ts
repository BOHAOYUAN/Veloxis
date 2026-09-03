import { z } from 'zod';
import {
  AccountType,
  AnnualCashFlow,
  FinancialAccount,
  FinancialGoal,
  HouseholdSummary,
  HouseholdWorkspace,
  PlanningAssumptions,
} from '@/types/household';
import { SimulationParams } from '@/types/financial';

const accountTypes: [AccountType, ...AccountType[]] = [
  'CASH', 'BROKERAGE', 'RETIREMENT', 'REAL_ESTATE', 'OTHER_ASSET',
  'MORTGAGE', 'STUDENT_LOAN', 'CREDIT_CARD', 'OTHER_LIABILITY',
];

const profileSchema = z.object({
  householdName: z.string().trim().min(1).max(100),
  jurisdiction: z.string().trim().min(2).max(12),
  currency: z.string().trim().length(3),
  currentAge: z.number().int().min(18).max(80),
  retirementAge: z.number().int().min(30).max(90),
  longevityAge: z.number().int().min(70).max(115),
}).refine(profile => profile.retirementAge > profile.currentAge, {
  message: 'Retirement age must be greater than current age', path: ['retirementAge'],
}).refine(profile => profile.longevityAge > profile.retirementAge, {
  message: 'Longevity age must be greater than retirement age', path: ['longevityAge'],
});

const accountSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(100),
  type: z.enum(accountTypes),
  balance: z.number().finite().nonnegative(),
  includeInRetirementPlan: z.boolean(),
});

const cashFlowSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(100),
  type: z.enum(['INCOME', 'EXPENSE']),
  annualAmount: z.number().finite().nonnegative(),
});

const goalSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(100),
  targetAmount: z.number().finite().positive(),
  targetYear: z.number().int().min(2025).max(2200),
});

const assumptionsSchema = z.object({
  expectedReturn: z.number().min(0.01).max(0.3),
  inflationRate: z.number().min(0).max(0.2),
  volatility: z.number().min(0.01).max(0.6),
  retirementSpendingRatio: z.number().min(0.25).max(1.5),
  simulationsCount: z.number().int().min(50).max(20000),
});

export const householdWorkspaceSchema = z.object({
  version: z.literal(1),
  profile: profileSchema,
  accounts: z.array(accountSchema).max(100),
  cashFlows: z.array(cashFlowSchema).max(100),
  goals: z.array(goalSchema).max(50),
  assumptions: assumptionsSchema,
  updatedAt: z.string().datetime(),
});

export const ACCOUNT_LABELS: Record<AccountType, string> = {
  CASH: 'Cash', BROKERAGE: 'Brokerage', RETIREMENT: 'Retirement account',
  REAL_ESTATE: 'Real estate', OTHER_ASSET: 'Other asset', MORTGAGE: 'Mortgage',
  STUDENT_LOAN: 'Student loan', CREDIT_CARD: 'Credit card', OTHER_LIABILITY: 'Other liability',
};

export const ACCOUNT_TYPES = accountTypes;

function isLiability(account: FinancialAccount): boolean {
  return ['MORTGAGE', 'STUDENT_LOAN', 'CREDIT_CARD', 'OTHER_LIABILITY'].includes(account.type);
}

export function summarizeHousehold(workspace: HouseholdWorkspace): HouseholdSummary {
  const totalAssets = workspace.accounts
    .filter(account => !isLiability(account))
    .reduce((sum, account) => sum + account.balance, 0);
  const totalLiabilities = workspace.accounts
    .filter(isLiability)
    .reduce((sum, account) => sum + account.balance, 0);
  const investableAssets = workspace.accounts
    .filter(account => !isLiability(account) && account.includeInRetirementPlan)
    .reduce((sum, account) => sum + account.balance, 0);
  const annualIncome = workspace.cashFlows
    .filter(item => item.type === 'INCOME')
    .reduce((sum, item) => sum + item.annualAmount, 0);
  const annualExpenses = workspace.cashFlows
    .filter(item => item.type === 'EXPENSE')
    .reduce((sum, item) => sum + item.annualAmount, 0);
  const goalTargetTotal = workspace.goals.reduce((sum, goal) => sum + goal.targetAmount, 0);

  return {
    totalAssets, totalLiabilities, netWorth: totalAssets - totalLiabilities,
    investableAssets, annualIncome, annualExpenses,
    annualSurplus: annualIncome - annualExpenses, goalTargetTotal,
  };
}

export function deriveBaselineSimulationParams(workspace: HouseholdWorkspace): SimulationParams {
  const summary = summarizeHousehold(workspace);
  const assumptions: PlanningAssumptions = workspace.assumptions;
  return {
    currentAge: workspace.profile.currentAge,
    retirementAge: workspace.profile.retirementAge,
    maxAge: workspace.profile.longevityAge,
    initialCapital: summary.investableAssets,
    annualSavings: Math.max(0, summary.annualSurplus),
    retirementAnnualExpense: Math.max(1, summary.annualExpenses * assumptions.retirementSpendingRatio),
    expectedReturn: assumptions.expectedReturn,
    inflationRate: assumptions.inflationRate,
    volatility: assumptions.volatility,
    simulationsCount: assumptions.simulationsCount,
  };
}

export function createDemoHouseholdWorkspace(): HouseholdWorkspace {
  return {
    version: 1,
    profile: {
      householdName: 'My household', jurisdiction: 'US', currency: 'USD',
      currentAge: 32, retirementAge: 60, longevityAge: 95,
    },
    accounts: [
      { id: 'cash', name: 'Emergency cash', type: 'CASH', balance: 60000, includeInRetirementPlan: true },
      { id: 'brokerage', name: 'Brokerage portfolio', type: 'BROKERAGE', balance: 240000, includeInRetirementPlan: true },
      { id: 'retirement', name: 'Retirement account', type: 'RETIREMENT', balance: 180000, includeInRetirementPlan: true },
      { id: 'mortgage', name: 'Home mortgage', type: 'MORTGAGE', balance: 320000, includeInRetirementPlan: false },
    ],
    cashFlows: [
      { id: 'income', name: 'Employment income', type: 'INCOME', annualAmount: 220000 },
      { id: 'living', name: 'Living expenses', type: 'EXPENSE', annualAmount: 100000 },
      { id: 'housing', name: 'Housing and debt service', type: 'EXPENSE', annualAmount: 38000 },
    ],
    goals: [{ id: 'retirement-goal', name: 'Retirement readiness', targetAmount: 2500000, targetYear: 2054 }],
    assumptions: { expectedReturn: 0.07, inflationRate: 0.025, volatility: 0.14, retirementSpendingRatio: 0.8, simulationsCount: 10000 },
    updatedAt: new Date().toISOString(),
  };
}

export function validateHouseholdWorkspace(value: unknown): HouseholdWorkspace | null {
  const result = householdWorkspaceSchema.safeParse(value);
  return result.success ? result.data : null;
}

export type HouseholdDraft = Pick<HouseholdWorkspace, 'profile' | 'accounts' | 'cashFlows' | 'goals' | 'assumptions'>;
export type HouseholdItem = FinancialAccount | AnnualCashFlow | FinancialGoal;
