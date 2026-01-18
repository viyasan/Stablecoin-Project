import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMarketSummary, useStablecoinList, useMarketCapChart } from '../../api';
import { SkeletonKpiCard, Sparkline } from '../common';

function formatCurrency(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  return `$${value.toLocaleString()}`;
}

function formatCurrencyChange(value: number): string {
  const absValue = Math.abs(value);
  const sign = value >= 0 ? '+$' : '-$';
  if (absValue >= 1_000_000_000_000) {
    return `${sign}${(absValue / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (absValue >= 1_000_000_000) {
    return `${sign}${(absValue / 1_000_000_000).toFixed(2)}B`;
  }
  if (absValue >= 1_000_000) {
    return `${sign}${(absValue / 1_000_000).toFixed(2)}M`;
  }
  return `${sign}${absValue.toLocaleString()}`;
}

function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function formatLastUpdated(isoString: string): string {
  const date = new Date(isoString);

  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Add ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
  const ordinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  // Format as 12-hour time with am/pm
  const period = hours >= 12 ? 'pm' : 'am';
  const hour12 = hours % 12 || 12;

  return `${month} ${ordinal(day)} at ${hour12}:${minutes}${period}`;
}

interface KpiItemProps {
  label: string;
  value: string;
  change?: number;
  changeValue?: number;
  subtext?: string;
  valueColorClass?: string;
}

function KpiItem({ label, value, change, changeValue, subtext, valueColorClass }: KpiItemProps) {
  const isPositive = change !== undefined ? change >= 0 : (changeValue !== undefined ? changeValue >= 0 : true);
  const colorClass = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <div className="flex flex-col items-center justify-center px-4 py-2">
      <p className="text-sm font-medium text-gray-500 mb-1 text-center">{label}</p>
      <p className={`text-2xl lg:text-3xl font-bold font-mono-numbers text-center ${valueColorClass || 'text-gray-900'}`}>{value}</p>
      {changeValue !== undefined && change !== undefined ? (
        <p className={`text-sm font-medium mt-1 text-center ${colorClass}`}>
          {formatCurrencyChange(changeValue)} ({formatPercent(change)})
        </p>
      ) : change !== undefined ? (
        <p className={`text-sm font-medium mt-1 text-center ${colorClass}`}>
          {formatPercent(change)}
        </p>
      ) : null}
      {subtext && <p className="text-xs text-gray-400 mt-1 text-center">{subtext}</p>}
    </div>
  );
}

interface TrackedAssetsKpiProps {
  count: number;
}

function TrackedAssetsKpi({ count }: TrackedAssetsKpiProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { data: stablecoins } = useStablecoinList();

  // Calculate breakdowns
  const pegBreakdown = { USD: 0, EUR: 0, JPY: 0, GBP: 0, SGD: 0, OTHER: 0 };
  const issuerBreakdown = { 'fiat-backed': 0, 'crypto-collateralized': 0, algorithmic: 0 };

  if (stablecoins) {
    for (const coin of stablecoins) {
      pegBreakdown[coin.pegCurrency] = (pegBreakdown[coin.pegCurrency] || 0) + 1;
      issuerBreakdown[coin.issuerType] = (issuerBreakdown[coin.issuerType] || 0) + 1;
    }
  }

  return (
    <div
      className="flex flex-col items-center justify-center px-4 py-2 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p className="text-sm font-medium text-gray-500 mb-1 text-center">Tracked Assets</p>
      <p className="text-2xl lg:text-3xl font-bold font-mono-numbers text-gray-900 cursor-pointer hover:text-primary-600 transition-colors text-center">
        {count}
      </p>

      {/* Hover Popover */}
      {isHovered && stablecoins && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 text-left">
          {/* Arrow */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45" />

          {/* Peg Type Breakdown */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              By Peg Type
            </h4>
            <div className="space-y-1">
              {pegBreakdown.USD > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">USD-pegged</span>
                  <span className="font-medium text-gray-900">{pegBreakdown.USD}</span>
                </div>
              )}
              {pegBreakdown.EUR > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">EUR-pegged</span>
                  <span className="font-medium text-gray-900">{pegBreakdown.EUR}</span>
                </div>
              )}
              {pegBreakdown.JPY > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">JPY-pegged</span>
                  <span className="font-medium text-gray-900">{pegBreakdown.JPY}</span>
                </div>
              )}
              {pegBreakdown.GBP > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GBP-pegged</span>
                  <span className="font-medium text-gray-900">{pegBreakdown.GBP}</span>
                </div>
              )}
              {pegBreakdown.SGD > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">SGD-pegged</span>
                  <span className="font-medium text-gray-900">{pegBreakdown.SGD}</span>
                </div>
              )}
              {pegBreakdown.OTHER > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Other</span>
                  <span className="font-medium text-gray-900">{pegBreakdown.OTHER}</span>
                </div>
              )}
            </div>
          </div>

          {/* Issuer Type Breakdown */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              By Issuer Type
            </h4>
            <div className="space-y-1">
              {issuerBreakdown['fiat-backed'] > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fiat-backed</span>
                  <span className="font-medium text-gray-900">{issuerBreakdown['fiat-backed']}</span>
                </div>
              )}
              {issuerBreakdown['crypto-collateralized'] > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Crypto-backed</span>
                  <span className="font-medium text-gray-900">{issuerBreakdown['crypto-collateralized']}</span>
                </div>
              )}
              {issuerBreakdown.algorithmic > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Algorithmic</span>
                  <span className="font-medium text-gray-900">{issuerBreakdown.algorithmic}</span>
                </div>
              )}
            </div>
          </div>

          {/* View All Link */}
          <Link
            to="/canada"
            className="block w-full text-center text-sm font-medium text-primary-600 hover:text-primary-700 pt-3 border-t border-gray-100"
          >
            View all assets →
          </Link>
        </div>
      )}
    </div>
  );
}

type ViewMode = 'total' | '7d' | '30d';

export function GlobalKpiCard() {
  const [viewMode, setViewMode] = useState<ViewMode>('total');
  const { data, isLoading, error, refetch } = useMarketSummary();
  const { data: chartData } = useMarketCapChart('30d');

  // Extract sparkline data (last 30 days of market cap values)
  const sparklineData = chartData?.map((point) => point.totalMarketCap) || [];

  if (isLoading) {
    return <SkeletonKpiCard showSparkline={true} />;
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Failed to load market data</p>
          <button
            onClick={refetch}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Calculate historical market cap values
  const marketCap7dAgo = data.totalMarketCap / (1 + data.change7d / 100);
  const marketCap30dAgo = data.totalMarketCap / (1 + data.change30d / 100);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Global Stablecoin Market
          </h2>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            Powered by
            <a
              href="https://defillama.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              DefiLlama
            </a>
          </span>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('total')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'total'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setViewMode('7d')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === '7d'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            7D Change
          </button>
          <button
            onClick={() => setViewMode('30d')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === '30d'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            30D Change
          </button>
        </div>
      </div>
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {viewMode === 'total' && (
            <>
              <div className="flex flex-col items-center justify-center px-4 py-2">
                <p className="text-sm font-medium text-gray-500 mb-1 text-center">Total Market Cap</p>
                <p className="text-2xl lg:text-3xl font-bold font-mono-numbers text-gray-900 text-center">
                  {formatCurrency(data.totalMarketCap)}
                </p>
                {sparklineData.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <Sparkline
                      data={sparklineData}
                      width={80}
                      height={24}
                      color="auto"
                    />
                    <span className={`text-xs font-medium ${data.change30d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercent(data.change30d)} (30d)
                    </span>
                  </div>
                )}
              </div>
              <TrackedAssetsKpi count={data.trackedStablecoins} />
            </>
          )}

          {viewMode === '7d' && (
            <>
              <div className="flex flex-col items-center justify-center px-4 py-2">
                <p className="text-sm font-medium text-gray-500 mb-1 text-center">Market Cap (7 days ago)</p>
                <p className="text-2xl lg:text-3xl font-bold font-mono-numbers text-gray-900 text-center">{formatCurrency(marketCap7dAgo)}</p>
                {sparklineData.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <Sparkline
                      data={sparklineData.slice(-7)}
                      width={60}
                      height={20}
                      color="auto"
                    />
                    <span className={`text-xs font-medium ${data.change7d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercent(data.change7d)}
                    </span>
                  </div>
                )}
              </div>
              <TrackedAssetsKpi count={data.trackedStablecoins} />
            </>
          )}

          {viewMode === '30d' && (
            <>
              <div className="flex flex-col items-center justify-center px-4 py-2">
                <p className="text-sm font-medium text-gray-500 mb-1 text-center">Market Cap (30 days ago)</p>
                <p className="text-2xl lg:text-3xl font-bold font-mono-numbers text-gray-900 text-center">{formatCurrency(marketCap30dAgo)}</p>
                {sparklineData.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <Sparkline
                      data={sparklineData}
                      width={80}
                      height={20}
                      color="auto"
                    />
                    <span className={`text-xs font-medium ${data.change30d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercent(data.change30d)}
                    </span>
                  </div>
                )}
              </div>
              <TrackedAssetsKpi count={data.trackedStablecoins} />
            </>
          )}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400">
          <span>Last updated: {formatLastUpdated(data.lastUpdated)}</span>
        </div>
      </div>
    </div>
  );
}
