export type TopicTag =
  | 'regulation'
  | 'depeg'
  | 'integration'
  | 'infrastructure'
  | 'payments'
  | 'reserve'
  | 'launch'
  | 'partnership';

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
  topics: TopicTag[];
  assetSymbols: string[];
  countryIsoCodes: string[];
  imageUrl?: string;
}

export interface NewsFilters {
  search?: string;
  asset?: string;
  country?: string;
  topic?: TopicTag | 'all';
  source?: string | 'all';
}
