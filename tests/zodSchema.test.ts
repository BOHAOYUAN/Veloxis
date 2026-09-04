import { describe, it, expect } from 'vitest';
import { simulationParamsSchema } from '../src/schemas/financialSchema';

describe('Zod Schema Validation', () => {
  
  it('Validates correct simulation parameters', () => {
    const valid = {
      currentAge: 25,
      retirementAge: 60,
      maxAge: 95,
      initialCapital: 500000,
      annualIncome: 200000,
      annualSavings: 100000,
      baselineAnnualSavings: 100000,
      retirementAnnualExpense: 150000,
      annualSocialSecurity: 30000,
      socialSecurityClaimAge: 67,
      expectedReturn: 0.08,
      inflationRate: 0.03,
      volatility: 0.15,
      simulationsCount: 500,
      randomSeed: 42,
      cashFlows: [],
      goals: [],
    };

    const parsed = simulationParamsSchema.parse(valid);
    expect(parsed.currentAge).toBe(25);
    expect(parsed.retirementAge).toBe(60);
  });

  it('Rejects invalid parameters where retirementAge <= currentAge', () => {
    const invalid = {
      currentAge: 50,
      retirementAge: 40,
      maxAge: 95,
      initialCapital: 500000,
      annualIncome: 200000,
      annualSavings: 100000,
      baselineAnnualSavings: 100000,
      retirementAnnualExpense: 150000,
      annualSocialSecurity: 30000,
      socialSecurityClaimAge: 67,
      expectedReturn: 0.08,
      inflationRate: 0.03,
      volatility: 0.15,
      simulationsCount: 500,
      randomSeed: 42,
      cashFlows: [],
      goals: [],
    };

    expect(() => simulationParamsSchema.parse(invalid)).toThrow();
  });

});
