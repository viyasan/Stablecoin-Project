import { useState, useEffect, useCallback } from 'react';
import type {
  MarketSummary,
  MarketCapDataPoint,
  StablecoinWithSnapshot,
  MarketFilters,
  PegCurrency,
  IssuerType,
  PegPricePoint,
} from '../types';

// DefiLlama API endpoints — use Vite proxy in dev to avoid browser restrictions
const isDev = import.meta.env.DEV;
const STABLECOINS_BASE = isDev ? '/api/llama-stablecoins' : 'https://stablecoins.llama.fi';
const DEFILLAMA_STABLECOINS_API = `${STABLECOINS_BASE}/stablecoins?includePrices=true`;
const DEFILLAMA_CHARTS_API = `${STABLECOINS_BASE}/stablecoincharts/all`;
const DEFILLAMA_CHAINS_API = `${STABLECOINS_BASE}/stablecoinchains`;
const DEFILLAMA_PRICES_API = `${STABLECOINS_BASE}/stablecoinprices`;

// Helper to map peg type to our PegCurrency type
function mapPegType(pegType: string): PegCurrency {
  if (pegType === 'peggedUSD') return 'USD';
  if (pegType === 'peggedEUR') return 'EUR';
  if (pegType === 'peggedJPY') return 'JPY';
  if (pegType === 'peggedGBP') return 'GBP';
  if (pegType === 'peggedSGD') return 'SGD';
  return 'OTHER';
}

// Helper to map peg mechanism to our IssuerType
function mapPegMechanism(mechanism: string): IssuerType {
  if (mechanism === 'fiat-backed' || mechanism === 'fiat') return 'fiat-backed';
  if (mechanism === 'crypto-backed' || mechanism === 'cdp') return 'crypto-collateralized';
  return 'algorithmic';
}

// Helper to find dominant chain from chainCirculating
function getDominantChain(chainCirculating: Record<string, { current: { peggedUSD: number } }>): string {
  let maxChain = 'Unknown';
  let maxValue = 0;
  for (const [chain, data] of Object.entries(chainCirculating)) {
    const value = data?.current?.peggedUSD || 0;
    if (value > maxValue) {
      maxValue = value;
      maxChain = chain;
    }
  }
  return maxChain;
}

// DefiLlama API response types
interface DefiLlamaStablecoin {
  id: string;
  name: string;
  symbol: string;
  gecko_id: string;
  pegType: string;
  pegMechanism: string;
  price: number;
  circulating: { peggedUSD: number };
  circulatingPrevDay: { peggedUSD: number };
  circulatingPrevWeek: { peggedUSD: number };
  circulatingPrevMonth: { peggedUSD: number };
  chainCirculating: Record<string, { current: { peggedUSD: number } }>;
}

interface DefiLlamaStablecoinsResponse {
  peggedAssets: DefiLlamaStablecoin[];
}

interface DefiLlamaChartDataPoint {
  date: string;
  totalCirculating: { peggedUSD: number };
  totalCirculatingUSD: { peggedUSD: number };
}

// Fetch market summary from Supabase (cached via /api/market-summary),
// with fallback to DefiLlama direct if the API route returns no data.
async function fetchMarketSummary(): Promise<MarketSummary> {
  // Try cached Supabase data first (fast, edge-cached)
  try {
    const res = await fetch('/api/market-summary');
    if (res.ok) {
      const data = await res.json();
      if (data && data.totalMarketCap) return data as MarketSummary;
    }
  } catch {
    // Fall through to DefiLlama direct
  }

  // Fallback: fetch directly from DefiLlama (initial deploy or API route unavailable)
  return fetchMarketSummaryFromDefiLlama();
}

async function fetchMarketSummaryFromDefiLlama(): Promise<MarketSummary> {
  const [stablecoinsResponse, chartsResponse] = await Promise.all([
    fetch(DEFILLAMA_STABLECOINS_API),
    fetch(DEFILLAMA_CHARTS_API),
  ]);

  if (!stablecoinsResponse.ok) throw new Error('Failed to fetch stablecoin data');
  if (!chartsResponse.ok) throw new Error('Failed to fetch chart data');

  const stablecoinsData: DefiLlamaStablecoinsResponse = await stablecoinsResponse.json();
  const chartsData: DefiLlamaChartDataPoint[] = await chartsResponse.json();

  const stablecoins = stablecoinsData.peggedAssets;

  let totalMarketCap = 0;
  let totalPrevDay = 0;

  for (const coin of stablecoins) {
    totalMarketCap += coin.circulating?.peggedUSD || 0;
    totalPrevDay += coin.circulatingPrevDay?.peggedUSD || 0;
  }

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  const findClosestDataPoint = (targetTimestamp: number): DefiLlamaChartDataPoint | null => {
    let closest: DefiLlamaChartDataPoint | null = null;
    let minDiff = Infinity;

    for (const point of chartsData) {
      const pointTimestamp = parseInt(point.date) * 1000;
      const diff = Math.abs(pointTimestamp - targetTimestamp);
      if (diff < minDiff) {
        minDiff = diff;
        closest = point;
      }
    }
    return closest;
  };

  const latestChartPoint = chartsData[chartsData.length - 1];
  const sevenDayPoint = findClosestDataPoint(sevenDaysAgo);
  const thirtyDayPoint = findClosestDataPoint(thirtyDaysAgo);

  const currentFromChart = latestChartPoint?.totalCirculatingUSD?.peggedUSD ||
                           latestChartPoint?.totalCirculating?.peggedUSD || totalMarketCap;
  const sevenDayValue = sevenDayPoint?.totalCirculatingUSD?.peggedUSD ||
                        sevenDayPoint?.totalCirculating?.peggedUSD || currentFromChart;
  const thirtyDayValue = thirtyDayPoint?.totalCirculatingUSD?.peggedUSD ||
                         thirtyDayPoint?.totalCirculating?.peggedUSD || currentFromChart;

  const change24hValue = totalMarketCap - totalPrevDay;
  const change7dValue = currentFromChart - sevenDayValue;
  const change30dValue = currentFromChart - thirtyDayValue;

  const change24h = totalPrevDay > 0 ? ((totalMarketCap - totalPrevDay) / totalPrevDay) * 100 : 0;
  const change7d = sevenDayValue > 0 ? ((currentFromChart - sevenDayValue) / sevenDayValue) * 100 : 0;
  const change30d = thirtyDayValue > 0 ? ((currentFromChart - thirtyDayValue) / thirtyDayValue) * 100 : 0;

  return {
    totalMarketCap,
    change24h: Math.round(change24h * 100) / 100,
    change24hValue,
    change7d: Math.round(change7d * 100) / 100,
    change7dValue,
    change30d: Math.round(change30d * 100) / 100,
    change30dValue,
    trackedStablecoins: stablecoins.length,
    lastUpdated: new Date().toISOString(),
    dataSource: 'DefiLlama',
  };
}

// Fetch and transform chart data from DefiLlama
async function fetchChartData(days: number): Promise<MarketCapDataPoint[]> {
  const response = await fetch(DEFILLAMA_CHARTS_API);
  if (!response.ok) throw new Error('Failed to fetch chart data');

  const data: DefiLlamaChartDataPoint[] = await response.json();

  // If days is 0 or very large, return all data (full history since 2018)
  // Otherwise, get the last N days of data
  const chartData = days === 0 || days >= data.length ? data : data.slice(-days);

  return chartData.map((point) => ({
    timestamp: new Date(parseInt(point.date) * 1000).toISOString(),
    totalMarketCap: point.totalCirculatingUSD?.peggedUSD || point.totalCirculating?.peggedUSD || 0,
  }));
}

// Fetch and transform stablecoin list from DefiLlama
async function fetchStablecoinList(): Promise<StablecoinWithSnapshot[]> {
  const response = await fetch(DEFILLAMA_STABLECOINS_API);
  if (!response.ok) throw new Error('Failed to fetch stablecoin data');

  const data: DefiLlamaStablecoinsResponse = await response.json();

  return data.peggedAssets
    .filter((coin) => coin.circulating?.peggedUSD > 0)
    .map((coin) => {
      const currentCap = coin.circulating?.peggedUSD || 0;
      const prevWeekCap = coin.circulatingPrevWeek?.peggedUSD || currentCap;
      const prevMonthCap = coin.circulatingPrevMonth?.peggedUSD || currentCap;

      // Calculate percentage changes
      const change7d = prevWeekCap > 0 ? ((currentCap - prevWeekCap) / prevWeekCap) * 100 : 0;
      const change30d = prevMonthCap > 0 ? ((currentCap - prevMonthCap) / prevMonthCap) * 100 : 0;

      return {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        pegCurrency: mapPegType(coin.pegType),
        issuerType: mapPegMechanism(coin.pegMechanism),
        dominantChain: getDominantChain(coin.chainCirculating || {}),
        externalId: coin.gecko_id,
        marketCap: currentCap,
        volume24h: 0, // DefiLlama doesn't provide volume data
        price: coin.price || 1,
        priceDeviation: coin.price ? (coin.price - 1) * 100 : 0,
        change7d: Math.round(change7d * 100) / 100,
        change30d: Math.round(change30d * 100) / 100,
        chainBreakdown: Object.entries(coin.chainCirculating || {})
          .map(([chain, data]) => ({
            chain: normalizeChainName(chain),
            amount: data?.current?.peggedUSD || 0,
          }))
          .filter(e => e.amount > 0)
          .sort((a, b) => b.amount - a.amount),
      };
    })
    .sort((a, b) => b.marketCap - a.marketCap);
}

interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useMarketSummary(): UseApiResult<MarketSummary> {
  const [data, setData] = useState<MarketSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const summary = await fetchMarketSummary();
      setData(summary);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

export function useMarketCapChart(
  timeRange: '7d' | '30d' | '1y' | 'max' = 'max'
): UseApiResult<MarketCapDataPoint[]> {
  const [data, setData] = useState<MarketCapDataPoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 0 means fetch all historical data (since 2018)
      const days =
        timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '1y' ? 365 : 0;
      const chartData = await fetchChartData(days);
      setData(chartData);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

export function useStablecoinList(
  filters?: MarketFilters
): UseApiResult<StablecoinWithSnapshot[]> {
  const [data, setData] = useState<StablecoinWithSnapshot[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      let stablecoins = await fetchStablecoinList();

      // Apply filters
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        stablecoins = stablecoins.filter(
          (coin) =>
            coin.name.toLowerCase().includes(search) ||
            coin.symbol.toLowerCase().includes(search)
        );
      }

      if (filters?.pegCurrency && filters.pegCurrency !== 'all') {
        stablecoins = stablecoins.filter(
          (coin) => coin.pegCurrency === filters.pegCurrency
        );
      }

      if (filters?.issuerType && filters.issuerType !== 'all') {
        stablecoins = stablecoins.filter(
          (coin) => coin.issuerType === filters.issuerType
        );
      }

      // Sort
      const sortBy = filters?.sortBy || 'marketCap';
      const sortOrder = filters?.sortOrder || 'desc';

      stablecoins.sort((a, b) => {
        const aVal = a[sortBy as keyof StablecoinWithSnapshot] as number;
        const bVal = b[sortBy as keyof StablecoinWithSnapshot] as number;
        return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      });

      setData(stablecoins);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.search, filters?.pegCurrency, filters?.issuerType, filters?.sortBy, filters?.sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// Chain breakdown types and hook
export interface ChainData {
  name: string;
  totalCirculating: number;
  dominantStablecoin?: string;
}

interface DefiLlamaChainData {
  gecko_id: string;
  totalCirculatingUSD: { peggedUSD: number };
  tokenSymbol: string;
  name: string;
}

// Normalize chain names from API to display names
const CHAIN_NAME_MAP: Record<string, string> = {
  'Hyperliquid L1': 'Hyperliquid',
};

function normalizeChainName(name: string): string {
  return CHAIN_NAME_MAP[name] || name;
}

async function fetchChainData(): Promise<ChainData[]> {
  const response = await fetch(DEFILLAMA_CHAINS_API);
  if (!response.ok) throw new Error('Failed to fetch chain data');

  const data: DefiLlamaChainData[] = await response.json();

  return data
    .filter((chain) => chain.totalCirculatingUSD?.peggedUSD > 0)
    .map((chain) => ({
      name: normalizeChainName(chain.name),
      totalCirculating: chain.totalCirculatingUSD?.peggedUSD || 0,
      dominantStablecoin: chain.tokenSymbol,
    }))
    .sort((a, b) => b.totalCirculating - a.totalCirculating);
}

export function useChainBreakdown(): UseApiResult<ChainData[]> {
  const [data, setData] = useState<ChainData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const chainData = await fetchChainData();
      setData(chainData);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// Reserve composition data for USDT and USDC
// Percentages from quarterly attestation reports (update when new reports are published)
// Sources: Tether Attestation Q4 2025, Circle Reserve Report Mar 2026
export interface ReserveAsset {
  name: string;
  percentage: number;
  color: string;
}

export interface StablecoinReserve {
  name: string;
  symbol: 'USDT' | 'USDC';
  marketCap: number; // Live from DefiLlama
  lastUpdated: string;
  sourceUrl: string;
  assets: ReserveAsset[];
  treasuryHoldings: number; // Static from attestation reports (in dollars)
}

// Static data from attestation reports - update quarterly/monthly
// Sources:
// Tether Q4 2025: https://tether.io/news/tether-delivers-10b-profits-in-2025-6-3b-in-excess-reserves-and-record-141-billion-exposure-in-u-s-treasury-holdings/
// Circle Apr 2026: https://www.circle.com/transparency (weekly disclosure, Apr 11, 2026)
// Last updated: April 2026 (Tether Q1 2026 attestation pending — expected late April 2026)
const RESERVE_DATA = {
  USDT: {
    name: 'Tether',
    lastUpdated: 'Q4 2025',
    sourceUrl: 'https://tether.to/en/transparency/',
    treasuryHoldings: 141_000_000_000, // $141B total Treasury exposure (T-bills + overnight repos)
    assets: [
      { name: 'US Treasuries', percentage: 73, color: '#E2B050' },
      { name: 'Gold', percentage: 9, color: '#D4A437' },
      { name: 'Bitcoin', percentage: 4, color: '#CD7F32' },
      { name: 'Secured Loans & Other', percentage: 14, color: '#ADB5BD' },
    ],
  },
  USDC: {
    name: 'Circle',
    lastUpdated: 'Apr 2026',
    sourceUrl: 'https://www.circle.com/transparency',
    treasuryHoldings: 53_500_000_000, // $53.5B in Circle Reserve Fund (T-bills + overnight repos)
    assets: [
      { name: 'US Treasuries & Repos', percentage: 68, color: '#D4A437' },
      { name: 'Cash & Bank Deposits', percentage: 32, color: '#CD7F32' },
    ],
  },
};

interface StablecoinReservesData {
  usdt: StablecoinReserve;
  usdc: StablecoinReserve;
}

export function useStablecoinReserves(): UseApiResult<StablecoinReservesData> {
  const [data, setData] = useState<StablecoinReservesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(DEFILLAMA_STABLECOINS_API);
      if (!response.ok) throw new Error('Failed to fetch stablecoin data');

      const apiData: DefiLlamaStablecoinsResponse = await response.json();

      // Find USDT and USDC
      const usdtData = apiData.peggedAssets.find((coin) => coin.symbol === 'USDT');
      const usdcData = apiData.peggedAssets.find((coin) => coin.symbol === 'USDC');

      if (!usdtData || !usdcData) {
        throw new Error('Could not find USDT or USDC data');
      }

      const usdtMarketCap = usdtData.circulating?.peggedUSD || 0;
      const usdcMarketCap = usdcData.circulating?.peggedUSD || 0;

      setData({
        usdt: {
          ...RESERVE_DATA.USDT,
          symbol: 'USDT',
          marketCap: usdtMarketCap,
        },
        usdc: {
          ...RESERVE_DATA.USDC,
          symbol: 'USDC',
          marketCap: usdcMarketCap,
        },
      });
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// Stablecoin peg price history
interface DefiLlamaPriceEntry {
  date: number;
  prices: Record<string, number>;
}

async function fetchStablecoinPrices(): Promise<Map<string, PegPricePoint[]>> {
  const response = await fetch(DEFILLAMA_PRICES_API);
  if (!response.ok) throw new Error('Failed to fetch stablecoin price data');

  const data: DefiLlamaPriceEntry[] = await response.json();
  const result = new Map<string, PegPricePoint[]>();

  // Filter out date: 0 (current snapshot) and process historical entries
  const historicalEntries = data.filter((entry) => entry.date !== 0);

  for (const entry of historicalEntries) {
    const isoDate = new Date(entry.date * 1000).toISOString();
    for (const [geckoId, price] of Object.entries(entry.prices)) {
      if (!result.has(geckoId)) {
        result.set(geckoId, []);
      }
      result.get(geckoId)!.push({
        date: isoDate,
        price,
        deviation: (price - 1.0) * 100,
      });
    }
  }

  // Sort each coin's data by date ascending
  for (const points of result.values()) {
    points.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  return result;
}

export function useStablecoinPrices(
  days: number = 0
): UseApiResult<Map<string, PegPricePoint[]>> {
  const [data, setData] = useState<Map<string, PegPricePoint[]> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const priceData = await fetchStablecoinPrices();

      // Slice to requested number of days if specified
      if (days > 0) {
        for (const [geckoId, points] of priceData.entries()) {
          priceData.set(geckoId, points.slice(-days));
        }
      }

      setData(priceData);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
