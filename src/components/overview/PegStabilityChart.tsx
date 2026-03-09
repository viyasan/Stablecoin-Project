import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useStablecoinList, useStablecoinPrices } from '../../api';
import { SkeletonChart } from '../common';
import type { PegPricePoint, ChainBreakdownEntry } from '../../types';

// Match colors from MarketSharePieChart
const STABLECOIN_COLORS: Record<string, string> = {
  USDT: '#22C55E',
  USDC: '#3B82F6',
  USDe: '#8B5CF6',
  USDS: '#F59E0B',
  DAI: '#F97316',
  PYUSD: '#0EA5E9',
  USD1: '#EC4899',
  USDf: '#14B8A6',
  USYC: '#6366F1',
  RLUSD: '#EF4444',
};

const FALLBACK_COLOR = '#6B7280';

const CHAIN_COLORS: Record<string, string> = {
  Ethereum: '#627EEA',
  Tron: '#FF0013',
  BSC: '#F0B90B',
  Solana: '#9945FF',
  Arbitrum: '#28A0F0',
  Hyperliquid: '#00D395',
  Base: '#0052FF',
  Polygon: '#8247E5',
  Avalanche: '#E84142',
  'OP Mainnet': '#FF0420',
  Aptos: '#66CCFF',
  Sui: '#4DA2FF',
  TON: '#0098EA',
  Near: '#00C08B',
  Fantom: '#1969FF',
};

const CHAIN_FALLBACK_COLORS = ['#6366F1', '#EC4899', '#14B8A6', '#F97316', '#84CC16', '#06B6D4'];

function getChainColor(chain: string, index: number): string {
  return CHAIN_COLORS[chain] || CHAIN_FALLBACK_COLORS[index % CHAIN_FALLBACK_COLORS.length];
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  return `$${value.toLocaleString()}`;
}

function getChainDistribution(breakdown: ChainBreakdownEntry[], topN: number = 5) {
  const total = breakdown.reduce((sum, e) => sum + e.amount, 0);
  if (total === 0) return [];

  const top = breakdown.slice(0, topN);
  const othersAmount = breakdown.slice(topN).reduce((sum, e) => sum + e.amount, 0);

  const entries = top.map((e, i) => ({
    chain: e.chain,
    amount: e.amount,
    percentage: (e.amount / total) * 100,
    color: getChainColor(e.chain, i),
  }));

  if (othersAmount > 0) {
    entries.push({
      chain: 'Others',
      amount: othersAmount,
      percentage: (othersAmount / total) * 100,
      color: '#9CA3AF',
    });
  }

  return entries;
}

type TimeRange = '30d' | '1y' | 'max';

const timeRangeLabels: Record<TimeRange, string> = {
  '30d': '30D',
  '1y': '1Y',
  max: 'Max',
};

const timeRangeDays: Record<TimeRange, number> = {
  '30d': 30,
  '1y': 365,
  max: 0,
};

function formatDate(timestamp: string, range: TimeRange): string {
  const date = new Date(timestamp);
  if (range === '30d') {
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  if (range === '1y') {
    return date.toLocaleDateString(undefined, { month: 'short' });
  }
  return date.getFullYear().toString();
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: { date: string; price: number; deviation: number };
  }>;
}

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload;
  const deviationSign = point.deviation >= 0 ? '+' : '';

  return (
    <div className="bg-white border border-chrome-200 rounded-lg shadow-lg p-3 min-w-[180px]">
      <p className="text-xs text-chrome-500 mb-2">
        {new Date(point.date).toLocaleDateString(undefined, {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </p>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-chrome-500">Price</span>
        <span className="text-sm font-semibold text-chrome-900">
          ${point.price.toFixed(4)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-chrome-500">Deviation</span>
        <span
          className={`text-sm font-medium ${
            Math.abs(point.deviation) > 0.5
              ? 'text-status-negative'
              : 'text-status-positive'
          }`}
        >
          {deviationSign}{point.deviation.toFixed(4)}%
        </span>
      </div>
    </div>
  );
}

function computeMetrics(points: PegPricePoint[]) {
  if (points.length === 0) {
    return { currentPrice: 0, maxDeviation: 0, avgDeviation: 0, pegAdherence: 0 };
  }

  const currentPrice = points[points.length - 1].price;
  const absDeviations = points.map((p) => Math.abs(p.deviation));
  const maxDeviation = Math.max(...absDeviations);
  const avgDeviation = absDeviations.reduce((s, d) => s + d, 0) / absDeviations.length;
  const withinHalfPercent = points.filter((p) => Math.abs(p.deviation) <= 0.5).length;
  const pegAdherence = (withinHalfPercent / points.length) * 100;

  return { currentPrice, maxDeviation, avgDeviation, pegAdherence };
}

export function PegStabilityChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data: stablecoins, isLoading: listLoading } = useStablecoinList();
  const {
    data: priceData,
    isLoading: pricesLoading,
    error,
    refetch,
  } = useStablecoinPrices(timeRangeDays[timeRange]);

  // Featured USD-pegged stablecoins: top 3 by market cap + specific coins of interest
  const EXTRA_SYMBOLS = new Set(['USDe', 'USD1', 'DAI', 'PYUSD']);

  const featured = useMemo(() => {
    if (!stablecoins) return [];
    const usdCoins = stablecoins.filter((c) => c.pegCurrency === 'USD' && c.externalId);
    const top3 = usdCoins.slice(0, 3);
    const extras = usdCoins.filter(
      (c) => EXTRA_SYMBOLS.has(c.symbol) && !top3.some((t) => t.id === c.id)
    );
    return [...top3, ...extras];
  }, [stablecoins]);

  const isLoading = listLoading || pricesLoading;

  if (isLoading) {
    return <SkeletonChart height={300} />;
  }

  if (error || !priceData || featured.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-chrome-500 mb-4">Failed to load peg stability data</p>
            <button
              onClick={refetch}
              className="text-gold-500 hover:text-gold-600 font-medium"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selected = featured[selectedIndex] || featured[0];
  const selectedColor = STABLECOIN_COLORS[selected.symbol] || FALLBACK_COLOR;
  const chartPoints = priceData.get(selected.externalId!) || [];
  const metrics = computeMetrics(chartPoints);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-chrome-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-chrome-100 flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-chrome-900">Peg Stability</h2>
        <div className="flex items-center gap-4">
          {/* Stablecoin selector pills */}
          <div className="flex items-center gap-1 flex-wrap">
            {featured.map((coin, i) => {
              const color = STABLECOIN_COLORS[coin.symbol] || FALLBACK_COLOR;
              return (
                <button
                  key={coin.id}
                  onClick={() => setSelectedIndex(i)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                    selectedIndex === i
                      ? 'bg-chrome-900 text-white'
                      : 'bg-chrome-100 text-chrome-600 hover:bg-chrome-200'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  {coin.symbol}
                </button>
              );
            })}
          </div>

          {/* Time range toggle */}
          <div className="flex items-center gap-1 bg-chrome-100 rounded-lg p-1">
            {(Object.keys(timeRangeLabels) as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-white text-chrome-900 shadow-sm'
                    : 'text-chrome-600 hover:text-chrome-900'
                }`}
              >
                {timeRangeLabels[range]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Summary metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-chrome-50 rounded-lg p-3">
            <p className="text-xs text-chrome-500 mb-1">Current Price</p>
            <p className="text-lg font-semibold text-chrome-900">
              ${metrics.currentPrice.toFixed(4)}
            </p>
          </div>
          <div className="bg-chrome-50 rounded-lg p-3">
            <p className="text-xs text-chrome-500 mb-1">Max Deviation</p>
            <p className={`text-lg font-semibold ${metrics.maxDeviation > 0.5 ? 'text-status-negative' : 'text-status-positive'}`}>
              {metrics.maxDeviation.toFixed(4)}%
            </p>
          </div>
          <div className="bg-chrome-50 rounded-lg p-3">
            <p className="text-xs text-chrome-500 mb-1">Avg Deviation</p>
            <p className={`text-lg font-semibold ${metrics.avgDeviation > 0.1 ? 'text-status-negative' : 'text-status-positive'}`}>
              {metrics.avgDeviation.toFixed(4)}%
            </p>
          </div>
          <div className="bg-chrome-50 rounded-lg p-3">
            <p className="text-xs text-chrome-500 mb-1">Peg Adherence</p>
            <p className={`text-lg font-semibold ${metrics.pegAdherence >= 95 ? 'text-status-positive' : 'text-status-negative'}`}>
              {metrics.pegAdherence.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartPoints}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DEE2E6" />
              <XAxis
                dataKey="date"
                tickFormatter={(val) => formatDate(val, timeRange)}
                tick={{ fontSize: 12, fill: '#6C757D' }}
                axisLine={{ stroke: '#DEE2E6' }}
                tickLine={false}
                interval={timeRange === '30d' ? 6 : timeRange === '1y' ? 30 : 'preserveStartEnd'}
                minTickGap={timeRange === '1y' ? 30 : 50}
              />
              <YAxis
                domain={[0.99, 1.01]}
                tickFormatter={(val: number) => `$${val.toFixed(3)}`}
                tick={{ fontSize: 12, fill: '#6C757D' }}
                axisLine={false}
                tickLine={false}
                width={65}
              />
              <Tooltip content={<ChartTooltip />} />
              <ReferenceLine
                y={1.0}
                stroke="#E2B050"
                strokeDasharray="6 3"
                strokeWidth={1.5}
                label={{
                  value: '$1.00 Peg',
                  position: 'right',
                  fill: '#E2B050',
                  fontSize: 11,
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={selectedColor}
                strokeWidth={1.5}
                dot={false}
                animationDuration={800}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bento Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Card A — Market Overview */}
          <div
            className="relative overflow-hidden rounded-2xl border border-white/60 shadow-lg p-5"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.4))`,
              backdropFilter: 'blur(24px)',
            }}
          >
            {/* Accent glow */}
            <div
              className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: selectedColor }}
            />

            <div className="flex items-center gap-2 mb-4">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: selectedColor }}
              />
              <h3 className="text-sm font-semibold text-chrome-900">Market Overview</h3>
              <span className="ml-auto text-xs font-medium text-chrome-400 bg-white/50 rounded-full px-2 py-0.5">
                #{selectedIndex + 1}
              </span>
            </div>

            <p className="text-2xl font-bold text-chrome-900 mb-4">
              {formatCurrency(selected.marketCap)}
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white/50 rounded-xl px-3 py-2">
                <span className="text-xs text-chrome-500">7d Change</span>
                <span className={`flex items-center gap-1 text-sm font-semibold ${selected.change7d >= 0 ? 'text-status-positive' : 'text-status-negative'}`}>
                  {selected.change7d >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {selected.change7d >= 0 ? '+' : ''}{selected.change7d.toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between bg-white/50 rounded-xl px-3 py-2">
                <span className="text-xs text-chrome-500">30d Change</span>
                <span className={`flex items-center gap-1 text-sm font-semibold ${selected.change30d >= 0 ? 'text-status-positive' : 'text-status-negative'}`}>
                  {selected.change30d >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {selected.change30d >= 0 ? '+' : ''}{selected.change30d.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Card B — Chain Distribution */}
          <div
            className="relative overflow-hidden rounded-2xl border border-white/60 shadow-lg p-5"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.4))`,
              backdropFilter: 'blur(24px)',
            }}
          >
            {/* Accent glow */}
            <div
              className="absolute -top-12 -left-12 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: selectedColor }}
            />

            <h3 className="text-sm font-semibold text-chrome-900 mb-4">Chain Distribution</h3>

            <div className="space-y-3">
              {getChainDistribution(selected.chainBreakdown).map((entry) => (
                <div key={entry.chain}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-chrome-700">{entry.chain}</span>
                    <span className="text-xs text-chrome-500">{entry.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${entry.percentage}%`,
                        backgroundColor: entry.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-chrome-100 flex items-center justify-between">
          <span className="text-xs text-chrome-400">
            Peg adherence = % of days within ±0.50% of $1.00
          </span>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-status-positive animate-pulse flex-shrink-0" />
            <span className="text-xs text-chrome-400">Data refreshed just now</span>
          </div>
        </div>
      </div>
    </div>
  );
}
