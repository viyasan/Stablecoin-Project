import { Landmark } from 'lucide-react';

// Static data - update periodically from US Treasury TIC Data
// Source: https://ticdata.treasury.gov/resource-center/data-chart-center/tic/Documents/slt_table5.html
// Last updated: February 2026 TIC Data (released April 2026)

interface HolderData {
  name: string;
  holdings: number; // in billions
  globalRank: number;
  type: 'country' | 'stablecoin';
  flag?: string;
}

// Top 8 foreign holders of US Treasury securities (February 2026)
// Plus stablecoin issuers with their actual global rankings
const HOLDERS: HolderData[] = [
  { name: 'Japan', holdings: 1240.0, globalRank: 1, type: 'country', flag: '🇯🇵' },
  { name: 'United Kingdom', holdings: 897.0, globalRank: 2, type: 'country', flag: '🇬🇧' },
  { name: 'Belgium', holdings: 455.0, globalRank: 3, type: 'country', flag: '🇧🇪' },
  { name: 'Canada', holdings: 446.0, globalRank: 4, type: 'country', flag: '🇨🇦' },
  { name: 'Luxembourg', holdings: 446.0, globalRank: 5, type: 'country', flag: '🇱🇺' },
  { name: 'Cayman Islands', holdings: 443.0, globalRank: 6, type: 'country', flag: '🇰🇾' },
  { name: 'Ireland', holdings: 351.0, globalRank: 7, type: 'country', flag: '🇮🇪' },
  { name: 'Taiwan', holdings: 314.0, globalRank: 8, type: 'country', flag: '🇹🇼' },
  // Stablecoin issuers with actual global rankings
  // Tether: ~$141B - ranks 17th globally (Source: Tether Q4 2025 attestation; Q1 2026 pending)
  // https://tether.io/news/tether-delivers-10b-profits-in-2025-6-3b-in-excess-reserves-and-record-141-billion-exposure-in-u-s-treasury-holdings/
  { name: 'Tether (USDT)', holdings: 141, globalRank: 17, type: 'stablecoin' },
  // Circle USDC: ~$54B in Treasury+repos as of Apr 2026 - ranks ~28th globally
  // https://www.circle.com/transparency
  { name: 'Circle (USDC)', holdings: 54, globalRank: 28, type: 'stablecoin' },
];

function formatBillions(value: number): string {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}T`;
  }
  return `$${Math.round(value)}B`;
}

export function TreasuryHoldingsCard() {
  const countries = HOLDERS.filter(h => h.type === 'country');
  const stablecoins = HOLDERS.filter(h => h.type === 'stablecoin');
  const maxHoldings = Math.max(...HOLDERS.map((h) => h.holdings));
  const stablecoinTotal = stablecoins.reduce((sum, s) => sum + s.holdings, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-chrome-200 h-full">
      <div className="px-6 py-4 border-b border-chrome-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-gold-500" />
            <h2 className="text-lg font-semibold text-chrome-900">
              US Treasury Holdings
            </h2>
          </div>
          <a
            href="https://ticdata.treasury.gov/resource-center/data-chart-center/tic/Documents/slt_table5.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-chrome-400 hover:text-chrome-600"
          >
            Source: Feb 2026 TIC
          </a>
        </div>
        <p className="text-xs text-chrome-500 mt-1">
          Global rankings of foreign holders
        </p>
      </div>

      <div className="px-6 py-4">
        {/* Stablecoin highlight */}
        <div className="mb-4 p-3 bg-gold-50 rounded-lg border border-gold-100">
          <p className="text-xs font-medium text-gold-500 uppercase tracking-wide mb-1">
            Combined Stablecoin Holdings
          </p>
          <p className="text-2xl font-bold font-mono-numbers text-gold-600">
            {formatBillions(stablecoinTotal)}
          </p>
          <p className="text-xs text-gold-500 mt-1">
            Stablecoin issuers are emerging as major Treasury holders
          </p>
        </div>

        {/* Top 8 Countries */}
        <div className="space-y-2.5">
          {countries.map((holder) => (
            <div key={holder.name} className="flex items-center gap-3">
              {/* Global Rank */}
              <div className="w-7 text-center shrink-0">
                <span className="text-xs font-semibold text-chrome-400">
                  #{holder.globalRank}
                </span>
              </div>

              {/* Flag */}
              <div className="w-6 text-center shrink-0">
                <span className="text-sm">{holder.flag}</span>
              </div>

              {/* Name and bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-chrome-700 truncate">
                    {holder.name}
                  </span>
                  <span className="text-sm font-mono-numbers text-chrome-600 ml-2">
                    {formatBillions(holder.holdings)}
                  </span>
                </div>
                <div className="h-2 bg-chrome-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-chrome-300"
                    style={{ width: `${(holder.holdings / maxHoldings) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stablecoin Issuers */}
        <div className="space-y-2.5 mt-2.5">
          {stablecoins.map((holder) => (
            <div key={holder.name} className="flex items-center gap-3">
              {/* Global Rank */}
              <div className="w-7 text-center shrink-0">
                <span className="text-xs font-semibold text-gold-500">
                  #{holder.globalRank}
                </span>
              </div>

              {/* Icon */}
              <div className="w-6 text-center shrink-0">
                {holder.name.includes('Tether') ? (
                  <span className="text-xs font-bold text-emerald-600">₮</span>
                ) : (
                  <img src="/circle-logo.png" alt="Circle" className="w-4 h-4 object-contain mx-auto" />
                )}
              </div>

              {/* Name and bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gold-600 truncate">
                    {holder.name}
                  </span>
                  <span className="text-sm font-mono-numbers text-chrome-600 ml-2">
                    {formatBillions(holder.holdings)}
                  </span>
                </div>
                <div className="h-2 bg-chrome-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gold-400"
                    style={{ width: `${(holder.holdings / maxHoldings) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
