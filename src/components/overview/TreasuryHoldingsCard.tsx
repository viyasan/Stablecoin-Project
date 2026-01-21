import { Landmark, Loader2 } from 'lucide-react';
import { useStablecoinReserves } from '../../api/marketApi';

// Static country data - update periodically from US Treasury TIC Data
// Source: https://ticdata.treasury.gov/resource-center/data-chart-center/tic/Documents/slt_table5.html
// Last updated: January 2026
interface CountryData {
  name: string;
  holdings: number; // in billions
  flag: string;
}

const COUNTRIES: CountryData[] = [
  { name: 'Japan', holdings: 1180, flag: '🇯🇵' },
  { name: 'United Kingdom', holdings: 865, flag: '🇬🇧' },
  { name: 'China', holdings: 784, flag: '🇨🇳' },
  { name: 'Belgium', holdings: 466, flag: '🇧🇪' },
  { name: 'Luxembourg', holdings: 421, flag: '🇱🇺' },
  { name: 'South Korea', holdings: 130, flag: '🇰🇷' },
];

function formatBillions(value: number): string {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(2)}T`;
  }
  return `$${Math.round(value)}B`;
}

export function TreasuryHoldingsCard() {
  const { data: reservesData, isLoading, error } = useStablecoinReserves();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !reservesData) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Failed to load data</p>
      </div>
    );
  }

  // Calculate live Treasury holdings from stablecoin market caps
  const usdtTreasuryHoldings = (reservesData.usdt.usTreasuryPercentage / 100) * reservesData.usdt.marketCap / 1_000_000_000; // Convert to billions
  const usdcTreasuryHoldings = (reservesData.usdc.usTreasuryPercentage / 100) * reservesData.usdc.marketCap / 1_000_000_000;

  // Combine stablecoin and country data
  interface HolderData {
    name: string;
    holdings: number;
    type: 'stablecoin' | 'country';
    flag?: string;
  }

  const allHolders: HolderData[] = [
    ...COUNTRIES.map((c) => ({ ...c, type: 'country' as const })),
    { name: 'Tether (USDT)', holdings: usdtTreasuryHoldings, type: 'stablecoin' as const },
    { name: 'Circle (USDC)', holdings: usdcTreasuryHoldings, type: 'stablecoin' as const },
  ].sort((a, b) => b.holdings - a.holdings);

  const stablecoinTotal = usdtTreasuryHoldings + usdcTreasuryHoldings;
  const maxHoldings = Math.max(...allHolders.map((h) => h.holdings));

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
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Stablecoin issuers vs. countries
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
            Tether + Circle hold more than South Korea
          </p>
        </div>

        {/* Holdings list */}
        <div className="space-y-3">
          {allHolders.map((holder) => (
            <div key={holder.name} className="flex items-center gap-3">
              {/* Icon/Flag */}
              <div className="w-6 text-center shrink-0">
                {holder.type === 'stablecoin' ? (
                  <span className="text-xs font-bold text-primary-600">₮</span>
                ) : (
                  <span className="text-sm">{holder.flag}</span>
                )}
              </div>

              {/* Name and bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium truncate ${
                    holder.type === 'stablecoin' ? 'text-primary-700' : 'text-gray-700'
                  }`}>
                    {holder.name}
                  </span>
                  <span className="text-sm font-mono-numbers text-gray-600 ml-2">
                    {formatBillions(holder.holdings)}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      holder.type === 'stablecoin'
                        ? 'bg-primary-500'
                        : 'bg-gray-300'
                    }`}
                    style={{ width: `${(holder.holdings / maxHoldings) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Source */}
        <p className="text-xs text-gray-400 mt-4 pt-3 border-t border-gray-100 flex items-center gap-1 flex-wrap">
          <span className="italic">Powered by</span>
          <a
            href="https://ticdata.treasury.gov/resource-center/data-chart-center/tic/Documents/slt_table5.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-150"
          >
            US Treasury
          </a>
          <span>,</span>
          <a
            href="https://tether.to/en/transparency/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-150"
          >
            Tether
          </a>
          <span>&</span>
          <a
            href="https://www.circle.com/en/transparency"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-150"
          >
            Circle
          </a>
        </p>
      </div>
    </div>
  );
}
