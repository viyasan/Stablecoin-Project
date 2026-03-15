import { ChevronUp, ChevronDown } from 'lucide-react';
import type { StablecoinYieldPool } from '../../types/yield';

export type SortField = 'tvlUsd' | 'apy' | 'apyBase' | 'apyReward';
export type SortOrder = 'asc' | 'desc';

const CHAIN_ICONS: Record<string, string> = {
  Ethereum: 'https://icons.llama.fi/chains/rsz_ethereum.jpg',
  Solana: 'https://icons.llama.fi/chains/rsz_solana.jpg',
  Arbitrum: 'https://icons.llama.fi/chains/rsz_arbitrum.jpg',
  Base: 'https://icons.llama.fi/chains/rsz_base.jpg',
  BSC: 'https://icons.llama.fi/chains/rsz_binance.jpg',
  Tron: 'https://icons.llama.fi/chains/rsz_tron.jpg',
  Avalanche: 'https://icons.llama.fi/chains/rsz_avalanche.jpg',
  Polygon: 'https://icons.llama.fi/chains/rsz_polygon.jpg',
  TON: 'https://icons.llama.fi/chains/rsz_ton.jpg',
  Optimism: 'https://icons.llama.fi/chains/rsz_optimism.jpg',
  Stellar: 'https://icons.llama.fi/chains/rsz_stellar.jpg',
  Sui: 'https://icons.llama.fi/chains/rsz_sui.jpg',
  Aptos: 'https://icons.llama.fi/chains/rsz_aptos.jpg',
};

interface YieldsTableProps {
  pools: StablecoinYieldPool[];
  sortBy: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  projectLogos?: Map<string, string>;
}

function formatTvl(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

function formatApy(value: number | null): string {
  if (value === null) return '—';
  return `${value.toFixed(2)}%`;
}

function formatProject(project: string): string {
  return project
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function SortIcon({ field, sortBy, sortOrder }: { field: SortField; sortBy: SortField; sortOrder: SortOrder }) {
  if (field !== sortBy) {
    return <ChevronDown className="w-4 h-4 text-chrome-300" />;
  }
  return sortOrder === 'desc'
    ? <ChevronDown className="w-4 h-4 text-gold-500" />
    : <ChevronUp className="w-4 h-4 text-gold-500" />;
}

const DEFILLAMA_POOL_URL = 'https://defillama.com/yields/pool/';

function MobileCard({ pool, projectLogos }: { pool: StablecoinYieldPool; projectLogos?: Map<string, string> }) {
  return (
    <div
      className="p-4 border-b border-chrome-100 last:border-b-0 active:bg-gold-50 transition-colors cursor-pointer"
      onClick={() => window.open(`${DEFILLAMA_POOL_URL}${pool.pool}`, '_blank', 'noopener')}
    >
      {/* Top row: Pool name + APY */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <span className="font-semibold text-chrome-900 text-sm">
            {pool.symbol}
          </span>
          {pool.poolMeta && (
            <span className="ml-1.5 text-[11px] bg-chrome-100 text-chrome-500 px-1.5 py-0.5 rounded">
              {pool.poolMeta}
            </span>
          )}
        </div>
        <span className="text-lg font-bold text-green-600 flex-shrink-0">
          {formatApy(pool.apy)}
        </span>
      </div>

      {/* Bottom row: Project, Chain, TVL */}
      <div className="flex items-center gap-4 text-xs text-chrome-500">
        <span className="inline-flex items-center gap-1">
          {projectLogos?.get(pool.project) && (
            <img
              src={projectLogos.get(pool.project)}
              alt=""
              className="w-4 h-4 rounded-full object-cover"
              loading="lazy"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          {formatProject(pool.project)}
        </span>
        <span className="inline-flex items-center gap-1">
          {CHAIN_ICONS[pool.chain] && (
            <img
              src={CHAIN_ICONS[pool.chain]}
              alt=""
              className="w-4 h-4 rounded-full object-cover"
              loading="lazy"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          {pool.chain}
        </span>
        <span className="ml-auto font-medium text-chrome-700">{formatTvl(pool.tvlUsd)}</span>
      </div>
    </div>
  );
}

export function YieldsTable({ pools, sortBy, sortOrder, onSort, projectLogos }: YieldsTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-chrome-200 overflow-hidden">
      {/* Mobile sort controls */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-chrome-100 sm:hidden overflow-x-auto">
        <span className="text-xs text-chrome-500 flex-shrink-0">Sort:</span>
        {([['tvlUsd', 'TVL'], ['apy', 'APY']] as [SortField, string][]).map(([field, label]) => (
          <button
            key={field}
            onClick={() => onSort(field)}
            className={`inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 transition-colors ${
              sortBy === field
                ? 'bg-gold-100 text-gold-700'
                : 'bg-chrome-100 text-chrome-600'
            }`}
          >
            {label}
            <SortIcon field={field} sortBy={sortBy} sortOrder={sortOrder} />
          </button>
        ))}
      </div>

      {/* Mobile card layout */}
      <div className="sm:hidden">
        {pools.map((pool) => (
          <MobileCard key={pool.pool} pool={pool} projectLogos={projectLogos} />
        ))}
        {pools.length === 0 && (
          <div className="px-4 py-12 text-center text-chrome-400">
            No pools match your filters.
          </div>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="bg-chrome-50 text-chrome-600 text-xs uppercase tracking-wider">
              <th className="text-left px-4 py-3 font-semibold w-[25%]">Pool</th>
              <th className="text-left px-4 py-3 font-semibold w-[20%]">Project</th>
              <th className="text-left px-4 py-3 font-semibold w-[13%]">Chain</th>
              <th
                className="text-right px-4 py-3 font-semibold cursor-pointer select-none hover:text-chrome-800 w-[12%]"
                onClick={() => onSort('tvlUsd')}
              >
                <span className="inline-flex items-center gap-1">
                  TVL
                  <SortIcon field="tvlUsd" sortBy={sortBy} sortOrder={sortOrder} />
                </span>
              </th>
              <th
                className="text-right px-4 py-3 font-semibold cursor-pointer select-none hover:text-chrome-800 w-[10%]"
                onClick={() => onSort('apy')}
              >
                <span className="inline-flex items-center gap-1">
                  APY
                  <SortIcon field="apy" sortBy={sortBy} sortOrder={sortOrder} />
                </span>
              </th>
              <th
                className="text-right px-4 py-3 font-semibold cursor-pointer select-none hover:text-chrome-800 hidden md:table-cell w-[10%]"
                onClick={() => onSort('apyBase')}
              >
                <span className="inline-flex items-center gap-1">
                  Base APY
                  <SortIcon field="apyBase" sortBy={sortBy} sortOrder={sortOrder} />
                </span>
              </th>
              <th
                className="text-right px-4 py-3 font-semibold cursor-pointer select-none hover:text-chrome-800 hidden md:table-cell w-[10%]"
                onClick={() => onSort('apyReward')}
              >
                <span className="inline-flex items-center gap-1">
                  Reward APY
                  <SortIcon field="apyReward" sortBy={sortBy} sortOrder={sortOrder} />
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-chrome-100">
            {pools.map((pool, i) => (
              <tr
                key={pool.pool}
                className={`hover:bg-gold-50 cursor-pointer transition-colors ${
                  i % 2 === 1 ? 'bg-chrome-50/50' : ''
                }`}
                onClick={() => window.open(`${DEFILLAMA_POOL_URL}${pool.pool}`, '_blank', 'noopener')}
              >
                <td className="px-4 py-3 font-medium text-chrome-800 truncate">
                  {pool.symbol}
                  {pool.poolMeta && (
                    <span className="ml-1.5 text-xs bg-chrome-100 text-chrome-500 px-1.5 py-0.5 rounded">
                      {pool.poolMeta}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-chrome-600 truncate">
                  <span className="inline-flex items-center gap-1.5">
                    {projectLogos?.get(pool.project) && (
                      <img
                        src={projectLogos.get(pool.project)}
                        alt=""
                        className="w-5 h-5 rounded-full object-cover"
                        loading="lazy"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                    {formatProject(pool.project)}
                  </span>
                </td>
                <td className="px-4 py-3 text-chrome-600">
                  <span className="inline-flex items-center gap-1.5">
                    {CHAIN_ICONS[pool.chain] && (
                      <img
                        src={CHAIN_ICONS[pool.chain]}
                        alt=""
                        className="w-5 h-5 rounded-full object-cover"
                        loading="lazy"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                    {pool.chain}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium text-chrome-800">{formatTvl(pool.tvlUsd)}</td>
                <td className="px-4 py-3 text-right font-medium text-green-600">{formatApy(pool.apy)}</td>
                <td className="px-4 py-3 text-right text-chrome-600 hidden md:table-cell">{formatApy(pool.apyBase)}</td>
                <td className="px-4 py-3 text-right text-chrome-600 hidden md:table-cell">{formatApy(pool.apyReward)}</td>
              </tr>
            ))}
            {pools.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-chrome-400">
                  No pools match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
