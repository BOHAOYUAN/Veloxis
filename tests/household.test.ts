import { describe, expect, it } from 'vitest';
import {
  createDemoHouseholdWorkspace,
  deriveBaselineSimulationParams,
  summarizeHousehold,
  validateHouseholdWorkspace,
} from '@/lib/household';

describe('household workspace', () => {
  it('derives net worth and annual surplus from the financial inventory', () => {
    const workspace = createDemoHouseholdWorkspace();
    const summary = summarizeHousehold(workspace);

    expect(summary.totalAssets).toBe(480000);
    expect(summary.totalLiabilities).toBe(320000);
    expect(summary.netWorth).toBe(160000);
    expect(summary.investableAssets).toBe(480000);
    expect(summary.annualSurplus).toBe(82000);
  });

  it('maps household data into baseline simulation inputs without treating liabilities as investment capital', () => {
    const workspace = createDemoHouseholdWorkspace();
    const params = deriveBaselineSimulationParams(workspace);

    expect(params.initialCapital).toBe(480000);
    expect(params.annualSavings).toBe(82000);
    expect(params.retirementAnnualExpense).toBe(110400);
    expect(params.currentAge).toBe(32);
    expect(params.retirementAge).toBe(60);
  });

  it('rejects an invalid planning timeline when reading persisted workspace data', () => {
    const workspace = createDemoHouseholdWorkspace();
    workspace.profile.retirementAge = workspace.profile.currentAge;

    expect(validateHouseholdWorkspace(workspace)).toBeNull();
  });
});
