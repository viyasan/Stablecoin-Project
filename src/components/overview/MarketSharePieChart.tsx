import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { useStablecoinList } from '../../api';
import { Spinner } from '../common';

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
  name: string;
  symbol: string;
  value: number;
  percentage: number;
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
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
      <p className="text-sm font-semibold text-gray-900">{data.name}</p>
      <p className="text-sm text-gray-600">{formatCurrency(data.value)}</p>
      <p className="text-sm text-gray-500">{formatPercent(data.percentage)}</p>
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
            <span className="text-gray-700 font-medium">{entry.payload.symbol}</span>
          </div>
          <span className="text-gray-500">{formatPercent(entry.payload.percentage)}</span>
        </div>
      ))}
    </div>
  );
}

export function MarketSharePieChart() {
  const { data: stablecoins, isLoading, error, refetch } = useStablecoinList();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !stablecoins) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Failed to load market data</p>
            <button
              onClick={refetch}
              className="text-primary-600 hover:text-primary-700 font-medium"
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
  }));

  // Add "Others" if there are more stablecoins
  if (othersMarketCap > 0) {
    chartData.push({
      name: 'Others',
      symbol: 'Others',
      value: othersMarketCap,
      percentage: (othersMarketCap / totalMarketCap) * 100,
    });
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Market Share</h2>
      </div>
      <div className="p-6">
        <div className="h-96 flex gap-6">
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
          <div className="w-32 flex items-center pl-2 border-l border-gray-100">
            <CustomLegend
              payload={chartData.map((item, index) => ({
                value: item.symbol,
                color: getColorForSymbol(item.symbol, index),
                payload: item,
              }))}
            />
          </div>
        </div>

        {/* Total Market Cap */}
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">Total Stablecoin Market Cap</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(totalMarketCap)}</p>
        </div>
      </div>
    </div>
  );
}
