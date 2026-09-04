import { z } from 'zod';

/**
 * Zod Defensive Validation Schema for Financial Simulation Inputs
 * Guarantees strict type safety and domain rule enforcement
 */
export const simulationParamsSchema = z.object({
  currentAge: z.number().int().min(18, 'Current age must be at least 18').max(80, 'Current age must be under 80'),
  retirementAge: z.number().int().min(30, 'Retirement age must be at least 30').max(90, 'Retirement age must be under 90'),
  maxAge: z.number().int().min(70).max(115).default(95),
  initialCapital: z.number().nonnegative('Initial capital cannot be negative'),
  annualIncome: z.number().nonnegative('Annual income cannot be negative'),
  annualSavings: z.number().nonnegative('Annual savings cannot be negative'),
  baselineAnnualSavings: z.number().nonnegative('Baseline annual savings cannot be negative'),
  retirementAnnualExpense: z.number().positive('Retirement expense must be greater than 0'),
  annualSocialSecurity: z.number().nonnegative('Social Security estimate cannot be negative'),
  socialSecurityClaimAge: z.number().int().min(62).max(70),
  expectedReturn: z.number().min(0.01, 'Return must be at least 1%').max(0.30, 'Return cannot exceed 30%'),
  inflationRate: z.number().min(0.0, 'Inflation cannot be negative').max(0.20, 'Inflation cannot exceed 20%'),
  volatility: z.number().min(0.01, 'Volatility must be positive').max(0.60, 'Volatility capped at 60%'),
  simulationsCount: z.number().int().min(50).max(20000).default(1000),
  randomSeed: z.number().int().min(1).max(2147483646),
  cashFlows: z.array(z.object({
    name: z.string().trim().min(1).max(100),
    type: z.enum(['INCOME', 'EXPENSE']),
    annualAmount: z.number().nonnegative(),
    startAge: z.number().int().min(18).max(115),
    endAge: z.number().int().min(18).max(115),
    inflationCategory: z.enum(['none', 'general']),
  }).refine(flow => flow.endAge >= flow.startAge)).max(100),
  goals: z.array(z.object({
    name: z.string().trim().min(1).max(100),
    age: z.number().int().min(18).max(115),
    amount: z.number().positive(),
  })).max(50).default([]),
  shockAge: z.number().int().optional(),
  shockExpense: z.number().nonnegative().optional(),
}).refine(data => data.retirementAge > data.currentAge, {
  message: 'Retirement age must be strictly greater than current age',
  path: ['retirementAge'],
}).refine(data => data.maxAge > data.retirementAge, {
  message: 'Max simulation age must be greater than retirement age',
  path: ['maxAge'],
});

export type ValidatedSimulationParams = z.infer<typeof simulationParamsSchema>;
