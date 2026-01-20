/**
 * Calculation utilities for stablecoin reserve and treasury data
 */

/**
 * Calculates treasury holdings from market cap and percentage
 * @param marketCap - Total market cap in raw numbers (e.g., 143000000000 for $143B)
 * @param percentage - Percentage of reserves held in treasuries (e.g., 78 for 78%)
 * @returns The dollar amount held in treasuries
 */
export function calculateTreasuryHoldings(
  marketCap: number,
  percentage: number
): number {
  return (percentage / 100) * marketCap;
}

/**
 * Calculates reserve amount from market cap and percentage
 * Alias for calculateTreasuryHoldings for semantic clarity
 * @param marketCap - Total market cap in raw numbers
 * @param percentage - Percentage of reserves in this category
 * @returns The dollar amount in this reserve category
 */
export function calculateReserveAmount(
  marketCap: number,
  percentage: number
): number {
  return (percentage / 100) * marketCap;
}

/**
 * Calculates total US government exposure from treasury and repo percentages
 * @param treasuryPercentage - Percentage held in US Treasuries
 * @param repoPercentage - Percentage held in Treasury repos/reverse repos
 * @returns Combined government exposure percentage
 */
export function calculateGovernmentExposure(
  treasuryPercentage: number,
  repoPercentage: number
): number {
  return treasuryPercentage + repoPercentage;
}
