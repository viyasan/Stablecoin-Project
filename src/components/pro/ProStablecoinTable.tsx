import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProData } from './ProDataProvider';
import type { StablecoinWithSnapshot } from '../../types';

function formatCompactCurrency(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

function formatSignedPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function changeColor(value: number): string {
  return value >= 0 ? 'text-status-positive' : 'text-status-negative';
}

function pegColor(deviation: number): string {
  const abs = Math.abs(deviation);
  if (abs < 0.1) return 'text-status-positive';
  if (abs < 0.5) return 'text-gold-500';
  return 'text-status-negative';
}

type SortColumn =
  | 'rank'
  | 'name'
  | 'price'
  | 'peg'
  | 'marketCap'
  | 'change7d'
  | 'change30d'
  | 'dominance'
  | 'chain';

type SortDirection = 'asc' | 'desc';

const COLUMNS: { key: SortColumn; label: string }[] = [
  { key: 'rank', label: '#' },
  { key: 'name', label: 'Name' },
  { key: 'price', label: 'Price' },
  { key: 'peg', label: 'Peg' },
  { key: 'marketCap', label: 'Market Cap' },
  { key: 'change7d', label: '7d %' },
  { key: 'change30d', label: '30d %' },
  { key: 'dominance', label: 'Dom. %' },
  { key: 'chain', label: 'Chain' },
];

function getSortValue(
  coin: StablecoinWithSnapshot,
  column: SortColumn,
  index: number,
  totalMarketCap: number
): number | string {
  switch (column) {
    case 'rank':
      return index;
    case 'name':
      return coin.symbol.toLowerCase();
    case 'price':
      return coin.price;
    case 'peg':
      return Math.abs(coin.priceDeviation);
    case 'marketCap':
      return coin.marketCap;
    case 'change7d':
      return coin.change7d;
    case 'change30d':
      return coin.change30d;
    case 'dominance':
      return totalMarketCap > 0 ? coin.marketCap / totalMarketCap : 0;
    case 'chain':
      return coin.dominantChain.toLowerCase();
    default:
      return 0;
  }
}

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <tr key={i} className="border-t border-pro-border">
          {COLUMNS.map((col) => (
            <td key={col.key} className="px-4 py-3">
              <div className="h-3 w-14 bg-pro-elevated rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function ProStablecoinTable() {
  const { stablecoins } = useProData();
  const { data, isLoading } = stablecoins;
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState<SortColumn>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const top10 = useMemo(() => data?.slice(0, 10) ?? [], [data]);

  const totalMarketCap = useMemo(
    () => (data ?? []).reduce((sum, coin) => sum + coin.marketCap, 0),
    [data]
  );

  const sortedData = useMemo(() => {
    if (top10.length === 0) return [];

    const indexed = top10.map((coin, i) => ({ coin, originalIndex: i }));

    indexed.sort((a, b) => {
      const aVal = getSortValue(a.coin, sortColumn, a.originalIndex, totalMarketCap);
      const bVal = getSortValue(b.coin, sortColumn, b.originalIndex, totalMarketCap);

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      const aNum = aVal as number;
      const bNum = bVal as number;
      return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
    });

    return indexed;
  }, [top10, sortColumn, sortDirection, totalMarketCap]);

  function handleSort(column: SortColumn) {
    if (sortColumn === column) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection(column === 'rank' || column === 'name' || column === 'chain' ? 'asc' : 'desc');
    }
  }

  return (
    <div className="bg-pro-surface border border-pro-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-pro-elevated">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`text-[10px] font-mono uppercase tracking-wider px-4 py-3 text-left cursor-pointer hover:text-pro-text-secondary transition-colors ${
                    sortColumn === col.key
                      ? 'text-gold-500'
                      : 'text-pro-text-muted'
                  }`}
                >
                  {col.label}
                  {sortColumn === col.key && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading || !data ? (
              <SkeletonRows />
            ) : (
              sortedData.map(({ coin, originalIndex }) => {
                const dominance =
                  totalMarketCap > 0
                    ? ((coin.marketCap / totalMarketCap) * 100).toFixed(1)
                    : '0.0';

                return (
                  <tr
                    key={coin.symbol}
                    onClick={() => navigate(`/pro/${coin.symbol.toLowerCase()}`)}
                    className="border-t border-pro-border hover:bg-pro-hover cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-mono text-pro-text-muted w-10 whitespace-nowrap">
                      {originalIndex + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono whitespace-nowrap">
                      <span className="text-pro-text font-bold">
                        {coin.symbol}
                      </span>{' '}
                      <span className="text-pro-text-secondary">
                        {coin.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-pro-text whitespace-nowrap">
                      ${coin.price.toFixed(4)}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm font-mono whitespace-nowrap ${pegColor(coin.priceDeviation)}`}
                    >
                      {formatSignedPercent(coin.priceDeviation)}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-pro-text whitespace-nowrap">
                      {formatCompactCurrency(coin.marketCap)}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm font-mono whitespace-nowrap ${changeColor(coin.change7d)}`}
                    >
                      {formatSignedPercent(coin.change7d)}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm font-mono whitespace-nowrap ${changeColor(coin.change30d)}`}
                    >
                      {formatSignedPercent(coin.change30d)}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-pro-text whitespace-nowrap">
                      {dominance}%
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-pro-text whitespace-nowrap">
                      {coin.dominantChain}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
