import { useState, useEffect, useCallback } from 'react';
import type { YieldPool, UseApiResult } from '../types/yield';

const DEFILLAMA_YIELDS_API = 'https://yields.llama.fi/pools';
const YIELD_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Token addresses (Ethereum mainnet)
const TOKENS = {
  USDC: { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
  USDT: { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
  DAI: { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
} as const;

interface DefiLlamaPool {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apyBase?: number;
  apyReward?: number;
  apy: number;
  stablecoin?: boolean;
}

// Module-level cache (pattern from newsApi.ts)
interface YieldCache {
  data: YieldPool[];
  fetchedAt: number;
}
let yieldCache: YieldCache | null = null;
let pendingFetch: Promise<YieldPool[]> | null = null;

async function fetchYieldPoolsCached(): Promise<YieldPool[]> {
  const now = Date.now();

  // Return cached data if fresh
  if (yieldCache && now - yieldCache.fetchedAt < YIELD_CACHE_TTL_MS) {
    return yieldCache.data;
  }

  // Deduplicate concurrent requests
  if (!pendingFetch) {
    pendingFetch = fetchYieldPools()
      .then((data) => {
        yieldCache = { data, fetchedAt: Date.now() };
        pendingFetch = null;
        return data;
      })
      .catch((err) => {
        pendingFetch = null;
        throw err;
      });
  }

  return pendingFetch;
}

async function fetchYieldPools(): Promise<YieldPool[]> {
  const response = await fetch(DEFILLAMA_YIELDS_API);
  if (!response.ok) {
    throw new Error(`DeFi Llama API error: ${response.status}`);
  }

  const { data } = await response.json();

  // Filter for Aave V3 + Ethereum + our 3 stablecoins
  const filtered = (data as DefiLlamaPool[])
    .filter(p =>
      p.project === 'aave-v3' &&
      p.chain === 'Ethereum' &&
      ['USDC', 'USDT', 'DAI'].includes(p.symbol)
    )
    .map(p => ({
      id: p.pool,
      name: `Aave V3 ${p.symbol}`,
      symbol: p.symbol as keyof typeof TOKENS,
      apy: p.apy || ((p.apyBase || 0) + (p.apyReward || 0)),
      apyBase: p.apyBase || 0,
      apyReward: p.apyReward || 0,
      tvl: p.tvlUsd,
      chain: p.chain,
      protocol: p.project,
      tokenAddress: TOKENS[p.symbol as keyof typeof TOKENS].address,
      decimals: TOKENS[p.symbol as keyof typeof TOKENS].decimals,
    }))
    .sort((a, b) => b.apy - a.apy); // Sort by APY descending

  // Sanity check: reject APYs > 100% as likely errors
  return filtered.filter(p => p.apy <= 100);
}

// Standard hook interface (matches marketApi.ts pattern)
export function useAaveYields(): UseApiResult<YieldPool[]> {
  const [data, setData] = useState<YieldPool[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const pools = await fetchYieldPoolsCached();
      setData(pools);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to fetch Aave yields:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// Prefetch hook (call in App.tsx on mount)
export function prefetchAaveYields(): void {
  fetchYieldPoolsCached().catch(console.error);
}
