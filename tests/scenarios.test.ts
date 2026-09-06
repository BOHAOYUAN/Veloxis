import { describe, expect, it } from 'vitest';
import { createDemoHouseholdWorkspace, createProposedPlanFromCurrent, derivePlanScenarios, householdWorkspaceSchema } from '@/lib/household';
import { runDeterministicProjection } from '@/lib/engine/monteCarlo';
import { comparePlanScenarios } from '@/lib/scenarios';

describe('Current and Proposed plan comparison', () => {
  it.each(['accumulator', 'retirement-window'] as const)('resets %s through the actual proposal clone operation', caseId => {
    const workspace = createDemoHouseholdWorkspace(caseId);
    workspace.assumptions.simulationsCount = 50;
    workspace.proposedPlan = createProposedPlanFromCurrent(workspace);
    const scenarios = derivePlanScenarios(workspace);
    const result = comparePlanScenarios(scenarios.current, scenarios.proposed);
    expect(result.current.yearlyDistributions).toEqual(result.proposed.yearlyDistributions);
    expect(result.successProbabilityDelta).toBe(0);
  });

  it.each([58, 65])('moves employment to retirement age %i while preserving independently dated income', retirementAge => {
    const workspace = createDemoHouseholdWorkspace('retirement-window');
    workspace.proposedPlan.retirementAge = retirementAge;
    workspace.cashFlows.push({ id: 'rent', name: 'Rental income', type: 'INCOME', annualAmount: 10000, startAge: 57, endAge: 70, inflationCategory: 'general' });
    const { proposed } = derivePlanScenarios(workspace);
    const ledger = runDeterministicProjection(proposed.params);
    expect(proposed.params.cashFlows.find(flow => flow.name === 'Employment income')?.endAge).toBe(retirementAge - 1);
    expect(proposed.params.cashFlows.find(flow => flow.name === 'Rental income')?.endAge).toBe(70);
    expect(ledger.find(year => year.age === retirementAge)?.earnedIncome).toBe(10000);
    expect(ledger.find(year => year.age === retirementAge)?.retirementExpenses).toBe(workspace.proposedPlan.retirementAnnualExpense);
  });

  it.each([58, 90])('keeps extreme proposal inputs finite at retirement age %i', retirementAge => {
    const workspace = createDemoHouseholdWorkspace('retirement-window');
    workspace.assumptions.simulationsCount = 50;
    workspace.proposedPlan = { retirementAge, annualSavings: retirementAge === 58 ? 0 : 300000, retirementAnnualExpense: retirementAge === 58 ? 300000 : 10000, socialSecurityClaimAge: retirementAge === 58 ? 62 : 70 };
    expect(householdWorkspaceSchema.safeParse(workspace).success).toBe(true);
    const scenarios = derivePlanScenarios(workspace);
    const result = comparePlanScenarios(scenarios.current, scenarios.proposed);
    expect(result.proposed.metrics.successProbabilityAtPlanEnd).toBeGreaterThanOrEqual(0);
    expect(result.proposed.metrics.successProbabilityAtPlanEnd).toBeLessThanOrEqual(1);
    for (const year of runDeterministicProjection(scenarios.proposed.params)) {
      expect(Number.isFinite(year.endingAssets)).toBe(true);
      expect(year.endingAssets).toBeGreaterThanOrEqual(0);
      expect(year.endingAssets).toBeCloseTo(year.openingAssets + year.investmentReturn + year.contributions - year.withdrawals);
    }
  });
  it('returns identical results for an unmodified clone', () => {
    const workspace = createDemoHouseholdWorkspace();
    const scenarios = derivePlanScenarios(workspace);
    scenarios.proposed.params = { ...scenarios.current.params };
    const comparison = comparePlanScenarios(scenarios.current, scenarios.proposed);

    expect(comparison.proposed.yearlyDistributions).toEqual(comparison.current.yearlyDistributions);
    expect(comparison.successProbabilityDelta).toBe(0);
    expect(comparison.medianEndingAssetDelta).toBe(0);
  });

  it('computes every delta from the two actual simulation results and inputs', () => {
    const workspace = createDemoHouseholdWorkspace();
    const scenarios = derivePlanScenarios(workspace);
    const comparison = comparePlanScenarios(scenarios.current, scenarios.proposed);

    expect(comparison.current.params.randomSeed).toBe(comparison.proposed.params.randomSeed);
    expect(comparison.successProbabilityDelta).toBe(
      comparison.proposed.metrics.successProbabilityAtPlanEnd
        - comparison.current.metrics.successProbabilityAtPlanEnd,
    );
    expect(comparison.retirementAgeDelta).toBe(
      comparison.proposed.params.retirementAge - comparison.current.params.retirementAge,
    );
    expect(comparison.retirementExpenseDelta).toBe(
      comparison.proposed.params.retirementAnnualExpense
        - comparison.current.params.retirementAnnualExpense,
    );
  });

  it('does not make a lower-spending plan look worse through random-path drift', () => {
    const workspace = createDemoHouseholdWorkspace();
    const scenarios = derivePlanScenarios(workspace);
    scenarios.proposed.params = {
      ...scenarios.current.params,
      retirementAnnualExpense: scenarios.current.params.retirementAnnualExpense - 20000,
    };
    const comparison = comparePlanScenarios(scenarios.current, scenarios.proposed);

    expect(comparison.proposed.metrics.successProbabilityAtPlanEnd)
      .toBeGreaterThanOrEqual(comparison.current.metrics.successProbabilityAtPlanEnd);
  });

  it('extends baseline employment income when the proposed retirement age is delayed', () => {
    const workspace = createDemoHouseholdWorkspace('retirement-window');
    const scenarios = derivePlanScenarios(workspace);
    const currentEmployment = scenarios.current.params.cashFlows.find(flow => flow.name === 'Employment income');
    const proposedEmployment = scenarios.proposed.params.cashFlows.find(flow => flow.name === 'Employment income');

    expect(currentEmployment?.endAge).toBe(61);
    expect(proposedEmployment?.endAge).toBe(64);
  });
});
