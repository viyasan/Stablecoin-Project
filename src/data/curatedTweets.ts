export interface CuratedTweet {
  id: string;
  handle: string;
}

export const curatedTweets: CuratedTweet[] = [
  // Cointelegraph (@Cointelegraph)
  { id: '2030708225843380360', handle: 'Cointelegraph' }, // Stablecoin market cap hits new ATH of $313B (Mar 8)
  { id: '2030342716400513360', handle: 'Cointelegraph' }, // USDC flipped Tether in transfer volume, $1.8T record (Mar 7)

  // Arkham (@arkabordeaux)
  { id: '2030154691456422244', handle: 'arkham' },         // Circle minted $3B+ USDC in first week of March (Mar 6)

  // Eleanor Terrett (@EleanorTerrett)
  { id: '2028527442588037405', handle: 'EleanorTerrett' }, // March brings another shot at Clarity Act markup (Mar 2)
  { id: '2027522444962013569', handle: 'EleanorTerrett' }, // Crypto industry defending White House on stablecoin yield (Feb 28)
  { id: '2026842617967702059', handle: 'EleanorTerrett' }, // OCC proposed rule to implement GENIUS Act (Feb 26)

  // Brian Armstrong (@brian_armstrong)
  { id: '2026418502022664637', handle: 'brian_armstrong' }, // UK stablecoin rules risk making UK uncompetitive (Feb 25)
  { id: '2008929016565404003', handle: 'brian_armstrong' }, // China paying interest on stablecoin, US falling behind (Jan 13)
  { id: '2006855956840239265', handle: 'brian_armstrong' }, // 2026 priorities: scale stablecoins (Jan 1)

  // Watcher Guru (@WatcherGuru)
  { id: '2026311903845531987', handle: 'WatcherGuru' },    // Meta plans stablecoin integration in H2 2026 (Feb 24)
  { id: '2009388378085572611', handle: 'WatcherGuru' },    // Stablecoin transaction volume hits $33T record (Jan 8)

  // Cointelegraph (@Cointelegraph)
  { id: '2017387591339737467', handle: 'Cointelegraph' },  // Tether Q4: $10B net profit, $141B Treasury exposure (Feb 3)

  // Paolo Ardoino (@paoloardoino)
  { id: '2008890564607967582', handle: 'paoloardoino' },   // Rumble Wallet: freedom, decentralization, free speech (Jan 7)
  { id: '2006366800645386555', handle: 'paoloardoino' },   // Tether's 2026 product roadmap is majestic (Dec 31)

  // Circle (@circle)
  { id: '1970473231757795685', handle: 'circle' },         // USDC and CCTP V2 live on Plume Network

  // Nic Carter (@nic__carter)
  { id: '1984235250981974517', handle: 'nic__carter' },    // Crypto is boring because open questions have been answered
  { id: '1973399535092171216', handle: 'nic__carter' },    // The stablecoin duopoly is ending
];

export const CURATED_TWEETS_LAST_UPDATED = '2026-03-11';

// X List ID for the embedded live timeline
// To find: go to your X list URL (e.g., https://x.com/i/lists/123456789) — the number is the list ID
export const X_LIST_ID = '2031824041691222475';
