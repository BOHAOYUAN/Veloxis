import { describe, expect, it } from 'vitest';
import {
  createDemoHouseholdWorkspace,
  deriveBaselineSimulationParams,
  migrateHouseholdWorkspace,
  summarizeHousehold,
} from '@/lib/household';
import { parseStoredWorkspace } from '@/hooks/useHouseholdWorkspace';

describe('household workspace', () => {
  it('derives current household totals and baseline simulation inputs', () => {
    const workspace = createDemoHouseholdWorkspace();
    const summary = summarizeHousehold(workspace);
    const params = deriveBaselineSimulationParams(workspace);

    expect(summary.totalAssets).toBe(480000);
    expect(summary.totalLiabilities).toBe(320000);
    expect(summary.netWorth).toBe(160000);
    expect(summary.investableAssets).toBe(480000);
    expect(summary.annualSurplus).toBe(82000);
    expect(params.initialCapital).toBe(480000);
    expect(params.annualSavings).toBe(82000);
    expect(params.retirementAnnualExpense).toBe(110400);
    expect(params.annualSocialSecurity).toBe(36000);
    expect(params.goals).toEqual([{ name: 'Family education support', age: 50, amount: 120000 }]);
  });

  it('provides two valid and distinct guided synthetic demo cases', () => {
    const first = createDemoHouseholdWorkspace('accumulator');
    const second = createDemoHouseholdWorkspace('retirement-window');

    expect(migrateHouseholdWorkspace(first)).toEqual(first);
    expect(migrateHouseholdWorkspace(second)).toEqual(second);
    expect(second.profile.currentAge).toBe(57);
    expect(second.assumptions.randomSeed).not.toBe(first.assumptions.randomSeed);
    expect(second.profile.householdName).not.toBe(first.profile.householdName);
  });

  it('rejects invalid planning timelines', () => {
    const workspace = createDemoHouseholdWorkspace();
    workspace.profile.retirementAge = workspace.profile.currentAge;

    expect(migrateHouseholdWorkspace(workspace)).toBeNull();
  });

  it('migrates a V1 workspace without losing entered balances and cash flows', () => {
    const legacy = {
      version: 1,
      profile: {
        householdName: 'Legacy household', jurisdiction: 'US', currency: 'USD',
        currentAge: 40, retirementAge: 65, longevityAge: 90,
      },
      accounts: [{ id: 'a', name: 'IRA', type: 'RETIREMENT', balance: 250000, includeInRetirementPlan: true }],
      cashFlows: [{ id: 'i', name: 'Salary', type: 'INCOME', annualAmount: 150000 }],
      goals: [{ id: 'g', name: 'Goal', targetAmount: 50000, targetYear: new Date().getFullYear() + 10 }],
      assumptions: {
        expectedReturn: 0.07, inflationRate: 0.025, volatility: 0.14,
        retirementSpendingRatio: 0.8, simulationsCount: 1000,
      },
      updatedAt: new Date().toISOString(),
    };
    const migrated = migrateHouseholdWorkspace(legacy);

    expect(migrated?.version).toBe(2);
    expect(migrated?.accounts[0]).toMatchObject({ balance: 250000, taxCategory: 'taxDeferred' });
    expect(migrated?.cashFlows[0]).toMatchObject({ startAge: 40, endAge: 64, inflationCategory: 'general' });
    expect(migrated?.goals[0].targetAge).toBe(50);
    expect(migrated?.assumptions.randomSeed).toBe(20260904);
  });

  it('round-trips a V2 workspace through browser-storage JSON', () => {
    const workspace = createDemoHouseholdWorkspace();
    const restored = parseStoredWorkspace(JSON.stringify(workspace));

    expect(restored).toEqual(workspace);
    expect(parseStoredWorkspace('{invalid')).toBeNull();
  });
});
