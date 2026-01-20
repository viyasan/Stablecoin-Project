import { describe, it, expect } from 'vitest';
import { formatBillions, formatCurrency, formatPercentage } from './format';

describe('formatBillions', () => {
  it('formats billions with B suffix', () => {
    expect(formatBillions(143_000_000_000)).toBe('$143B');
  });

  it('formats trillions with T suffix', () => {
    expect(formatBillions(1_180_000_000_000)).toBe('$1.18T');
  });

  it('formats millions with M suffix', () => {
    expect(formatBillions(500_000_000)).toBe('$500M');
  });

  it('handles zero', () => {
    expect(formatBillions(0)).toBe('$0');
  });

  it('rounds to whole numbers for billions', () => {
    expect(formatBillions(143_500_000_000)).toBe('$144B');
  });
});

describe('formatCurrency', () => {
  it('formats large numbers with B suffix', () => {
    expect(formatCurrency(310_290_000_000)).toBe('$310.3B');
  });

  it('formats trillions correctly', () => {
    expect(formatCurrency(1_500_000_000_000)).toBe('$1.5T');
  });

  it('formats millions correctly', () => {
    expect(formatCurrency(45_600_000)).toBe('$45.6M');
  });

  it('formats thousands correctly', () => {
    expect(formatCurrency(1_500)).toBe('$1.5K');
  });

  it('handles small numbers without suffix', () => {
    expect(formatCurrency(500)).toBe('$500');
  });
});

describe('formatPercentage', () => {
  it('formats positive percentages', () => {
    expect(formatPercentage(5.25)).toBe('+5.25%');
  });

  it('formats negative percentages', () => {
    expect(formatPercentage(-3.5)).toBe('-3.50%');
  });

  it('formats zero', () => {
    expect(formatPercentage(0)).toBe('0.00%');
  });

  it('handles very small numbers', () => {
    expect(formatPercentage(0.01)).toBe('+0.01%');
  });
});
