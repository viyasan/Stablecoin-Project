export type PegCurrency = 'USD' | 'EUR' | 'GBP' | 'OTHER';

export type IssuerType = 'fiat-backed' | 'crypto-collateralized' | 'algorithmic';

export interface Stablecoin {
  id: string;
  symbol: string;
  name: string;
  pegCurrency: PegCurrency;
  issuerType: IssuerType;
  dominantChain: string;
  externalId?: string;
}

export interface MarketSnapshot {
  id: string;
  stablecoinId: string;
  timestamp: string;
  marketCapUsd: number;
  price: number;
  volume24h: number;
  priceDeviation: number; // percentage deviation from peg
}

export interface MarketSummary {
  totalMarketCap: number;
  change24h: number;
  change7d: number;
  change30d: number;
  trackedStablecoins: number;
  lastUpdated: string;
  dataSource: string;
}

export interface MarketCapDataPoint {
  timestamp: string;
  totalMarketCap: number;
  breakdown?: {
    symbol: string;
    marketCap: number;
  }[];
}

export interface StablecoinWithSnapshot extends Stablecoin {
  marketCap: number;
  volume24h: number;
  price: number;
  priceDeviation: number;
}

export interface MarketFilters {
  search?: string;
  pegCurrency?: PegCurrency | 'all';
  issuerType?: IssuerType | 'all';
  chain?: string;
  sortBy?: 'marketCap' | 'volume24h' | 'change7d' | 'age';
  sortOrder?: 'asc' | 'desc';
}
