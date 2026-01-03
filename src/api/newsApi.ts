import { useState, useEffect, useCallback } from 'react';
import type { NewsItem, WeeklyBriefing, NewsFilters, TopicTag } from '../types';

// CryptoPanic API configuration
const CRYPTOPANIC_API_URL = 'https://cryptopanic.com/api/developer/v2/posts/';
const CRYPTOPANIC_AUTH_TOKEN = import.meta.env.VITE_CRYPTOPANIC_API_KEY || '';

// Stablecoin currencies to filter for
const STABLECOIN_CURRENCIES = 'USDT,USDC,DAI,USDS';

// CryptoPanic API response types
interface CryptoPanicSource {
  title: string;
  domain: string;
}

interface CryptoPanicCurrency {
  code: string;
  title: string;
}

interface CryptoPanicPost {
  id: number;
  kind: string;
  title: string;
  description?: string;
  published_at: string;
  url: string;
  slug: string;
  source?: CryptoPanicSource;
  currencies?: CryptoPanicCurrency[];
  votes?: {
    positive: number;
    negative: number;
    important: number;
  };
}

interface CryptoPanicResponse {
  count: number;
  results: CryptoPanicPost[];
}

// Map CryptoPanic post to our NewsItem type
function mapCryptoPanicToNewsItem(post: CryptoPanicPost): NewsItem {
  // Extract asset symbols from currencies
  const assetSymbols = post.currencies?.map(c => c.code) || [];

  // Determine topics based on title keywords (basic categorization)
  const topics: TopicTag[] = [];
  const titleLower = post.title.toLowerCase();

  if (titleLower.includes('regulat') || titleLower.includes('sec') || titleLower.includes('law') || titleLower.includes('ban')) {
    topics.push('regulation');
  }
  if (titleLower.includes('depeg') || titleLower.includes('peg') || titleLower.includes('crash')) {
    topics.push('depeg');
  }
  if (titleLower.includes('integrat') || titleLower.includes('support') || titleLower.includes('add')) {
    topics.push('integration');
  }
  if (titleLower.includes('network') || titleLower.includes('chain') || titleLower.includes('layer')) {
    topics.push('infrastructure');
  }
  if (titleLower.includes('payment') || titleLower.includes('remittance') || titleLower.includes('transfer')) {
    topics.push('payments');
  }
  if (titleLower.includes('reserve') || titleLower.includes('audit') || titleLower.includes('backing')) {
    topics.push('reserve');
  }
  if (titleLower.includes('launch') || titleLower.includes('release') || titleLower.includes('debut')) {
    topics.push('launch');
  }
  if (titleLower.includes('partner') || titleLower.includes('collaborat') || titleLower.includes('deal')) {
    topics.push('partnership');
  }

  // Default topic if none matched
  if (topics.length === 0) {
    topics.push('integration');
  }

  return {
    id: post.id.toString(),
    title: post.title,
    source: post.source?.title || 'CryptoPanic',
    url: post.url || `https://cryptopanic.com/news/${post.slug}`,
    publishedAt: post.published_at,
    summary: post.description || post.title,
    topics,
    assetSymbols,
    countryIsoCodes: [], // CryptoPanic doesn't provide country data
  };
}

// Fetch news from CryptoPanic API
async function fetchCryptoPanicNews(limit: number = 20): Promise<NewsItem[]> {
  if (!CRYPTOPANIC_AUTH_TOKEN) {
    console.warn('CryptoPanic API key not configured. Using mock data.');
    return [];
  }

  const params = new URLSearchParams({
    auth_token: CRYPTOPANIC_AUTH_TOKEN,
    currencies: STABLECOIN_CURRENCIES,
    public: 'true',
  });

  const response = await fetch(`${CRYPTOPANIC_API_URL}?${params}`);

  if (!response.ok) {
    throw new Error(`CryptoPanic API error: ${response.status}`);
  }

  const data: CryptoPanicResponse = await response.json();

  return data.results.slice(0, limit).map(mapCryptoPanicToNewsItem);
}

// Mock data for development/fallback
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
      // Try to fetch from CryptoPanic first
      let newsData = await fetchCryptoPanicNews(20);

      // Fall back to mock data if API fails or no API key
      if (newsData.length === 0) {
        newsData = [...mockNews];
      }

      // Apply filters
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        newsData = newsData.filter(
          (item) =>
            item.title.toLowerCase().includes(search) ||
            item.summary.toLowerCase().includes(search)
        );
      }

      if (filters?.asset) {
        newsData = newsData.filter((item) =>
          item.assetSymbols.includes(filters.asset!)
        );
      }

      if (filters?.country) {
        newsData = newsData.filter((item) =>
          item.countryIsoCodes.includes(filters.country!)
        );
      }

      if (filters?.topic && filters.topic !== 'all') {
        newsData = newsData.filter((item) =>
          item.topics.includes(filters.topic as TopicTag)
        );
      }

      setData(newsData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch news:', err);
      // Fall back to mock data on error
      setData(mockNews);
      setError(null);
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
      // Try to fetch from CryptoPanic first
      let newsData = await fetchCryptoPanicNews(limit);

      // Fall back to mock data if API fails or no API key
      if (newsData.length === 0) {
        newsData = mockNews.slice(0, limit);
      }

      setData(newsData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch headlines:', err);
      // Fall back to mock data on error
      setData(mockNews.slice(0, limit));
      setError(null);
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
      // Weekly briefing is still mock data for now
      // This would need a separate summarization service
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
