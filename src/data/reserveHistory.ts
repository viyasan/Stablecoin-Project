export interface ReserveSnapshot {
  date: string;               // ISO date: '2026-03-06'
  reportPeriod: string;       // Human label: 'Mar 6, 2026' or 'Q4 2025'
  totalReserves: number;      // Total reserve value in dollars
  circulatingSupply: number;  // Circulating supply at time of report
  backingRatio: number;       // totalReserves / circulatingSupply
  treasuryHoldings: number;   // US Treasury exposure in dollars
  assets: {
    name: string;
    percentage: number;
    value: number;            // Dollar amount
    color: string;
  }[];
  source: string;             // URL to attestation/report
}

export type CoinSymbol = 'USDT' | 'USDC' | 'DAI';

export interface StablecoinReserveHistory {
  symbol: CoinSymbol;
  name: string;
  issuer: string;
  reportFrequency: 'weekly' | 'monthly' | 'quarterly' | 'on-chain';
  history: ReserveSnapshot[];
}

// Seed data from existing attestation reports
// Sources:
// Tether Q4 2025: https://tether.to/en/transparency/
// Circle Mar 2026: https://www.circle.com/transparency

export const reserveHistories: StablecoinReserveHistory[] = [
  {
    symbol: 'USDT',
    name: 'Tether',
    issuer: 'Tether Holdings Ltd.',
    reportFrequency: 'quarterly',
    history: [
      {
        date: '2025-12-31',
        reportPeriod: 'Q4 2025',
        totalReserves: 143_000_000_000,
        circulatingSupply: 141_000_000_000,
        backingRatio: 1.014,
        treasuryHoldings: 141_000_000_000,
        assets: [
          { name: 'US Treasuries', percentage: 73, value: 104_430_000_000, color: '#E2B050' },
          { name: 'Gold', percentage: 9, value: 12_870_000_000, color: '#D4A437' },
          { name: 'Bitcoin', percentage: 4, value: 5_720_000_000, color: '#CD7F32' },
          { name: 'Secured Loans & Other', percentage: 14, value: 20_020_000_000, color: '#ADB5BD' },
        ],
        source: 'https://tether.to/en/transparency/',
      },
    ],
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    issuer: 'Circle Internet Financial',
    reportFrequency: 'monthly',
    history: [
      {
        date: '2026-03-06',
        reportPeriod: 'Mar 6, 2026',
        totalReserves: 76_200_000_000,
        circulatingSupply: 76_000_000_000,
        backingRatio: 1.003,
        treasuryHoldings: 45_400_000_000,
        assets: [
          { name: 'US Treasuries', percentage: 59, value: 44_750_000_000, color: '#D4A437' },
          { name: 'Cash & Bank Deposits', percentage: 41, value: 31_450_000_000, color: '#CD7F32' },
        ],
        source: 'https://www.circle.com/transparency',
      },
    ],
  },
  {
    symbol: 'DAI',
    name: 'Dai',
    issuer: 'Sky (formerly MakerDAO)',
    reportFrequency: 'on-chain',
    history: [],
  },
];
