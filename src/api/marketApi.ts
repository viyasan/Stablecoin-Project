import { useState, useEffect, useCallback } from 'react';
import type {
  MarketSummary,
  MarketCapDataPoint,
  StablecoinWithSnapshot,
  MarketFilters,
  PegCurrency,
  IssuerType,
} from '../types';

// DefiLlama API endpoints
const DEFILLAMA_STABLECOINS_API = 'https://stablecoins.llama.fi/stablecoins?includePrices=true';
const DEFILLAMA_CHARTS_API = 'https://stablecoins.llama.fi/stablecoincharts/all';
const DEFILLAMA_CHAINS_API = 'https://stablecoins.llama.fi/stablecoinchains';

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

// Fetch and transform market summary from DefiLlama
async function fetchMarketSummary(): Promise<MarketSummary> {
  // Fetch both stablecoins list and historical chart data
  const [stablecoinsResponse, chartsResponse] = await Promise.all([
    fetch(DEFILLAMA_STABLECOINS_API),
    fetch(DEFILLAMA_CHARTS_API),
  ]);

  if (!stablecoinsResponse.ok) throw new Error('Failed to fetch stablecoin data');
  if (!chartsResponse.ok) throw new Error('Failed to fetch chart data');

  const stablecoinsData: DefiLlamaStablecoinsResponse = await stablecoinsResponse.json();
  const chartsData: DefiLlamaChartDataPoint[] = await chartsResponse.json();

  const stablecoins = stablecoinsData.peggedAssets;

  // Calculate current total from stablecoins list
  let totalMarketCap = 0;
  let totalPrevDay = 0;

  for (const coin of stablecoins) {
    totalMarketCap += coin.circulating?.peggedUSD || 0;
    totalPrevDay += coin.circulatingPrevDay?.peggedUSD || 0;
  }

  // Use historical chart data for accurate 7d and 30d changes (matching DefiLlama website)
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  // Find the chart data points closest to our target dates
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

  // Get market cap values from chart data
  const currentFromChart = latestChartPoint?.totalCirculatingUSD?.peggedUSD ||
                           latestChartPoint?.totalCirculating?.peggedUSD || totalMarketCap;
  const sevenDayValue = sevenDayPoint?.totalCirculatingUSD?.peggedUSD ||
                        sevenDayPoint?.totalCirculating?.peggedUSD || currentFromChart;
  const thirtyDayValue = thirtyDayPoint?.totalCirculatingUSD?.peggedUSD ||
                         thirtyDayPoint?.totalCirculating?.peggedUSD || currentFromChart;

  // Calculate absolute dollar changes
  const change24hValue = totalMarketCap - totalPrevDay;
  const change7dValue = currentFromChart - sevenDayValue;
  const change30dValue = currentFromChart - thirtyDayValue;

  // Calculate percentage changes
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
// Sources: Tether Attestation Q3 2025, Circle Reserve Report Dec 2025
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
  usTreasuryPercentage: number; // For Treasury Holdings card
}

// Static percentages from attestation reports - update quarterly
const RESERVE_PERCENTAGES = {
  USDT: {
    name: 'Tether',
    lastUpdated: 'Q3 2025',
    sourceUrl: 'https://tether.to/en/transparency/',
    usTreasuryPercentage: 78, // US Treasuries only
    assets: [
      { name: 'US Treasuries', percentage: 78, color: '#3B82F6' },
      { name: 'Reverse Repos', percentage: 11, color: '#60A5FA' },
      { name: 'Gold', percentage: 7, color: '#F59E0B' },
      { name: 'Bitcoin', percentage: 6, color: '#F97316' },
      { name: 'Secured Loans', percentage: 8, color: '#8B5CF6' },
      { name: 'Cash & Other', percentage: 4, color: '#6B7280' },
    ],
  },
  USDC: {
    name: 'Circle',
    lastUpdated: 'Dec 2025',
    sourceUrl: 'https://www.circle.com/transparency',
    usTreasuryPercentage: 32, // US Treasuries only (not repos)
    assets: [
      { name: 'Treasury Repos', percentage: 53, color: '#3B82F6' },
      { name: 'US Treasuries', percentage: 32, color: '#60A5FA' },
      { name: 'Bank Deposits', percentage: 14, color: '#10B981' },
      { name: 'Other', percentage: 1, color: '#6B7280' },
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
          ...RESERVE_PERCENTAGES.USDT,
          symbol: 'USDT',
          marketCap: usdtMarketCap,
        },
        usdc: {
          ...RESERVE_PERCENTAGES.USDC,
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
