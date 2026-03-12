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

export function YieldsTable({ pools, sortBy, sortOrder, onSort, projectLogos }: YieldsTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-chrome-200 overflow-hidden">
      <div className="overflow-x-auto">
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
