import { describe, expect, it } from 'vitest';
import {
  createDemoHouseholdWorkspace,
  summarizeEstate,
  summarizeTaxAllocation,
} from '@/lib/household';

describe('account-sourced tax and estate summaries', () => {
  it('groups only entered, included investment balances by tax category', () => {
    const workspace = createDemoHouseholdWorkspace();
    const allocation = summarizeTaxAllocation(workspace);

    expect(allocation).toEqual({
      taxable: 300000,
      taxDeferred: 120000,
      taxFree: 60000,
      totalClassifiedInvestments: 480000,
    });
  });

  it('uses entered assets and liabilities without assumed growth or probate costs', () => {
    const workspace = createDemoHouseholdWorkspace();
    const estate = summarizeEstate(workspace);

    expect(estate).toEqual({
      enteredAssets: 480000,
      enteredLiabilities: 320000,
      indicativeNetEstate: 160000,
    });
  });
});
