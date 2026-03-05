export interface StablecoinYieldPool {
  pool: string;              // DeFiLlama UUID
  chain: string;             // "Ethereum", "Arbitrum", etc.
  project: string;           // "aave-v3", "compound-v3", etc.
  symbol: string;            // "USDC", "USDT", etc.
  tvlUsd: number;            // TVL in USD
  apy: number;               // Total APY
  apyBase: number | null;    // Base lending APY
  apyReward: number | null;  // Reward incentive APY
  poolMeta: string | null;   // e.g. "v3"
}

export interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
