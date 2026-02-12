import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useStablecoinList } from '../../api';
import { SkeletonPieChart } from '../common';

// Specific colors for top stablecoins
const STABLECOIN_COLORS: Record<string, string> = {
  USDT: '#22C55E',   // Green
  USDC: '#3B82F6',   // Blue
  USDe: '#8B5CF6',   // Purple
  USDS: '#F59E0B',   // Amber
  DAI: '#F97316',    // Orange
  PYUSD: '#0EA5E9',  // Sky blue
  USD1: '#EC4899',   // Pink
  USDf: '#14B8A6',   // Teal
  USYC: '#6366F1',   // Indigo
  RLUSD: '#EF4444',  // Red
  Others: '#6B7280', // Gray
};

// Fallback colors for any unlisted stablecoins
const FALLBACK_COLORS = [
  '#A855F7', // Purple
  '#84CC16', // Lime
  '#06B6D4', // Cyan
  '#F43F5E', // Rose
  '#78716C', // Stone
];

function getColorForSymbol(symbol: string, index: number): string {
  if (STABLECOIN_COLORS[symbol]) {
    return STABLECOIN_COLORS[symbol];
  }
  return FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

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

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

interface PieChartData {
  [key: string]: string | number;
  name: string;
  symbol: string;
  value: number;
  percentage: number;
  change7d: number;
  change30d: number;
}

function formatChangePercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: PieChartData;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  const change7d = data.change7d;
  const change30d = data.change30d;

  const getTrendIcon = (change: number) => {
    if (change > 0.5) return <TrendingUp className="w-3.5 h-3.5 text-status-positive" />;
    if (change < -0.5) return <TrendingDown className="w-3.5 h-3.5 text-status-negative" />;
    return <Minus className="w-3.5 h-3.5 text-chrome-400" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0.5) return 'text-status-positive';
    if (change < -0.5) return 'text-status-negative';
    return 'text-chrome-500';
  };

  return (
    <div className="bg-white border border-chrome-200 rounded-lg shadow-lg p-3 min-w-[180px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-chrome-100">
        <span className="text-sm font-semibold text-chrome-900">{data.symbol}</span>
        <span className="text-xs text-chrome-500">{data.name}</span>
      </div>

      {/* Market Cap */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-chrome-500">Market Cap</span>
        <span className="text-sm font-semibold text-chrome-900">{formatCurrency(data.value)}</span>
      </div>

      {/* Market Share */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-chrome-500">Share</span>
        <span className="text-sm font-medium text-chrome-700">{formatPercent(data.percentage)}</span>
      </div>

      {/* Changes */}
      {data.symbol !== 'Others' && (
        <div className="pt-2 border-t border-chrome-100 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-chrome-500">7d Change</span>
            <div className="flex items-center gap-1">
              {getTrendIcon(change7d)}
              <span className={`text-xs font-medium ${getChangeColor(change7d)}`}>
                {formatChangePercent(change7d)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-chrome-500">30d Change</span>
            <div className="flex items-center gap-1">
              {getTrendIcon(change30d)}
              <span className={`text-xs font-medium ${getChangeColor(change30d)}`}>
                {formatChangePercent(change30d)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface CustomLegendProps {
  payload?: Array<{
    value: string;
    color: string;
    payload: PieChartData;
  }>;
}

function CustomLegend({ payload }: CustomLegendProps) {
  if (!payload) return null;

  return (
    <div className="flex flex-col gap-2 text-sm">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-chrome-700 font-medium">{entry.payload.symbol}</span>
          </div>
          <span className="text-chrome-500">{formatPercent(entry.payload.percentage)}</span>
        </div>
      ))}
    </div>
  );
}

export function MarketSharePieChart() {
  const { data: stablecoins, isLoading, error, refetch } = useStablecoinList();

  if (isLoading) {
    return <SkeletonPieChart />;
  }

  if (error || !stablecoins) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-8">
        <div className="flex items-center justify-center h-64">
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
      </div>
    );
  }

  // Calculate total market cap
  const totalMarketCap = stablecoins.reduce((sum, coin) => sum + coin.marketCap, 0);

  // Get top 8 stablecoins, group rest as "Others"
  const topStablecoins = stablecoins.slice(0, 8);
  const othersMarketCap = stablecoins
    .slice(8)
    .reduce((sum, coin) => sum + coin.marketCap, 0);

  // Prepare chart data
  const chartData: PieChartData[] = topStablecoins.map((coin) => ({
    name: coin.name,
    symbol: coin.symbol,
    value: coin.marketCap,
    percentage: (coin.marketCap / totalMarketCap) * 100,
    change7d: coin.change7d,
    change30d: coin.change30d,
  }));

  // Add "Others" if there are more stablecoins
  if (othersMarketCap > 0) {
    chartData.push({
      name: 'Others',
      symbol: 'Others',
      value: othersMarketCap,
      percentage: (othersMarketCap / totalMarketCap) * 100,
      change7d: 0,
      change30d: 0,
    });
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-chrome-200 h-full flex flex-col">
      <div className="px-6 py-4 border-b border-chrome-100">
        <h2 className="text-lg font-semibold text-chrome-900">Stablecoin Market Share</h2>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="pb-4 border-b border-chrome-100 text-center">
          <p className="text-sm text-chrome-500">Total Stablecoin Market Cap</p>
          <p className="text-xl font-bold text-chrome-900">{formatCurrency(totalMarketCap)}</p>
        </div>
        <div className="h-[460px] flex gap-6">
          {/* Pie Chart */}
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="45%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={115}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getColorForSymbol(entry.symbol, index)}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="w-32 flex items-center pl-2 border-l border-chrome-100">
            <CustomLegend
              payload={chartData.map((item, index) => ({
                value: item.symbol,
                color: getColorForSymbol(item.symbol, index),
                payload: item,
              }))}
            />
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-chrome-100 text-xs text-chrome-400">
          Data refreshed just now
        </div>
      </div>
    </div>
  );
}
