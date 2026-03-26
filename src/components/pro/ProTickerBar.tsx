import { useProData } from './ProDataProvider';

function formatCompactCurrency(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

function formatChange(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function TickerSkeleton() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-10 bg-pro-surface border-b border-pro-border flex items-center">
      <div className="flex items-center gap-0 overflow-hidden w-full px-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-4 border-r border-pro-border last:border-r-0"
          >
            <div className="h-3 w-10 bg-pro-elevated rounded animate-pulse" />
            <div className="h-3 w-14 bg-pro-elevated rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

interface TickerItemProps {
  label: string;
  value: string;
  colorClass?: string;
}

function TickerItem({ label, value, colorClass = 'text-pro-text' }: TickerItemProps) {
  return (
    <div className="flex items-center gap-1.5 px-4 border-r border-pro-border last:border-r-0 whitespace-nowrap">
      <span className="text-pro-text-muted font-mono text-xs">{label}</span>
      <span className={`font-mono text-xs ${colorClass}`}>{value}</span>
    </div>
  );
}

export function ProTickerBar() {
  const { market, stablecoins } = useProData();
  const { data: marketData, isLoading: marketLoading, error: marketError } = market;
  const { data: stablecoinData } = stablecoins;

  if (marketError) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 h-10 bg-pro-surface border-b border-pro-border flex items-center px-4">
        <span className="text-status-negative font-mono text-xs">API Error: {marketError.message}</span>
      </div>
    );
  }

  if (marketLoading || !marketData) {
    return <TickerSkeleton />;
  }

  const usdt = stablecoinData?.find((c) => c.symbol === 'USDT');
  const usdc = stablecoinData?.find((c) => c.symbol === 'USDC');

  const usdtDominance =
    usdt && marketData.totalMarketCap > 0
      ? ((usdt.marketCap / marketData.totalMarketCap) * 100).toFixed(1)
      : '--.-';

  const changeColor = (val: number) =>
    val >= 0 ? 'text-status-positive' : 'text-status-negative';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-10 bg-pro-surface border-b border-pro-border">
      <div className="h-full flex items-center overflow-x-auto scrollbar-hide">
        <TickerItem
          label="Mkt Cap"
          value={formatCompactCurrency(marketData.totalMarketCap)}
        />
        <TickerItem
          label="24h"
          value={formatChange(marketData.change24h)}
          colorClass={changeColor(marketData.change24h)}
        />
        <TickerItem
          label="7d"
          value={formatChange(marketData.change7d)}
          colorClass={changeColor(marketData.change7d)}
        />
        <TickerItem
          label="30d"
          value={formatChange(marketData.change30d)}
          colorClass={changeColor(marketData.change30d)}
        />
        <TickerItem
          label="USDT Dom"
          value={`${usdtDominance}%`}
        />
        <TickerItem
          label="USDT"
          value={usdt ? `$${usdt.price.toFixed(4)}` : '$--.----'}
        />
        <TickerItem
          label="USDC"
          value={usdc ? `$${usdc.price.toFixed(4)}` : '$--.----'}
        />
        <TickerItem
          label="Tracked"
          value={String(marketData.trackedStablecoins)}
        />
      </div>
    </div>
  );
}
