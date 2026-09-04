import { z } from 'zod';
import {
  AccountType,
  EstateSummary,
  FinancialAccount,
  HouseholdSummary,
  HouseholdWorkspace,
  TaxAllocationSummary,
  TaxCategory,
} from '@/types/household';
import { PlanScenario, SimulationParams } from '@/types/financial';

const accountTypes: [AccountType, ...AccountType[]] = [
  'CASH', 'BROKERAGE', 'RETIREMENT', 'REAL_ESTATE', 'OTHER_ASSET',
  'MORTGAGE', 'STUDENT_LOAN', 'CREDIT_CARD', 'OTHER_LIABILITY',
];
const taxCategories: [TaxCategory, ...TaxCategory[]] = [
  'taxable', 'taxDeferred', 'taxFree', 'nonInvestment',
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

const legacyAccountSchema = z.object({
  id: z.string().min(1), name: z.string(), type: z.enum(accountTypes),
  balance: z.number().finite().nonnegative(), includeInRetirementPlan: z.boolean(),
});
const accountSchema = legacyAccountSchema.extend({ taxCategory: z.enum(taxCategories) });
const legacyCashFlowSchema = z.object({
  id: z.string().min(1), name: z.string(), type: z.enum(['INCOME', 'EXPENSE']),
  annualAmount: z.number().finite().nonnegative(),
});
const cashFlowSchema = legacyCashFlowSchema.extend({
  startAge: z.number().int().min(18).max(115),
  endAge: z.number().int().min(18).max(115),
  inflationCategory: z.enum(['none', 'general']),
}).refine(flow => flow.endAge >= flow.startAge, {
  message: 'Cash flow end age must not precede its start age', path: ['endAge'],
});
const legacyGoalSchema = z.object({
  id: z.string().min(1), name: z.string(), targetAmount: z.number().positive(),
  targetYear: z.number().int().min(2025).max(2200),
});
const goalSchema = z.object({
  id: z.string().min(1), name: z.string().trim().min(1).max(100),
  targetAmount: z.number().finite().positive(), targetAge: z.number().int().min(18).max(115),
});
const legacyAssumptionsSchema = z.object({
  expectedReturn: z.number(), inflationRate: z.number(), volatility: z.number(),
  retirementSpendingRatio: z.number(), simulationsCount: z.number().int(),
});
const assumptionsSchema = legacyAssumptionsSchema.extend({
  expectedReturn: z.number().min(0.01).max(0.3),
  inflationRate: z.number().min(0).max(0.2),
  volatility: z.number().min(0.01).max(0.6),
  retirementSpendingRatio: z.number().min(0.25).max(1.5),
  simulationsCount: z.number().int().min(50).max(20000),
  randomSeed: z.number().int().min(1).max(2147483646),
});
const proposedPlanSchema = z.object({
  retirementAge: z.number().int().min(30).max(90),
  annualSavings: z.number().nonnegative(),
  retirementAnnualExpense: z.number().positive(),
  socialSecurityClaimAge: z.number().int().min(62).max(70),
});

export const householdWorkspaceSchema = z.object({
  version: z.literal(2),
  profile: profileSchema,
  accounts: z.array(accountSchema).max(100),
  cashFlows: z.array(cashFlowSchema).max(100),
  goals: z.array(goalSchema).max(50),
  socialSecurity: z.object({
    annualBenefit: z.number().finite().nonnegative(),
    claimAge: z.number().int().min(62).max(70),
  }),
  assumptions: assumptionsSchema,
  proposedPlan: proposedPlanSchema,
  updatedAt: z.string().datetime(),
}).refine(value => value.proposedPlan.retirementAge > value.profile.currentAge, {
  message: 'Proposed retirement age must be greater than current age',
  path: ['proposedPlan', 'retirementAge'],
}).refine(value => value.proposedPlan.retirementAge < value.profile.longevityAge, {
  message: 'Proposed retirement age must precede the plan end age',
  path: ['proposedPlan', 'retirementAge'],
});

const legacyWorkspaceSchema = z.object({
  version: z.literal(1),
  profile: profileSchema,
  accounts: z.array(legacyAccountSchema).max(100),
  cashFlows: z.array(legacyCashFlowSchema).max(100),
  goals: z.array(legacyGoalSchema).max(50),
  assumptions: legacyAssumptionsSchema,
  updatedAt: z.string().datetime(),
});

export const ACCOUNT_LABELS: Record<AccountType, string> = {
  CASH: 'Cash', BROKERAGE: 'Brokerage', RETIREMENT: 'Retirement account',
  REAL_ESTATE: 'Real estate', OTHER_ASSET: 'Other asset', MORTGAGE: 'Mortgage',
  STUDENT_LOAN: 'Student loan', CREDIT_CARD: 'Credit card', OTHER_LIABILITY: 'Other liability',
};
export const TAX_CATEGORY_LABELS: Record<TaxCategory, string> = {
  taxable: 'Taxable', taxDeferred: 'Tax-deferred', taxFree: 'Tax-free',
  nonInvestment: 'Non-investment',
};
export const ACCOUNT_TYPES = accountTypes;
export const TAX_CATEGORIES = taxCategories;

export function isLiability(account: FinancialAccount): boolean {
  return ['MORTGAGE', 'STUDENT_LOAN', 'CREDIT_CARD', 'OTHER_LIABILITY'].includes(account.type);
}

function activeAtAge(startAge: number, endAge: number, age: number): boolean {
  return age >= startAge && age <= endAge;
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
  const currentCashFlows = workspace.cashFlows.filter(flow => activeAtAge(
    flow.startAge, flow.endAge, workspace.profile.currentAge,
  ));
  const annualIncome = currentCashFlows
    .filter(item => item.type === 'INCOME')
    .reduce((sum, item) => sum + item.annualAmount, 0);
  const annualExpenses = currentCashFlows
    .filter(item => item.type === 'EXPENSE')
    .reduce((sum, item) => sum + item.annualAmount, 0);
  const goalTargetTotal = workspace.goals.reduce((sum, goal) => sum + goal.targetAmount, 0);

  return {
    totalAssets,
    totalLiabilities,
    netWorth: totalAssets - totalLiabilities,
    investableAssets,
    annualIncome,
    annualExpenses,
    annualSurplus: annualIncome - annualExpenses,
    goalTargetTotal,
  };
}

export function summarizeTaxAllocation(workspace: HouseholdWorkspace): TaxAllocationSummary {
  const included = workspace.accounts.filter(account => (
    account.includeInRetirementPlan && !isLiability(account)
  ));
  const balanceFor = (category: TaxCategory) => included
    .filter(account => account.taxCategory === category)
    .reduce((sum, account) => sum + account.balance, 0);
  const taxable = balanceFor('taxable');
  const taxDeferred = balanceFor('taxDeferred');
  const taxFree = balanceFor('taxFree');
  return {
    taxable,
    taxDeferred,
    taxFree,
    totalClassifiedInvestments: taxable + taxDeferred + taxFree,
  };
}

export function summarizeEstate(workspace: HouseholdWorkspace): EstateSummary {
  const enteredAssets = workspace.accounts
    .filter(account => !isLiability(account))
    .reduce((sum, account) => sum + account.balance, 0);
  const enteredLiabilities = workspace.accounts
    .filter(isLiability)
    .reduce((sum, account) => sum + account.balance, 0);
  return {
    enteredAssets,
    enteredLiabilities,
    indicativeNetEstate: Math.max(0, enteredAssets - enteredLiabilities),
  };
}

export function deriveBaselineSimulationParams(workspace: HouseholdWorkspace): SimulationParams {
  const summary = summarizeHousehold(workspace);
  return {
    currentAge: workspace.profile.currentAge,
    retirementAge: workspace.profile.retirementAge,
    maxAge: workspace.profile.longevityAge,
    initialCapital: summary.investableAssets,
    annualIncome: summary.annualIncome,
    annualSavings: Math.max(0, summary.annualSurplus),
    baselineAnnualSavings: Math.max(0, summary.annualSurplus),
    retirementAnnualExpense: Math.max(
      1, summary.annualExpenses * workspace.assumptions.retirementSpendingRatio,
    ),
    annualSocialSecurity: workspace.socialSecurity.annualBenefit,
    socialSecurityClaimAge: workspace.socialSecurity.claimAge,
    expectedReturn: workspace.assumptions.expectedReturn,
    inflationRate: workspace.assumptions.inflationRate,
    volatility: workspace.assumptions.volatility,
    simulationsCount: workspace.assumptions.simulationsCount,
    randomSeed: workspace.assumptions.randomSeed,
    cashFlows: workspace.cashFlows.map(flow => ({
      name: flow.name,
      type: flow.type,
      annualAmount: flow.annualAmount,
      startAge: flow.startAge,
      endAge: flow.endAge,
      inflationCategory: flow.inflationCategory,
    })),
    goals: workspace.goals.map(goal => ({
      name: goal.name,
      age: goal.targetAge,
      amount: goal.targetAmount,
    })),
  };
}

export function derivePlanScenarios(workspace: HouseholdWorkspace): {
  current: PlanScenario;
  proposed: PlanScenario;
} {
  const currentParams = deriveBaselineSimulationParams(workspace);
  return {
    current: {
      id: 'current', name: 'Current Plan', params: currentParams,
      updatedAt: workspace.updatedAt,
    },
    proposed: {
      id: 'proposed', name: 'Proposed Plan',
      params: {
        ...currentParams,
        retirementAge: workspace.proposedPlan.retirementAge,
        annualSavings: workspace.proposedPlan.annualSavings,
        retirementAnnualExpense: workspace.proposedPlan.retirementAnnualExpense,
        socialSecurityClaimAge: workspace.proposedPlan.socialSecurityClaimAge,
      },
      updatedAt: workspace.updatedAt,
    },
  };
}

export function createProposedPlanFromCurrent(workspace: HouseholdWorkspace): HouseholdWorkspace['proposedPlan'] {
  const current = deriveBaselineSimulationParams(workspace);
  return {
    retirementAge: current.retirementAge,
    annualSavings: current.annualSavings,
    retirementAnnualExpense: current.retirementAnnualExpense,
    socialSecurityClaimAge: current.socialSecurityClaimAge,
  };
}

function defaultTaxCategory(type: AccountType): TaxCategory {
  if (type === 'RETIREMENT') return 'taxDeferred';
  if (type === 'CASH' || type === 'BROKERAGE') return 'taxable';
  return 'nonInvestment';
}

export function migrateHouseholdWorkspace(value: unknown): HouseholdWorkspace | null {
  const current = householdWorkspaceSchema.safeParse(value);
  if (current.success) return current.data;

  const legacy = legacyWorkspaceSchema.safeParse(value);
  if (!legacy.success) return null;
  const old = legacy.data;
  const currentYear = new Date().getFullYear();
  const migratedBase: HouseholdWorkspace = {
    version: 2,
    profile: old.profile,
    accounts: old.accounts.map(account => ({
      ...account, taxCategory: defaultTaxCategory(account.type),
    })),
    cashFlows: old.cashFlows.map(flow => ({
      ...flow,
      startAge: old.profile.currentAge,
      endAge: flow.type === 'INCOME' ? old.profile.retirementAge - 1 : old.profile.longevityAge,
      inflationCategory: 'general' as const,
    })),
    goals: old.goals.map(goal => ({
      id: goal.id,
      name: goal.name,
      targetAmount: goal.targetAmount,
      targetAge: Math.max(
        old.profile.currentAge,
        Math.min(old.profile.longevityAge, old.profile.currentAge + goal.targetYear - currentYear),
      ),
    })),
    socialSecurity: { annualBenefit: 0, claimAge: 67 },
    assumptions: { ...old.assumptions, randomSeed: 20260904 },
    proposedPlan: {
      retirementAge: old.profile.retirementAge,
      annualSavings: 0,
      retirementAnnualExpense: 1,
      socialSecurityClaimAge: 67,
    },
    updatedAt: old.updatedAt,
  };
  migratedBase.proposedPlan = createProposedPlanFromCurrent(migratedBase);
  const result = householdWorkspaceSchema.safeParse(migratedBase);
  return result.success ? result.data : null;
}

export const validateHouseholdWorkspace = migrateHouseholdWorkspace;

export function createDemoHouseholdWorkspace(): HouseholdWorkspace {
  return {
    version: 2,
    profile: {
      householdName: 'My household', jurisdiction: 'US', currency: 'USD',
      currentAge: 32, retirementAge: 60, longevityAge: 95,
    },
    accounts: [
      { id: 'cash', name: 'Emergency cash', type: 'CASH', taxCategory: 'taxable', balance: 60000, includeInRetirementPlan: true },
      { id: 'brokerage', name: 'Brokerage portfolio', type: 'BROKERAGE', taxCategory: 'taxable', balance: 240000, includeInRetirementPlan: true },
      { id: 'retirement', name: 'Traditional retirement', type: 'RETIREMENT', taxCategory: 'taxDeferred', balance: 120000, includeInRetirementPlan: true },
      { id: 'roth', name: 'Roth retirement', type: 'RETIREMENT', taxCategory: 'taxFree', balance: 60000, includeInRetirementPlan: true },
      { id: 'mortgage', name: 'Home mortgage', type: 'MORTGAGE', taxCategory: 'nonInvestment', balance: 320000, includeInRetirementPlan: false },
    ],
    cashFlows: [
      { id: 'income', name: 'Employment income', type: 'INCOME', annualAmount: 220000, startAge: 32, endAge: 59, inflationCategory: 'general' },
      { id: 'living', name: 'Living expenses', type: 'EXPENSE', annualAmount: 100000, startAge: 32, endAge: 95, inflationCategory: 'general' },
      { id: 'housing', name: 'Housing and debt service', type: 'EXPENSE', annualAmount: 38000, startAge: 32, endAge: 59, inflationCategory: 'none' },
    ],
    goals: [
      { id: 'education-goal', name: 'Family education support', targetAmount: 120000, targetAge: 50 },
    ],
    socialSecurity: { annualBenefit: 36000, claimAge: 67 },
    assumptions: {
      expectedReturn: 0.07, inflationRate: 0.025, volatility: 0.14,
      retirementSpendingRatio: 0.8, simulationsCount: 10000, randomSeed: 20260904,
    },
    proposedPlan: {
      retirementAge: 63,
      annualSavings: 90000,
      retirementAnnualExpense: 95000,
      socialSecurityClaimAge: 67,
    },
    updatedAt: new Date().toISOString(),
  };
}
