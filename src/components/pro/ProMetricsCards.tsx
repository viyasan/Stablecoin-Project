import { useProData } from './ProDataProvider';

function formatCompactCurrency(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

function formatSignedCompactCurrency(value: number): string {
  const sign = value >= 0 ? '+' : '';
  const abs = Math.abs(value);
  if (abs >= 1e12) return `${sign}$${(value / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${sign}$${(value / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(value / 1e6).toFixed(1)}M`;
  return `${sign}$${value.toLocaleString()}`;
}

function formatSignedPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function changeColor(value: number): string {
  return value >= 0 ? 'text-status-positive' : 'text-status-negative';
}

function CardSkeleton() {
  return (
    <div className="bg-pro-surface border border-pro-border rounded-lg p-4">
      <div className="h-3 w-20 bg-pro-elevated rounded animate-pulse mb-3" />
      <div className="h-6 w-24 bg-pro-elevated rounded animate-pulse mb-2" />
      <div className="h-3 w-16 bg-pro-elevated rounded animate-pulse" />
    </div>
  );
}

export function ProMetricsCards() {
  const { market, stablecoins } = useProData();
  const { data: marketData, isLoading: marketLoading, error: marketError } = market;
  const { data: stablecoinData, error: listError } = stablecoins;

  if (marketError || listError) {
    return (
      <div className="bg-pro-surface border border-pro-border rounded-lg p-4">
        <p className="text-status-negative font-mono text-sm">
          Failed to load data: {marketError?.message || listError?.message}
        </p>
      </div>
    );
  }

  if (marketLoading || !marketData) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const top20 = stablecoinData?.slice(0, 20) ?? [];
  const topGainer = top20.length > 0
    ? top20.reduce((best, coin) => (coin.change7d > best.change7d ? coin : best), top20[0])
    : null;
  const topLoser = top20.length > 0
    ? top20.reduce((worst, coin) => (coin.change7d < worst.change7d ? coin : worst), top20[0])
    : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Card 1: Total Market Cap */}
      <div className="bg-pro-surface border border-pro-border rounded-lg p-4">
        <p className="text-xs font-mono uppercase tracking-wider text-pro-text-muted mb-1">
          Total Market Cap
        </p>
        <p className="text-xl font-mono font-bold text-pro-text">
          {formatCompactCurrency(marketData.totalMarketCap)}
        </p>
        <p className={`text-xs font-mono mt-1 ${changeColor(marketData.change24h)}`}>
          {formatSignedCompactCurrency(marketData.change24hValue)} ({formatSignedPercent(marketData.change24h)})
        </p>
      </div>

      {/* Card 2: 30d Change */}
      <div className="bg-pro-surface border border-pro-border rounded-lg p-4">
        <p className="text-xs font-mono uppercase tracking-wider text-pro-text-muted mb-1">
          30d Change
        </p>
        <p className={`text-xl font-mono font-bold ${changeColor(marketData.change30d)}`}>
          {formatSignedPercent(marketData.change30d)}
        </p>
        <p className={`text-xs font-mono mt-1 ${changeColor(marketData.change30dValue)}`}>
          {formatSignedCompactCurrency(marketData.change30dValue)}
        </p>
      </div>

      {/* Card 3: Top Gainer (7d) */}
      <div className="bg-pro-surface border border-pro-border rounded-lg p-4">
        <p className="text-xs font-mono uppercase tracking-wider text-pro-text-muted mb-1">
          Top Gainer (7d)
        </p>
        {topGainer ? (
          <>
            <p className="text-xl font-mono font-bold text-pro-text">
              {topGainer.symbol}{' '}
              <span className="text-status-positive">
                {formatSignedPercent(topGainer.change7d)}
              </span>
            </p>
            <p className="text-xs font-mono text-pro-text-secondary mt-1">
              {formatCompactCurrency(topGainer.marketCap)}
            </p>
          </>
        ) : (
          <>
            <div className="h-6 w-24 bg-pro-elevated rounded animate-pulse" />
            <div className="h-3 w-16 bg-pro-elevated rounded animate-pulse mt-2" />
          </>
        )}
      </div>

      {/* Card 4: Top Loser (7d) */}
      <div className="bg-pro-surface border border-pro-border rounded-lg p-4">
        <p className="text-xs font-mono uppercase tracking-wider text-pro-text-muted mb-1">
          Top Loser (7d)
        </p>
        {topLoser ? (
          <>
            <p className="text-xl font-mono font-bold text-pro-text">
              {topLoser.symbol}{' '}
              <span className="text-status-negative">
                {formatSignedPercent(topLoser.change7d)}
              </span>
            </p>
            <p className="text-xs font-mono text-pro-text-secondary mt-1">
              {formatCompactCurrency(topLoser.marketCap)}
            </p>
          </>
        ) : (
          <>
            <div className="h-6 w-24 bg-pro-elevated rounded animate-pulse" />
            <div className="h-3 w-16 bg-pro-elevated rounded animate-pulse mt-2" />
          </>
        )}
      </div>
    </div>
  );
}
