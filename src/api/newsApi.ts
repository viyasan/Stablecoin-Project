import { useState, useEffect, useCallback } from 'react';
import type { NewsItem, WeeklyBriefing, NewsFilters, TopicTag } from '../types';

// RSS Feed sources - high-quality crypto news outlets
const RSS_FEEDS = [
  { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', source: 'CoinDesk' },
  { url: 'https://cointelegraph.com/rss', source: 'CoinTelegraph' },
  { url: 'https://decrypt.co/feed', source: 'Decrypt' },
];

// Stablecoin-related keywords for filtering
const STABLECOIN_KEYWORDS = [
  'stablecoin', 'stablecoins',
  'usdt', 'tether',
  'usdc', 'circle',
  'dai', 'makerdao',
  'pyusd', 'paypal',
  'busd',
  'tusd',
  'frax',
  'usdd',
  'gusd',
  'paxos',
  'fdusd',
  'eurs',
  'cadc', 'qcad', 'cadd', // Canadian stablecoins
  'cbdc', 'digital dollar', 'digital euro',
  'reserve', 'peg', 'depeg',
];

// Parse RSS XML to extract articles
function parseRSSFeed(xmlText: string, sourceName: string): RSSArticle[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  const items = xmlDoc.querySelectorAll('item');

  const articles: RSSArticle[] = [];

  items.forEach((item) => {
    const title = item.querySelector('title')?.textContent || '';
    const link = item.querySelector('link')?.textContent || '';
    const description = item.querySelector('description')?.textContent || '';
    const pubDate = item.querySelector('pubDate')?.textContent || '';

    // Clean HTML from description
    const cleanDescription = description.replace(/<[^>]*>/g, '').trim();

    articles.push({
      title,
      link,
      description: cleanDescription,
      pubDate,
      source: sourceName,
    });
  });

  return articles;
}

interface RSSArticle {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
}

// Check if article is stablecoin-related
function isStablecoinRelated(article: RSSArticle): boolean {
  const searchText = `${article.title} ${article.description}`.toLowerCase();
  return STABLECOIN_KEYWORDS.some(keyword => searchText.includes(keyword.toLowerCase()));
}

// Determine topics based on article content
function determineTopics(article: RSSArticle): TopicTag[] {
  const topics: TopicTag[] = [];
  const searchText = `${article.title} ${article.description}`.toLowerCase();

  if (searchText.includes('regulat') || searchText.includes('sec') || searchText.includes('law') || searchText.includes('ban') || searchText.includes('legislation')) {
    topics.push('regulation');
  }
  if (searchText.includes('depeg') || searchText.includes('de-peg') || searchText.includes('lost peg') || searchText.includes('crash')) {
    topics.push('depeg');
  }
  if (searchText.includes('integrat') || searchText.includes('support') || searchText.includes('listing') || searchText.includes('adds')) {
    topics.push('integration');
  }
  if (searchText.includes('network') || searchText.includes('chain') || searchText.includes('layer') || searchText.includes('blockchain')) {
    topics.push('infrastructure');
  }
  if (searchText.includes('payment') || searchText.includes('remittance') || searchText.includes('transfer') || searchText.includes('transaction')) {
    topics.push('payments');
  }
  if (searchText.includes('reserve') || searchText.includes('audit') || searchText.includes('backing') || searchText.includes('attestation')) {
    topics.push('reserve');
  }
  if (searchText.includes('launch') || searchText.includes('release') || searchText.includes('debut') || searchText.includes('announces')) {
    topics.push('launch');
  }
  if (searchText.includes('partner') || searchText.includes('collaborat') || searchText.includes('deal') || searchText.includes('agreement')) {
    topics.push('partnership');
  }

  // Default topic if none matched
  if (topics.length === 0) {
    topics.push('integration');
  }

  return topics;
}

// Extract stablecoin symbols mentioned in article
function extractAssetSymbols(article: RSSArticle): string[] {
  const searchText = `${article.title} ${article.description}`.toUpperCase();
  const symbols: string[] = [];

  const stablecoinSymbols = ['USDT', 'USDC', 'DAI', 'PYUSD', 'BUSD', 'TUSD', 'FRAX', 'USDD', 'GUSD', 'FDUSD', 'EURS', 'CADC', 'QCAD', 'CADD'];

  for (const symbol of stablecoinSymbols) {
    if (searchText.includes(symbol)) {
      symbols.push(symbol);
    }
  }

  return symbols;
}

// Map RSS article to NewsItem type
function mapRSSToNewsItem(article: RSSArticle): NewsItem {
  return {
    id: article.link,
    title: article.title,
    source: article.source,
    url: article.link,
    publishedAt: new Date(article.pubDate).toISOString(),
    summary: article.description.slice(0, 200) + (article.description.length > 200 ? '...' : ''),
    topics: determineTopics(article),
    assetSymbols: extractAssetSymbols(article),
    countryIsoCodes: [],
  };
}

// Fetch and parse RSS feeds from multiple sources
async function fetchRSSNews(limit: number = 20): Promise<NewsItem[]> {
  const allArticles: RSSArticle[] = [];

  // Fetch all RSS feeds in parallel
  const feedPromises = RSS_FEEDS.map(async (feed) => {
    try {
      const response = await fetch(feed.url);
      if (!response.ok) {
        console.warn(`Failed to fetch ${feed.source} RSS: ${response.status}`);
        return [];
      }
      const xmlText = await response.text();
      return parseRSSFeed(xmlText, feed.source);
    } catch (error) {
      console.warn(`Error fetching ${feed.source} RSS:`, error);
      return [];
    }
  });

  const feedResults = await Promise.all(feedPromises);
  feedResults.forEach(articles => allArticles.push(...articles));

  // Filter for stablecoin-related articles
  const stablecoinArticles = allArticles.filter(isStablecoinRelated);

  // Sort by date (newest first)
  stablecoinArticles.sort((a, b) =>
    new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  // Map to NewsItem and limit results
  return stablecoinArticles.slice(0, limit).map(mapRSSToNewsItem);
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
      // Try to fetch from RSS feeds first
      let newsData = await fetchRSSNews(20);

      // Fall back to mock data if no stablecoin articles found
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
      // Try to fetch from RSS feeds first
      let newsData = await fetchRSSNews(limit);

      // Fall back to mock data if no stablecoin articles found
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
