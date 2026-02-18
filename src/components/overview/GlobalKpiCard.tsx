import { useState, useRef } from 'react';
import { useMarketSummary, useStablecoinList, useMarketCapChart } from '../../api';
import { SkeletonKpiCard, Sparkline, TiltCard } from '../common';
import { useCountUp } from '../../hooks/useCountUp';
import { FadeInSlide } from '../common/FadeInSlide';

function formatCurrency(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(1)}T`;
  }
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  return `$${value.toLocaleString()}`;
}

function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  }
}

interface TrackedAssetsKpiProps {
  count: number;
}

function TrackedAssetsKpi({ count }: TrackedAssetsKpiProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { data: stablecoins } = useStablecoinList();

  // Animated counter for tracked assets
  const { displayValue: countDisplay } = useCountUp({
    end: count,
    duration: 1400,
    decimals: 0,
    easing: 'easeOut',
    shouldAnimate: true,
  });

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
      className="flex flex-col items-center justify-center px-4 py-4 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p className="text-sm font-medium text-chrome-500 uppercase tracking-wide mb-2 text-center">Tracked Assets</p>
      <p className="text-4xl lg:text-5xl font-bold font-mono-numbers text-chrome-900 cursor-pointer hover:text-gold-500 transition-colors text-center">
        {countDisplay}
      </p>
      {/* Spacer to match height of sparkline section */}
      <div className="mt-3 h-7" />

      {/* Hover Popover */}
      {isHovered && stablecoins && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-64 bg-white rounded-lg shadow-lg border border-chrome-200 p-4 text-left">
          {/* Arrow */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-chrome-200 rotate-45" />

          {/* Peg Type Breakdown */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-chrome-500 uppercase tracking-wide mb-2">
              By Peg Type
            </h4>
            <div className="space-y-1">
              {pegBreakdown.USD > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-chrome-600">USD-pegged</span>
                  <span className="font-medium text-chrome-900">{pegBreakdown.USD}</span>
                </div>
              )}
              {pegBreakdown.EUR > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-chrome-600">EUR-pegged</span>
                  <span className="font-medium text-chrome-900">{pegBreakdown.EUR}</span>
                </div>
              )}
              {pegBreakdown.JPY > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-chrome-600">JPY-pegged</span>
                  <span className="font-medium text-chrome-900">{pegBreakdown.JPY}</span>
                </div>
              )}
              {pegBreakdown.GBP > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-chrome-600">GBP-pegged</span>
                  <span className="font-medium text-chrome-900">{pegBreakdown.GBP}</span>
                </div>
              )}
              {pegBreakdown.SGD > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-chrome-600">SGD-pegged</span>
                  <span className="font-medium text-chrome-900">{pegBreakdown.SGD}</span>
                </div>
              )}
              {pegBreakdown.OTHER > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-chrome-600">Other</span>
                  <span className="font-medium text-chrome-900">{pegBreakdown.OTHER}</span>
                </div>
              )}
            </div>
          </div>

          {/* Issuer Type Breakdown */}
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-chrome-500 uppercase tracking-wide mb-2">
              By Issuer Type
            </h4>
            <div className="space-y-1">
              {issuerBreakdown['fiat-backed'] > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-chrome-600">Fiat-backed</span>
                  <span className="font-medium text-chrome-900">{issuerBreakdown['fiat-backed']}</span>
                </div>
              )}
              {issuerBreakdown['crypto-collateralized'] > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-chrome-600">Crypto-backed</span>
                  <span className="font-medium text-chrome-900">{issuerBreakdown['crypto-collateralized']}</span>
                </div>
              )}
              {issuerBreakdown.algorithmic > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-chrome-600">Algorithmic</span>
                  <span className="font-medium text-chrome-900">{issuerBreakdown.algorithmic}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

type ViewMode = 'total' | '7d' | '30d';

export function GlobalKpiCard() {
  const [viewMode, setViewMode] = useState<ViewMode>('total');
  const hasFirstLoaded = useRef(false);
  const { data, isLoading, error, refetch } = useMarketSummary();
  const { data: chartData } = useMarketCapChart('30d');

  // Extract sparkline data (last 30 days of market cap values)
  const sparklineData = chartData?.map((point) => point.totalMarketCap) || [];

  // Calculate values (with safe defaults for loading state)
  const marketCap7dAgo = data ? data.totalMarketCap / (1 + data.change7d / 100) : 0;
  const marketCap30dAgo = data ? data.totalMarketCap / (1 + data.change30d / 100) : 0;

  // Animated counter for market cap - must be called before any returns
  const currentMarketCap = data
    ? (viewMode === 'total' ? data.totalMarketCap :
       viewMode === '7d' ? marketCap7dAgo :
       marketCap30dAgo)
    : 0;

  const isFirstLoad = !hasFirstLoaded.current;
  if (!isLoading && data) hasFirstLoaded.current = true;

  const animDelay = isFirstLoad ? 350 : 0;

  const { displayValue: marketCapDisplay } = useCountUp({
    end: currentMarketCap,
    duration: 1400,
    easing: 'easeOut',
    formatter: formatCurrency,
    shouldAnimate: !isLoading,
    delay: animDelay,
  });

  const { displayValue: change7dDisplay } = useCountUp({
    end: data?.change7d ?? 0,
    duration: 1200,
    decimals: 2,
    easing: 'easeOut',
    formatter: formatPercent,
    shouldAnimate: !isLoading,
    delay: animDelay,
  });

  const { displayValue: change30dDisplay } = useCountUp({
    end: data?.change30d ?? 0,
    duration: 1200,
    decimals: 2,
    easing: 'easeOut',
    formatter: formatPercent,
    shouldAnimate: !isLoading,
    delay: animDelay,
  });

  if (isLoading) {
    return <SkeletonKpiCard showSparkline={true} />;
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-8">
        <div className="text-center">
          <p className="text-chrome-500 mb-4">Failed to load market data</p>
          <button
            onClick={refetch}
            className="text-gold-500 hover:text-gold-600 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <FadeInSlide>
      <TiltCard>
        <div className="bg-white rounded-lg shadow-sm border border-chrome-200 transition-all duration-200 hover:shadow-md">
          <div className="px-6 py-4 border-b border-chrome-100">
            <h2 className="text-lg font-semibold text-chrome-900 mb-3">
              Global Stablecoin Market
            </h2>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('total')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'total'
                    ? 'bg-gold-500 text-white'
                    : 'bg-chrome-100 text-chrome-600 hover:bg-chrome-200'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setViewMode('7d')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  viewMode === '7d'
                    ? 'bg-gold-500 text-white'
                    : 'bg-chrome-100 text-chrome-600 hover:bg-chrome-200'
                }`}
              >
                7D Change
              </button>
              <button
                onClick={() => setViewMode('30d')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  viewMode === '30d'
                    ? 'bg-gold-500 text-white'
                    : 'bg-chrome-100 text-chrome-600 hover:bg-chrome-200'
                }`}
              >
                30D Change
              </button>
            </div>
          </div>
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
              <div className="flex flex-col items-center justify-center px-4 py-4">
                {viewMode === 'total' && (
                  <>
                    <p className="text-sm font-medium text-chrome-500 uppercase tracking-wide mb-2 text-center">Total Market Cap</p>
                    <p className="text-4xl lg:text-5xl font-bold font-mono-numbers text-chrome-900 text-center">
                      {marketCapDisplay}
                    </p>
                    {sparklineData.length > 0 && (
                      <div className="mt-3 flex items-center gap-3">
                        <Sparkline data={sparklineData} width={100} height={28} color="auto" />
                        <span className={`text-sm font-semibold ${data.change30d >= 0 ? 'text-status-positive' : 'text-status-negative'}`}>
                          {change30dDisplay} (30d)
                        </span>
                      </div>
                    )}
                  </>
                )}
                {viewMode === '7d' && (
                  <>
                    <p className="text-sm font-medium text-chrome-500 uppercase tracking-wide mb-2 text-center">Market Cap (7 days ago)</p>
                    <p className="text-4xl lg:text-5xl font-bold font-mono-numbers text-chrome-900 text-center">{marketCapDisplay}</p>
                    {sparklineData.length > 0 && (
                      <div className="mt-3 flex items-center gap-3">
                        <Sparkline data={sparklineData.slice(-7)} width={100} height={28} color="auto" />
                        <span className={`text-sm font-semibold ${data.change7d >= 0 ? 'text-status-positive' : 'text-status-negative'}`}>
                          {change7dDisplay}
                        </span>
                      </div>
                    )}
                  </>
                )}
                {viewMode === '30d' && (
                  <>
                    <p className="text-sm font-medium text-chrome-500 uppercase tracking-wide mb-2 text-center">Market Cap (30 days ago)</p>
                    <p className="text-4xl lg:text-5xl font-bold font-mono-numbers text-chrome-900 text-center">{marketCapDisplay}</p>
                    {sparklineData.length > 0 && (
                      <div className="mt-3 flex items-center gap-3">
                        <Sparkline data={sparklineData} width={100} height={28} color="auto" />
                        <span className={`text-sm font-semibold ${data.change30d >= 0 ? 'text-status-positive' : 'text-status-negative'}`}>
                          {change30dDisplay}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
              <TrackedAssetsKpi count={data.trackedStablecoins} />
            </div>
            <div className="mt-6 pt-4 border-t border-chrome-100 text-xs text-chrome-400 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-status-positive animate-pulse flex-shrink-0" />
              <span>Data refreshed {formatTimeAgo(data.lastUpdated)}</span>
            </div>
          </div>
        </div>
      </TiltCard>
    </FadeInSlide>
  );
}
