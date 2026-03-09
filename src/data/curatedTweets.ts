export interface CuratedTweet {
  id: string;
  handle: string;
}

export const curatedTweets: CuratedTweet[] = [
  // Jeremy Allaire (@jerallaire)
  { id: '1988992291491492294', handle: 'jerallaire' },   // CashApp launching stablecoin support
  { id: '1896873550675591209', handle: 'jerallaire' },   // USDC approved for use in Japan
  { id: '1903212210794664193', handle: 'jerallaire' },   // GCash announces USDC support (~100M users)
  { id: '1866733181728366593', handle: 'jerallaire' },   // Circle and Binance strategic partnership

  // Paolo Ardoino (@paoloardoino)
  { id: '1980621793812512982', handle: 'paoloardoino' }, // USDT reached 500 million users
  { id: '1946292409068834935', handle: 'paoloardoino' }, // GENIUS Act signing, 500M users
  { id: '1945454937145495862', handle: 'paoloardoino' }, // 160B USDt milestone

  // Circle (@circle)
  { id: '1933147279244017903', handle: 'circle' },       // USDC live on XRP Ledger
  { id: '1970473231757795685', handle: 'circle' },       // USDC and CCTP V2 live on Plume Network

  // Tether (@Tether_to)
  { id: '1927379380218507709', handle: 'Tether_to' },    // 10 years of Tether, 400M+ users

  // Nic Carter (@nic__carter)
  { id: '1973399535092171216', handle: 'nic__carter' },   // "The stablecoin duopoly is ending"
  { id: '1928911722984656903', handle: 'nic__carter' },   // Commentary on the stablecoin bill

  // Brian Armstrong (@brian_armstrong)
  { id: '2006855956840239265', handle: 'brian_armstrong' }, // 2026 priorities: scale stablecoins
  { id: '2004693396074758287', handle: 'brian_armstrong' }, // GENIUS Act defense

  // Cointelegraph (@Cointelegraph)
  { id: '2030342716400513360', handle: 'Cointelegraph' }, // USDC flipped Tether in transfer volume
  { id: '2023110059321160065', handle: 'Cointelegraph' }, // Stablecoin market cap added $5.5B

  // The Block (@TheBlock__)
  { id: '2023653676150050892', handle: 'TheBlock__' },    // $300B stablecoin supply

  // Blockworks (@Blockworks_)
  { id: '2008554596428648646', handle: 'Blockworks_' },   // Stablecoins on Solana
];

export const CURATED_TWEETS_LAST_UPDATED = '2026-03-09';
