import { useState, useEffect, useCallback } from 'react';
import type { NewsItem, TopicTag } from '../types';

// CORS proxy for RSS feeds
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// RSS Feed sources for the Live page
const RSS_FEEDS = [
  { url: 'https://www.theblock.co/rss.xml', source: 'The Block', needsProxy: true, cryptoNative: true },
  { url: 'https://decrypt.co/feed', source: 'Decrypt', needsProxy: true, cryptoNative: true },
  { url: 'https://blockworks.co/feed', source: 'Blockworks', needsProxy: true, cryptoNative: true },
  { url: 'https://techcrunch.com/feed/', source: 'TechCrunch', needsProxy: true, cryptoNative: false },
  { url: 'https://betakit.com/feed/', source: 'BetaKit', needsProxy: true, cryptoNative: false },
];

// Stablecoin + fintech keywords for filtering general sources
const STABLECOIN_FINTECH_KEYWORDS = [
  'stablecoin', 'stablecoins',
  'usdt', 'tether',
  'usdc', 'circle',
  'dai', 'makerdao',
  'pyusd', 'paypal',
  'busd', 'tusd', 'frax', 'usdd', 'gusd', 'fdusd', 'eurs',
  'cadc', 'qcad', 'cadd',
  'cbdc', 'digital dollar', 'digital euro',
  'reserve', 'peg', 'depeg',
  'fintech', 'crypto', 'blockchain', 'defi',
  'digital payments', 'tokeniz', 'web3',
];

interface RSSArticle {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  imageUrl?: string;
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

// Extract image URL from RSS item using various common formats
function extractImageFromItem(item: Element, description: string): string | undefined {
  // Try media:content
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

  // Try enclosure
  const enclosure = item.querySelector('enclosure');
  if (enclosure) {
    const type = enclosure.getAttribute('type') || '';
    const url = enclosure.getAttribute('url');
    if (url && type.startsWith('image/')) return url;
  }

  // Try content:encoded
  const contentEncoded = item.querySelector('encoded');
  if (contentEncoded?.textContent) {
    const imgMatch = contentEncoded.textContent.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (imgMatch?.[1] && isValidImageUrl(imgMatch[1])) return imgMatch[1];
  }

  // Try image in description HTML
  const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1] && isValidImageUrl(imgMatch[1])) return imgMatch[1];

  return undefined;
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

    const imageUrl = extractImageFromItem(item, description);
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

// Check if article matches stablecoin/fintech keywords
function isRelevantArticle(article: RSSArticle): boolean {
  const searchText = `${article.title} ${article.description}`.toLowerCase();
  return STABLECOIN_FINTECH_KEYWORDS.some(keyword => searchText.includes(keyword.toLowerCase()));
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

// --- Module-level cache ---
interface NewsCache {
  data: NewsItem[];
  fetchedAt: number;
}

const LIVE_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let liveNewsCache: NewsCache | null = null;
let livePendingFetch: Promise<NewsItem[]> | null = null;

async function fetchLiveNewsCached(limit: number): Promise<NewsItem[]> {
  const now = Date.now();

  if (liveNewsCache && now - liveNewsCache.fetchedAt < LIVE_CACHE_TTL_MS) {
    return liveNewsCache.data.slice(0, limit);
  }

  if (!livePendingFetch) {
    livePendingFetch = fetchLiveNews()
      .then((data) => {
        liveNewsCache = { data, fetchedAt: Date.now() };
        livePendingFetch = null;
        return data;
      })
      .catch((err) => {
        livePendingFetch = null;
        throw err;
      });
  }

  const data = await livePendingFetch;
  return data.slice(0, limit);
}

// Fetch and parse RSS feeds from all Live page sources
async function fetchLiveNews(): Promise<NewsItem[]> {
  const feedPromises = RSS_FEEDS.map(async (feed) => {
    try {
      const fetchUrl = feed.needsProxy
        ? `${CORS_PROXY}${encodeURIComponent(feed.url)}`
        : feed.url;

      const response = await fetch(fetchUrl, { redirect: 'follow' });
      if (!response.ok) {
        console.warn(`Failed to fetch ${feed.source} RSS: ${response.status}`);
        return { source: feed.source, articles: [] as RSSArticle[], cryptoNative: feed.cryptoNative };
      }
      const xmlText = await response.text();
      const articles = parseRSSFeed(xmlText, feed.source);
      return { source: feed.source, articles, cryptoNative: feed.cryptoNative };
    } catch (error) {
      console.warn(`Error fetching ${feed.source} RSS:`, error);
      return { source: feed.source, articles: [] as RSSArticle[], cryptoNative: feed.cryptoNative };
    }
  });

  const feedResults = await Promise.all(feedPromises);

  // Collect all relevant articles
  const allArticles: RSSArticle[] = [];

  for (const { articles, cryptoNative } of feedResults) {
    if (cryptoNative) {
      // Crypto-native sources: include all articles
      allArticles.push(...articles);
    } else {
      // General sources: filter by stablecoin/fintech keywords
      allArticles.push(...articles.filter(isRelevantArticle));
    }
  }

  // Sort all articles by date (newest first)
  allArticles.sort((a, b) =>
    new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  // Map to NewsItem
  return allArticles.map(mapRSSToNewsItem);
}

// Paginated news hook for Live page
interface UseLiveNewsResult {
  data: NewsItem[] | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
}

export function useLiveNews(pageSize: number = 12): UseLiveNewsResult {
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
      const newsData = await fetchLiveNewsCached(100);
      setAllData(newsData);
      setDisplayedData(newsData.slice(0, pageSize));
      setError(null);
    } catch (err) {
      console.error('Failed to fetch live news:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch news'));
      setAllData([]);
      setDisplayedData([]);
    } finally {
      setIsLoading(false);
    }
  }, [pageSize]);

  const loadMore = useCallback(() => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    const endIndex = nextPage * pageSize;

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
