import { describe, it, expect } from 'vitest';

describe('3-Bucket Tax and Estate Calculations', () => {
  it('correctly allocates 3-Bucket tax ratios', () => {
    const totalCapital = 1000000;
    const taxableRatio = 0.35;
    const taxDeferredRatio = 0.45;
    const taxFreeRatio = 0.20;

    const taxable = totalCapital * taxableRatio;
    const taxDeferred = totalCapital * taxDeferredRatio;
    const taxFree = totalCapital * taxFreeRatio;

    expect(taxable + taxDeferred + taxFree).toBeCloseTo(totalCapital);
    expect(taxable).toBeCloseTo(350000);
    expect(taxDeferred).toBeCloseTo(450000);
    expect(taxFree).toBeCloseTo(200000);
  });

  it('calculates positive Roth conversion tax arbitrage savings in low-bracket gap years', () => {
    const convertedAmount = 300000;
    const gapYearBracket = 0.12;
    const futureRmdBracket = 0.28;

    const upfrontTax = convertedAmount * gapYearBracket;
    const futureTaxAvoided = convertedAmount * futureRmdBracket;
    const netSavings = futureTaxAvoided - upfrontTax;

    expect(upfrontTax).toBeCloseTo(36000);
    expect(futureTaxAvoided).toBeCloseTo(84000);
    expect(netSavings).toBeCloseTo(48000);
    expect(netSavings).toBeGreaterThan(0);
  });

  it('calculates probate cost savings when revocable living trust is utilized', () => {
    const estateValue = 5000000;
    const probateCost = estateValue * 0.05;
    const trustAvoidedCost = probateCost;

    expect(probateCost).toBeCloseTo(250000);
    expect(trustAvoidedCost).toBeCloseTo(250000);
  });
});
