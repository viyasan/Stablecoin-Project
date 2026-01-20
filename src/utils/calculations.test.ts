import { describe, it, expect } from 'vitest';
import {
  calculateTreasuryHoldings,
  calculateReserveAmount,
  calculateGovernmentExposure,
} from './calculations';

describe('calculateTreasuryHoldings', () => {
  it('calculates USDT treasury holdings (78% of market cap)', () => {
    const marketCap = 143_000_000_000; // $143B
    const percentage = 78;
    const result = calculateTreasuryHoldings(marketCap, percentage);
    expect(result).toBe(111_540_000_000); // $111.54B
  });

  it('calculates USDC treasury holdings (32% of market cap)', () => {
    const marketCap = 52_000_000_000; // $52B
    const percentage = 32;
    const result = calculateTreasuryHoldings(marketCap, percentage);
    expect(result).toBe(16_640_000_000); // $16.64B
  });

  it('handles zero market cap', () => {
    expect(calculateTreasuryHoldings(0, 78)).toBe(0);
  });

  it('handles zero percentage', () => {
    expect(calculateTreasuryHoldings(100_000_000_000, 0)).toBe(0);
  });
});

describe('calculateReserveAmount', () => {
  it('calculates reserve amount from percentage', () => {
    const marketCap = 143_000_000_000;
    const percentage = 11; // Reverse repos
    const result = calculateReserveAmount(marketCap, percentage);
    expect(result).toBe(15_730_000_000);
  });

  it('returns correct amounts for all USDT reserve categories', () => {
    const marketCap = 143_000_000_000;
    const reserves = {
      treasuries: calculateReserveAmount(marketCap, 78),
      repos: calculateReserveAmount(marketCap, 11),
      gold: calculateReserveAmount(marketCap, 7),
      bitcoin: calculateReserveAmount(marketCap, 6),
    };

    expect(reserves.treasuries).toBeCloseTo(111_540_000_000, -6);
    expect(reserves.repos).toBeCloseTo(15_730_000_000, -6);
    expect(reserves.gold).toBeCloseTo(10_010_000_000, -6);
    expect(reserves.bitcoin).toBeCloseTo(8_580_000_000, -6);
  });
});

describe('calculateGovernmentExposure', () => {
  it('calculates USDT government exposure (treasuries + repos)', () => {
    const treasuryPct = 78;
    const repoPct = 11;
    expect(calculateGovernmentExposure(treasuryPct, repoPct)).toBe(89);
  });

  it('calculates USDC government exposure', () => {
    const treasuryPct = 32;
    const repoPct = 53;
    expect(calculateGovernmentExposure(treasuryPct, repoPct)).toBe(85);
  });
});
