import { useState, useEffect, useCallback } from 'react';
import type { NewsItem, WeeklyBriefing, NewsFilters } from '../types';

// Mock data for development
const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Tether reaches $120B market cap milestone',
    source: 'CoinDesk',
    url: 'https://coindesk.com',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    summary:
      'USDT continues to dominate the stablecoin market as Tether reaches a new all-time high in market capitalization.',
    topics: ['reserve'],
    assetSymbols: ['USDT'],
    countryIsoCodes: [],
  },
  {
    id: '2',
    title: 'EU MiCA stablecoin provisions show early impact',
    source: 'The Block',
    url: 'https://theblock.co',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    summary:
      'Six months after implementation, MiCA regulations are reshaping the European stablecoin landscape with new licensing requirements.',
    topics: ['regulation'],
    assetSymbols: ['USDC', 'EURC'],
    countryIsoCodes: ['EU'],
  },
  {
    id: '3',
    title: 'Circle expands USDC to five new blockchain networks',
    source: 'Decrypt',
    url: 'https://decrypt.co',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    summary:
      'Circle announces native USDC support on additional Layer 2 networks, expanding accessibility for users.',
    topics: ['infrastructure', 'integration'],
    assetSymbols: ['USDC'],
    countryIsoCodes: ['US'],
  },
  {
    id: '4',
    title: 'PayPal PYUSD gains traction in payments',
    source: 'Bloomberg',
    url: 'https://bloomberg.com',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    summary:
      'PayPal reports growing adoption of its PYUSD stablecoin for merchant payments and cross-border transactions.',
    topics: ['payments', 'partnership'],
    assetSymbols: ['PYUSD'],
    countryIsoCodes: ['US'],
  },
  {
    id: '5',
    title: 'Japan approves first foreign stablecoin under new framework',
    source: 'Nikkei Asia',
    url: 'https://asia.nikkei.com',
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    summary:
      'Japanese regulators approve a major USD stablecoin for use in the country, marking a significant milestone for global stablecoin adoption.',
    topics: ['regulation', 'launch'],
    assetSymbols: ['USDC'],
    countryIsoCodes: ['JP'],
  },
  {
    id: '6',
    title: 'DAI stability mechanism passes stress test',
    source: 'DeFi Pulse',
    url: 'https://defipulse.com',
    publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    summary:
      'MakerDAO\'s decentralized stablecoin maintains peg during market volatility, demonstrating resilience of crypto-collateralized model.',
    topics: ['reserve'],
    assetSymbols: ['DAI'],
    countryIsoCodes: [],
  },
  {
    id: '7',
    title: 'Nigeria sees surge in stablecoin remittances',
    source: 'Rest of World',
    url: 'https://restofworld.org',
    publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    summary:
      'Stablecoins become increasingly popular for cross-border payments in Nigeria amid currency restrictions.',
    topics: ['payments'],
    assetSymbols: ['USDT', 'USDC'],
    countryIsoCodes: ['NG'],
  },
];

const mockWeeklyBriefing: WeeklyBriefing = {
  id: '1',
  title: 'Weekly Stablecoin Briefing',
  weekOf: '2024-12-23',
  summaryParagraph:
    'This week saw continued growth in the stablecoin market, with total market cap approaching $180B. Regulatory clarity in the EU under MiCA is driving institutional adoption, while emerging markets continue to embrace stablecoins for cross-border payments. Key developments include Tether\'s market cap milestone and Japan\'s approval of foreign stablecoins.',
  topEvents: [
    {
      title: 'Tether hits $120B',
      description: 'USDT market cap reaches new all-time high amid growing demand.',
    },
    {
      title: 'MiCA impact visible',
      description: 'European stablecoin market adapts to new regulatory framework.',
    },
    {
      title: 'Japan opens doors',
      description: 'First foreign stablecoin approved under Payment Services Act.',
    },
  ],
};

interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useNews(filters?: NewsFilters): UseApiResult<NewsItem[]> {
  const [data, setData] = useState<NewsItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));

      let filteredData = [...mockNews];

      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filteredData = filteredData.filter(
          (item) =>
            item.title.toLowerCase().includes(search) ||
            item.summary.toLowerCase().includes(search)
        );
      }

      if (filters?.asset) {
        filteredData = filteredData.filter((item) =>
          item.assetSymbols.includes(filters.asset!)
        );
      }

      if (filters?.country) {
        filteredData = filteredData.filter((item) =>
          item.countryIsoCodes.includes(filters.country!)
        );
      }

      if (filters?.topic && filters.topic !== 'all') {
        filteredData = filteredData.filter((item) =>
          item.topics.includes(filters.topic as any)
        );
      }

      setData(filteredData);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.search, filters?.asset, filters?.country, filters?.topic]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { data, isLoading, error, refetch: fetchNews };
}

export function useTopHeadlines(limit: number = 5): UseApiResult<NewsItem[]> {
  const [data, setData] = useState<NewsItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHeadlines = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setData(mockNews.slice(0, limit));
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchHeadlines();
  }, [fetchHeadlines]);

  return { data, isLoading, error, refetch: fetchHeadlines };
}

export function useWeeklyBriefing(): UseApiResult<WeeklyBriefing> {
  const [data, setData] = useState<WeeklyBriefing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBriefing = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setData(mockWeeklyBriefing);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBriefing();
  }, [fetchBriefing]);

  return { data, isLoading, error, refetch: fetchBriefing };
}
