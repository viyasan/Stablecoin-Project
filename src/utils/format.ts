/**
 * Formatting utilities for displaying currency and percentage values
 */

/**
 * Formats a number in billions/trillions/millions with appropriate suffix
 * Used for treasury holdings display
 */
export function formatBillions(value: number): string {
  if (value === 0) return '$0';

  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (value >= 1_000_000_000) {
    return `$${Math.round(value / 1_000_000_000)}B`;
  }

  if (value >= 1_000_000) {
    return `$${Math.round(value / 1_000_000)}M`;
  }

  return `$${Math.round(value)}`;
}

/**
 * Formats currency with one decimal place and appropriate suffix
 * Used for market cap and KPI displays
 */
export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(1)}T`;
  }

  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }

  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }

  return `$${Math.round(value)}`;
}

/**
 * Formats a percentage with sign prefix
 * Positive numbers get + prefix, negative get - prefix, zero gets no prefix
 */
export function formatPercentage(value: number): string {
  if (value === 0) {
    return '0.00%';
  }

  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}
