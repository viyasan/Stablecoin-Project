import { useState, useEffect, useCallback } from 'react';
import type { NewsItem, NewsFilters, TopicTag } from '../types';

// CORS proxy for RSS feeds that don't support CORS
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// RSS Feed sources - high-quality crypto news outlets
const RSS_FEEDS = [
  { url: 'https://www.coindesk.com/arc/outboundfeeds/rss', source: 'CoinDesk', needsProxy: true },
  { url: 'https://cointelegraph.com/rss', source: 'CoinTelegraph', needsProxy: false },  // Has CORS headers
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

// Extract image URL from RSS item using various common formats
function extractImageFromItem(item: Element, description: string): string | undefined {
  // Try media:content (most common for news RSS)
  const mediaContent = item.querySelector('content');
  if (mediaContent) {
    const url = mediaContent.getAttribute('url');
    if (url && isValidImageUrl(url)) return url;
  }

  // Try media:thumbnail
  const mediaThumbnail = item.querySelector('thumbnail');
  if (mediaThumbnail) {
    const url = mediaThumbnail.getAttribute('url');
    if (url && isValidImageUrl(url)) return url;
  }

  // Try enclosure (common for podcasts and some news)
  const enclosure = item.querySelector('enclosure');
  if (enclosure) {
    const type = enclosure.getAttribute('type') || '';
    const url = enclosure.getAttribute('url');
    if (url && type.startsWith('image/')) return url;
  }

  // Try to find image in content:encoded
  const contentEncoded = item.querySelector('encoded');
  if (contentEncoded?.textContent) {
    const imgMatch = contentEncoded.textContent.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch?.[1] && isValidImageUrl(imgMatch[1])) return imgMatch[1];
  }

  // Try to find image embedded in description HTML
  const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1] && isValidImageUrl(imgMatch[1])) return imgMatch[1];

  return undefined;
}

// Check if URL is a valid image URL
function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  const lowerUrl = url.toLowerCase();
  return (
    lowerUrl.includes('.jpg') ||
    lowerUrl.includes('.jpeg') ||
    lowerUrl.includes('.png') ||
    lowerUrl.includes('.webp') ||
    lowerUrl.includes('.gif') ||
    lowerUrl.includes('/image') ||
    lowerUrl.includes('/img') ||
    lowerUrl.includes('cloudinary') ||
    lowerUrl.includes('imgix')
  );
}

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

    // Extract image before cleaning description
    const imageUrl = extractImageFromItem(item, description);

    // Clean HTML from description
    const cleanDescription = description.replace(/<[^>]*>/g, '').trim();

    articles.push({
      title,
      link,
      description: cleanDescription,
      pubDate,
      source: sourceName,
      imageUrl,
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
  imageUrl?: string;
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
    imageUrl: article.imageUrl,
  };
}

// Distribute articles: ALL CoinDesk first, then fill with CoinTelegraph
function distributeArticles(
  articlesBySource: Record<string, RSSArticle[]>,
  totalLimit: number
): RSSArticle[] {
  const result: RSSArticle[] = [];

  // Add ALL CoinDesk articles first (up to limit)
  const coinDeskArticles = articlesBySource['CoinDesk'] || [];
  result.push(...coinDeskArticles.slice(0, totalLimit));

  // Fill remaining slots with CoinTelegraph
  if (result.length < totalLimit) {
    const remaining = totalLimit - result.length;
    const coinTelegraphArticles = articlesBySource['CoinTelegraph'] || [];
    result.push(...coinTelegraphArticles.slice(0, remaining));
  }

  return result;
}

// --- Module-level cache ---
interface NewsCache {
  data: NewsItem[];
  fetchedAt: number;
}

const NEWS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let newsCache: NewsCache | null = null;
let pendingFetch: Promise<NewsItem[]> | null = null;

/** Fire-and-forget prefetch — call at page mount to pre-warm the cache */
export function prefetchNews(): void {
  fetchRSSNewsCached(100);
}

async function fetchRSSNewsCached(limit: number): Promise<NewsItem[]> {
  const now = Date.now();

  // Return cached data if still fresh
  if (newsCache && now - newsCache.fetchedAt < NEWS_CACHE_TTL_MS) {
    return newsCache.data.slice(0, limit);
  }

  // Reuse the in-flight request rather than firing a duplicate fetch
  if (!pendingFetch) {
    pendingFetch = fetchRSSNews()
      .then((data) => {
        newsCache = { data, fetchedAt: Date.now() };
        pendingFetch = null;
        return data;
      })
      .catch((err) => {
        pendingFetch = null;
        throw err;
      });
  }

  const data = await pendingFetch;
  return data.slice(0, limit);
}

// Fetch and parse RSS feeds from multiple sources
async function fetchRSSNews(): Promise<NewsItem[]> {
  // Fetch all RSS feeds in parallel
  const feedPromises = RSS_FEEDS.map(async (feed) => {
    try {
      // Use CORS proxy for feeds that don't support CORS
      const fetchUrl = feed.needsProxy
        ? `${CORS_PROXY}${encodeURIComponent(feed.url)}`
        : feed.url;

      const response = await fetch(fetchUrl, { redirect: 'follow' });
      if (!response.ok) {
        console.warn(`Failed to fetch ${feed.source} RSS: ${response.status}`);
        return { source: feed.source, articles: [] as RSSArticle[] };
      }
      const xmlText = await response.text();
      const articles = parseRSSFeed(xmlText, feed.source);
      return { source: feed.source, articles };
    } catch (error) {
      console.warn(`Error fetching ${feed.source} RSS:`, error);
      return { source: feed.source, articles: [] as RSSArticle[] };
    }
  });

  const feedResults = await Promise.all(feedPromises);

  // Group stablecoin-related articles by source
  const articlesBySource: Record<string, RSSArticle[]> = {};
  for (const { source, articles } of feedResults) {
    const stablecoinArticles = articles.filter(isStablecoinRelated);
    // Sort each source's articles by date
    stablecoinArticles.sort((a, b) =>
      new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );
    articlesBySource[source] = stablecoinArticles;
  }

  // Distribute articles according to source preferences (fetch up to 100 for cache)
  const distributedArticles = distributeArticles(articlesBySource, 100);

  // Map to NewsItem
  return distributedArticles.map(mapRSSToNewsItem);
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
    source: 'CoinTelegraph',
    url: 'https://cointelegraph.com',
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

interface UseApiResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Apply filters to news data
function applyNewsFilters(newsData: NewsItem[], filters?: NewsFilters): NewsItem[] {
  let filtered = [...newsData];

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(search) ||
        item.summary.toLowerCase().includes(search)
    );
  }

  if (filters?.asset) {
    filtered = filtered.filter((item) =>
      item.assetSymbols.includes(filters.asset!)
    );
  }

  if (filters?.country) {
    filtered = filtered.filter((item) =>
      item.countryIsoCodes.includes(filters.country!)
    );
  }

  if (filters?.topic && filters.topic !== 'all') {
    filtered = filtered.filter((item) =>
      item.topics.includes(filters.topic as TopicTag)
    );
  }

  if (filters?.source && filters.source !== 'all') {
    filtered = filtered.filter((item) => item.source === filters.source);
  }

  return filtered;
}

// Paginated news hook for News page with "Load More" functionality
interface UsePaginatedNewsResult {
  data: NewsItem[] | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
}

export function usePaginatedNews(
  filters?: NewsFilters,
  pageSize: number = 12
): UsePaginatedNewsResult {
  const [allData, setAllData] = useState<NewsItem[]>([]);
  const [displayedData, setDisplayedData] = useState<NewsItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    setCurrentPage(1);
    try {
      // Fetch more articles for pagination
      let newsData = await fetchRSSNewsCached(100);

      // Fall back to mock data if no stablecoin articles found
      if (newsData.length === 0) {
        newsData = [...mockNews];
      }

      // Apply filters
      newsData = applyNewsFilters(newsData, filters);

      setAllData(newsData);
      setDisplayedData(newsData.slice(0, pageSize));
      setError(null);
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setAllData(mockNews);
      setDisplayedData(mockNews.slice(0, pageSize));
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.search, filters?.asset, filters?.country, filters?.topic, filters?.source, pageSize]);

  const loadMore = useCallback(() => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    const endIndex = nextPage * pageSize;

    // Simulate slight delay for UX
    setTimeout(() => {
      setDisplayedData(allData.slice(0, endIndex));
      setCurrentPage(nextPage);
      setIsLoadingMore(false);
    }, 300);
  }, [allData, currentPage, pageSize, isLoadingMore]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const hasMore = displayedData ? displayedData.length < allData.length : false;

  return {
    data: displayedData,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refetch: fetchNews,
  };
}

export function useTopHeadlines(limit: number = 5): UseApiResult<NewsItem[]> {
  const [data, setData] = useState<NewsItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchHeadlines = useCallback(async () => {
    setIsLoading(true);
    try {
      // Try to fetch from RSS feeds first (uses cache if available)
      let newsData = await fetchRSSNewsCached(limit);

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

