import { useState, useEffect, useCallback } from 'react';
import type { StablecoinYieldPool, UseApiResult } from '../types/yield';

const DEFILLAMA_YIELDS_API = 'https://yields.llama.fi/pools';
const YIELD_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

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
  exposure?: string;
  poolMeta?: string | null;
}

export interface StablecoinYieldsResult {
  data: StablecoinYieldPool[];
  chains: string[];
  tokens: string[];
}

interface StablecoinYieldCache {
  data: StablecoinYieldsResult;
  fetchedAt: number;
}
let stablecoinYieldCache: StablecoinYieldCache | null = null;
let stablecoinPendingFetch: Promise<StablecoinYieldsResult> | null = null;

async function fetchAllStablecoinYields(): Promise<StablecoinYieldsResult> {
  const response = await fetch(DEFILLAMA_YIELDS_API);
  if (!response.ok) {
    throw new Error(`DeFi Llama API error: ${response.status}`);
  }

  const { data: rawPools } = await response.json();

  const pools: StablecoinYieldPool[] = (rawPools as DefiLlamaPool[])
    .filter(p =>
      p.stablecoin === true &&
      p.exposure === 'single' &&
      p.tvlUsd >= 1_000_000 &&
      p.apy <= 100 &&
      p.apy > 0
    )
    .map(p => ({
      pool: p.pool,
      chain: p.chain,
      project: p.project,
      symbol: p.symbol,
      tvlUsd: p.tvlUsd,
      apy: p.apy,
      apyBase: p.apyBase ?? null,
      apyReward: p.apyReward ?? null,
      poolMeta: p.poolMeta ?? null,
    }))
    .sort((a, b) => b.tvlUsd - a.tvlUsd);

  // Top 10 chains by total TVL
  const chainTvl = new Map<string, number>();
  const tokenTvl = new Map<string, number>();
  for (const p of pools) {
    chainTvl.set(p.chain, (chainTvl.get(p.chain) || 0) + p.tvlUsd);
    tokenTvl.set(p.symbol, (tokenTvl.get(p.symbol) || 0) + p.tvlUsd);
  }
  const CHAIN_ALLOWLIST = [
    'Ethereum', 'Base', 'Solana', 'Arbitrum',
    'BSC', 'Tron', 'Avalanche', 'Hyperliquid L1',
  ];
  const chains = CHAIN_ALLOWLIST.filter(c => chainTvl.has(c));
  // Only show stablecoins that appear on the Overview page top 10
  const TOKEN_ALLOWLIST = [
    'USDT', 'USDC', 'USDS', 'USDE', 'USD1',
    'DAI', 'PYUSD', 'USDF',
    'USDG', 'RLUSD', 'USDD',
  ];
  const tokens = TOKEN_ALLOWLIST.filter(t => tokenTvl.has(t));

  return { data: pools, chains, tokens };
}

async function fetchStablecoinYieldsCached(): Promise<StablecoinYieldsResult> {
  const now = Date.now();

  if (stablecoinYieldCache && now - stablecoinYieldCache.fetchedAt < YIELD_CACHE_TTL_MS) {
    return stablecoinYieldCache.data;
  }

  if (!stablecoinPendingFetch) {
    stablecoinPendingFetch = fetchAllStablecoinYields()
      .then((result) => {
        stablecoinYieldCache = { data: result, fetchedAt: Date.now() };
        stablecoinPendingFetch = null;
        return result;
      })
      .catch((err) => {
        stablecoinPendingFetch = null;
        throw err;
      });
  }

  return stablecoinPendingFetch;
}

export function useStablecoinYields(): UseApiResult<StablecoinYieldsResult> {
  const [data, setData] = useState<StablecoinYieldsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchStablecoinYieldsCached();
      setData(result);
    } catch (err) {
      setError(err as Error);
      console.error('Failed to fetch stablecoin yields:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
