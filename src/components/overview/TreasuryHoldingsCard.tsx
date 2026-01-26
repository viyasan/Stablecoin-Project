import { Landmark } from 'lucide-react';

// Static data - update periodically from US Treasury TIC Data
// Source: https://ticdata.treasury.gov/resource-center/data-chart-center/tic/Documents/slt_table5.html
// Last updated: November 2025 TIC Data

interface HolderData {
  name: string;
  holdings: number; // in billions
  globalRank: number;
  type: 'country' | 'stablecoin';
  flag?: string;
}

// Top 8 foreign holders of US Treasury securities (November 2025)
// Plus stablecoin issuers with their actual global rankings
const HOLDERS: HolderData[] = [
  { name: 'Japan', holdings: 1202.6, globalRank: 1, type: 'country', flag: '🇯🇵' },
  { name: 'United Kingdom', holdings: 888.5, globalRank: 2, type: 'country', flag: '🇬🇧' },
  { name: 'China', holdings: 682.6, globalRank: 3, type: 'country', flag: '🇨🇳' },
  { name: 'Belgium', holdings: 481.0, globalRank: 4, type: 'country', flag: '🇧🇪' },
  { name: 'Canada', holdings: 472.2, globalRank: 5, type: 'country', flag: '🇨🇦' },
  { name: 'Cayman Islands', holdings: 427.4, globalRank: 6, type: 'country', flag: '🇰🇾' },
  { name: 'Luxembourg', holdings: 425.6, globalRank: 7, type: 'country', flag: '🇱🇺' },
  { name: 'France', holdings: 376.1, globalRank: 8, type: 'country', flag: '🇫🇷' },
  // Stablecoin issuers with actual global rankings
  // Tether: ~$135B - ranks 17th globally (Source: Tether Q3 2025 attestation)
  // https://tether.io/news/tether-attestation-reports-q1-q3-2025-profit-surpassing-10b-record-levels-in-us-treasuries-exposure/
  { name: 'Tether (USDT)', holdings: 135, globalRank: 17, type: 'stablecoin' },
  // Circle USDC: ~$62B - ranks ~23rd globally (estimated based on TIC data)
  // https://www.circle.com/transparency
  { name: 'Circle (USDC)', holdings: 62, globalRank: 23, type: 'stablecoin' },
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              US Treasury Holdings
            </h2>
          </div>
          <a
            href="https://ticdata.treasury.gov/resource-center/data-chart-center/tic/Documents/slt_table5.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Source: Nov 2025 TIC
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Global rankings of foreign holders
        </p>
      </div>

      <div className="px-6 py-4">
        {/* Stablecoin highlight */}
        <div className="mb-4 p-3 bg-primary-50 rounded-lg border border-primary-100">
          <p className="text-xs font-medium text-primary-600 uppercase tracking-wide mb-1">
            Combined Stablecoin Holdings
          </p>
          <p className="text-2xl font-bold font-mono-numbers text-primary-700">
            {formatBillions(stablecoinTotal)}
          </p>
          <p className="text-xs text-primary-600 mt-1">
            Stablecoin issuers are emerging as major Treasury holders
          </p>
        </div>

        {/* Top 8 Countries */}
        <div className="space-y-2.5">
          {countries.map((holder) => (
            <div key={holder.name} className="flex items-center gap-3">
              {/* Global Rank */}
              <div className="w-7 text-center shrink-0">
                <span className="text-xs font-semibold text-gray-400">
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
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {holder.name}
                  </span>
                  <span className="text-sm font-mono-numbers text-gray-600 ml-2">
                    {formatBillions(holder.holdings)}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gray-300"
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
                <span className="text-xs font-semibold text-primary-600">
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
                  <span className="text-sm font-medium text-primary-700 truncate">
                    {holder.name}
                  </span>
                  <span className="text-sm font-mono-numbers text-gray-600 ml-2">
                    {formatBillions(holder.holdings)}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary-500"
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
