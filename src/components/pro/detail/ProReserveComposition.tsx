import { useStablecoinReserves } from '../../../api';

function formatCompactCurrency(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

export function ProReserveComposition({ symbol }: { symbol: string }) {
  const { data, isLoading } = useStablecoinReserves();

  const upperSymbol = symbol.toUpperCase();
  const isSupported = upperSymbol === 'USDT' || upperSymbol === 'USDC';

  if (!isSupported) {
    return (
      <div className="bg-pro-surface border border-pro-border rounded-lg p-4">
        <p className="text-xs font-mono uppercase tracking-wider text-pro-text-muted mb-3">
          Reserve Composition
        </p>
        <div className="h-32 flex items-center justify-center">
          <p className="text-pro-text-muted text-sm">
            Reserve data available for USDT and USDC only.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="bg-pro-surface border border-pro-border rounded-lg p-4">
        <div className="h-3 w-28 bg-pro-elevated rounded animate-pulse mb-3" />
        <div className="h-6 w-full bg-pro-elevated rounded animate-pulse mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-3 w-40 bg-pro-elevated rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const reserve = upperSymbol === 'USDT' ? data.usdt : data.usdc;

  if (!reserve) {
    return (
      <div className="bg-pro-surface border border-pro-border rounded-lg p-4">
        <p className="text-xs font-mono uppercase tracking-wider text-pro-text-muted mb-3">
          Reserve Composition
        </p>
        <div className="h-32 flex items-center justify-center">
          <p className="text-pro-text-muted text-sm">
            Reserve data not available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pro-surface border border-pro-border rounded-lg p-4">
      <p className="text-xs font-mono uppercase tracking-wider text-pro-text-muted mb-1">
        Reserve Composition
      </p>
      <p className="text-pro-text-muted text-xs mb-4">
        Source: {reserve.name} Attestation &bull; {reserve.lastUpdated}
      </p>

      {/* Stacked horizontal bar */}
      <div className="w-full h-6 rounded overflow-hidden flex">
        {reserve.assets.map((asset) => (
          <div
            key={asset.name}
            className="h-full"
            style={{
              width: `${asset.percentage}%`,
              backgroundColor: asset.color,
            }}
            title={`${asset.name}: ${asset.percentage}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {reserve.assets.map((asset) => (
          <div key={asset.name} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: asset.color }}
            />
            <span className="text-pro-text-secondary font-mono">
              {asset.name}
            </span>
            <span className="text-pro-text-muted font-mono ml-auto">
              {asset.percentage}%
            </span>
          </div>
        ))}
      </div>

      {/* Treasury holdings */}
      <div className="mt-4 pt-3 border-t border-pro-border">
        <p className="text-xs font-mono text-pro-text-secondary">
          US Treasury Holdings:{' '}
          <span className="text-pro-text font-semibold">
            {formatCompactCurrency(reserve.treasuryHoldings)}
          </span>
        </p>
      </div>

      {/* Source link */}
      <div className="mt-2">
        <a
          href={reserve.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-gold-500 hover:underline"
        >
          View source report &rarr;
        </a>
      </div>
    </div>
  );
}
