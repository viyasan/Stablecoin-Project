import { useStablecoinYields } from '../../../api';

function formatCompactCurrency(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

function formatProjectName(project: string): string {
  return project
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function ProYieldOpportunities({ symbol }: { symbol: string }) {
  const { data, isLoading } = useStablecoinYields();

  if (isLoading || !data) {
    return (
      <div className="bg-pro-surface border border-pro-border rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="h-3 w-28 bg-pro-elevated rounded animate-pulse mb-3" />
        </div>
        <div className="bg-pro-elevated px-4 py-3">
          <div className="h-3 w-full bg-pro-border rounded animate-pulse" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3 border-t border-pro-border"
          >
            <div className="h-3 w-24 bg-pro-elevated rounded animate-pulse" />
            <div className="h-3 w-16 bg-pro-elevated rounded animate-pulse" />
            <div className="h-3 w-14 bg-pro-elevated rounded animate-pulse" />
            <div className="h-3 w-18 bg-pro-elevated rounded animate-pulse flex-1" />
          </div>
        ))}
      </div>
    );
  }

  const filtered = data.data
    .filter((p) => p.symbol.toUpperCase() === symbol.toUpperCase())
    .sort((a, b) => b.tvlUsd - a.tvlUsd)
    .slice(0, 10);

  return (
    <div className="bg-pro-surface border border-pro-border rounded-lg overflow-hidden">
      {/* Title */}
      <div className="p-4 pb-0">
        <div className="flex items-center gap-2 mb-3">
          <p className="text-xs font-mono uppercase tracking-wider text-pro-text-muted">
            Yield Opportunities
          </p>
          <span className="bg-pro-elevated text-pro-text-secondary text-xs font-mono px-1.5 py-0.5 rounded">
            {filtered.length}
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="px-4 pb-4">
          <p className="text-pro-text-muted text-sm py-8 text-center">
            No yield opportunities found for {symbol}
          </p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-pro-elevated">
              <th className="text-left px-4 py-2 text-xs font-mono uppercase text-pro-text-muted font-normal">
                Protocol
              </th>
              <th className="text-left px-4 py-2 text-xs font-mono uppercase text-pro-text-muted font-normal">
                Chain
              </th>
              <th className="text-right px-4 py-2 text-xs font-mono uppercase text-pro-text-muted font-normal">
                APY
              </th>
              <th className="text-right px-4 py-2 text-xs font-mono uppercase text-pro-text-muted font-normal">
                TVL
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((pool) => (
              <tr
                key={pool.pool}
                className="border-t border-pro-border hover:bg-pro-hover"
              >
                <td className="px-4 py-2.5 text-pro-text font-mono">
                  {formatProjectName(pool.project)}
                  {pool.poolMeta && (
                    <span className="text-pro-text-muted ml-1 text-xs">
                      ({pool.poolMeta})
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-pro-text-secondary font-mono">
                  {pool.chain}
                </td>
                <td className="px-4 py-2.5 text-right text-status-positive font-mono">
                  {pool.apy.toFixed(2)}%
                </td>
                <td className="px-4 py-2.5 text-right text-pro-text-secondary font-mono">
                  {formatCompactCurrency(pool.tvlUsd)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
