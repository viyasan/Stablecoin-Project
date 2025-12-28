export const config = {
  // CoinGecko API (free tier)
  coingeckoApiUrl: 'https://api.coingecko.com/api/v3',

  // Feature flags
  features: {
    enableExplainers: false,
    enableUserAccounts: false,
  },

  // Cache durations (in milliseconds)
  cache: {
    marketData: 5 * 60 * 1000, // 5 minutes
    newsData: 15 * 60 * 1000, // 15 minutes
    countryData: 60 * 60 * 1000, // 1 hour
  },
};
