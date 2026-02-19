export interface YieldPool {
  id: string;
  name: string;        // "Aave V3 USDC"
  symbol: string;      // "USDC", "USDT", "DAI"
  apy: number;         // Annual percentage yield
  apyBase: number;     // Base APY from lending (borrower interest)
  apyReward: number;   // Reward APY from token incentives
  tvl: number;         // Total value locked (USD)
  chain: string;       // "Ethereum"
  protocol: string;    // "aave-v3"
  tokenAddress: string; // ERC20 contract address
  decimals: number;    // 6 for USDC/USDT, 18 for DAI
}

export interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
