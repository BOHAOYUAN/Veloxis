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
  annualSavings: z.number().nonnegative('Annual savings cannot be negative'),
  retirementAnnualExpense: z.number().positive('Retirement expense must be greater than 0'),
  expectedReturn: z.number().min(0.01, 'Return must be at least 1%').max(0.30, 'Return cannot exceed 30%'),
  inflationRate: z.number().min(0.0, 'Inflation cannot be negative').max(0.20, 'Inflation cannot exceed 20%'),
  volatility: z.number().min(0.01, 'Volatility must be positive').max(0.60, 'Volatility capped at 60%'),
  simulationsCount: z.number().int().min(50).max(20000).default(1000),
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

/**
 * Conversational AI Entity Extraction Output Schema
 */
export const aiEntityExtractionSchema = z.object({
  currentAge: z.number().nullable().optional(),
  retirementAge: z.number().nullable().optional(),
  initialCapital: z.number().nullable().optional(),
  annualSavings: z.number().nullable().optional(),
  retirementAnnualExpense: z.number().nullable().optional(),
  expectedReturn: z.number().nullable().optional(),
  inflationRate: z.number().nullable().optional(),
  volatility: z.number().nullable().optional(),
  confidence: z.number().min(0).max(1).default(0.95),
  extractedSummary: z.string(),
  advisorNotes: z.array(z.string()).default([]),
});

export type AIEntityExtraction = z.infer<typeof aiEntityExtractionSchema>;
