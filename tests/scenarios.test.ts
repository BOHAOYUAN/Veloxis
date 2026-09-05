import { describe, expect, it } from 'vitest';
import { createDemoHouseholdWorkspace, derivePlanScenarios } from '@/lib/household';
import { comparePlanScenarios } from '@/lib/scenarios';

describe('Current and Proposed plan comparison', () => {
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
