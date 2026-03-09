export type PegCurrency = 'USD' | 'EUR' | 'JPY' | 'GBP' | 'SGD' | 'OTHER';

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
  change24hValue: number;
  change7d: number;
  change7dValue: number;
  change30d: number;
  change30dValue: number;
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

export interface ChainBreakdownEntry {
  chain: string;
  amount: number;  // circulating supply on this chain in USD
}

export interface StablecoinWithSnapshot extends Stablecoin {
  marketCap: number;
  volume24h: number;
  price: number;
  priceDeviation: number;
  change7d: number;
  change30d: number;
  chainBreakdown: ChainBreakdownEntry[];  // sorted descending by amount
}

export interface PegPricePoint {
  date: string;      // ISO timestamp
  price: number;     // e.g. 0.9999
  deviation: number; // percentage from peg, e.g. -0.01
}

export interface MarketFilters {
  search?: string;
  pegCurrency?: PegCurrency | 'all';
  issuerType?: IssuerType | 'all';
  chain?: string;
  sortBy?: 'marketCap' | 'volume24h' | 'change7d' | 'age';
  sortOrder?: 'asc' | 'desc';
}
