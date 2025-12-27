import { useState, useEffect, useCallback } from 'react';
import type {
  MarketSummary,
  MarketCapDataPoint,
  StablecoinWithSnapshot,
  MarketFilters,
} from '../types';

// Mock data for development - will be replaced with real API calls
const mockMarketSummary: MarketSummary = {
  totalMarketCap: 178_500_000_000,
  change24h: 0.42,
  change7d: 1.28,
  change30d: 3.15,
  trackedStablecoins: 156,
  lastUpdated: new Date().toISOString(),
  dataSource: 'CoinGecko API',
};

const generateMockChartData = (days: number): MarketCapDataPoint[] => {
  const data: MarketCapDataPoint[] = [];
  const now = Date.now();
  const baseValue = 178_500_000_000;

  for (let i = days; i >= 0; i--) {
    const timestamp = new Date(now - i * 24 * 60 * 60 * 1000).toISOString();
    const randomVariation = (Math.random() - 0.5) * 0.02; // ±2% variation
    const totalMarketCap = baseValue * (1 + randomVariation - i * 0.001);

    data.push({
      timestamp,
      totalMarketCap,
      breakdown: [
        { symbol: 'USDT', marketCap: totalMarketCap * 0.65 },
        { symbol: 'USDC', marketCap: totalMarketCap * 0.22 },
        { symbol: 'DAI', marketCap: totalMarketCap * 0.03 },
        { symbol: 'Others', marketCap: totalMarketCap * 0.10 },
      ],
    });
  }

  return data;
};

const mockStablecoins: StablecoinWithSnapshot[] = [
  {
    id: '1',
    symbol: 'USDT',
    name: 'Tether',
    pegCurrency: 'USD',
    issuerType: 'fiat-backed',
    dominantChain: 'Ethereum',
    marketCap: 116_000_000_000,
    volume24h: 45_000_000_000,
    price: 1.0001,
    priceDeviation: 0.01,
  },
  {
    id: '2',
    symbol: 'USDC',
    name: 'USD Coin',
    pegCurrency: 'USD',
    issuerType: 'fiat-backed',
    dominantChain: 'Ethereum',
    marketCap: 42_000_000_000,
    volume24h: 8_500_000_000,
    price: 0.9999,
    priceDeviation: -0.01,
  },
  {
    id: '3',
    symbol: 'DAI',
    name: 'Dai',
    pegCurrency: 'USD',
    issuerType: 'crypto-collateralized',
    dominantChain: 'Ethereum',
    marketCap: 5_200_000_000,
    volume24h: 320_000_000,
    price: 1.0002,
    priceDeviation: 0.02,
  },
  {
    id: '4',
    symbol: 'FRAX',
    name: 'Frax',
    pegCurrency: 'USD',
    issuerType: 'algorithmic',
    dominantChain: 'Ethereum',
    marketCap: 650_000_000,
    volume24h: 12_000_000,
    price: 0.9998,
    priceDeviation: -0.02,
  },
  {
    id: '5',
    symbol: 'TUSD',
    name: 'TrueUSD',
    pegCurrency: 'USD',
    issuerType: 'fiat-backed',
    dominantChain: 'Ethereum',
    marketCap: 495_000_000,
    volume24h: 28_000_000,
    price: 0.9997,
    priceDeviation: -0.03,
  },
];

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

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setData(mockMarketSummary);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { data, isLoading, error, refetch: fetchSummary };
}

export function useMarketCapChart(
  timeRange: '7d' | '30d' | '1y' | 'max' = '30d'
): UseApiResult<MarketCapDataPoint[]> {
  const [data, setData] = useState<MarketCapDataPoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchChartData = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const days =
        timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '1y' ? 365 : 730;
      setData(generateMockChartData(days));
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  return { data, isLoading, error, refetch: fetchChartData };
}

export function useStablecoinList(
  filters?: MarketFilters
): UseApiResult<StablecoinWithSnapshot[]> {
  const [data, setData] = useState<StablecoinWithSnapshot[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      let filteredData = [...mockStablecoins];

      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filteredData = filteredData.filter(
          (coin) =>
            coin.name.toLowerCase().includes(search) ||
            coin.symbol.toLowerCase().includes(search)
        );
      }

      if (filters?.pegCurrency && filters.pegCurrency !== 'all') {
        filteredData = filteredData.filter(
          (coin) => coin.pegCurrency === filters.pegCurrency
        );
      }

      if (filters?.issuerType && filters.issuerType !== 'all') {
        filteredData = filteredData.filter(
          (coin) => coin.issuerType === filters.issuerType
        );
      }

      // Sort
      const sortBy = filters?.sortBy || 'marketCap';
      const sortOrder = filters?.sortOrder || 'desc';

      filteredData.sort((a, b) => {
        const aVal = a[sortBy as keyof StablecoinWithSnapshot] as number;
        const bVal = b[sortBy as keyof StablecoinWithSnapshot] as number;
        return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      });

      setData(filteredData);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.search, filters?.pegCurrency, filters?.issuerType, filters?.sortBy, filters?.sortOrder]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { data, isLoading, error, refetch: fetchList };
}
