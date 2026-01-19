import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useMarketCapChart } from '../../api';
import { SkeletonChart } from '../common';

type TimeRange = '7d' | '30d' | '1y' | 'max';

const timeRangeLabels: Record<TimeRange, string> = {
  '7d': '7D',
  '30d': '30D',
  '1y': '1Y',
  max: 'Max',
};

function formatCurrencyShort(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(1)}T`;
  }
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(0)}B`;
  }
  return `$${(value / 1_000_000).toFixed(0)}M`;
}

function formatDate(timestamp: string, range: TimeRange): string {
  const date = new Date(timestamp);
  if (range === '7d') {
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }
  if (range === '30d') {
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  }
  return date.toLocaleDateString(undefined, {
    month: 'short',
    year: '2-digit',
  });
}

interface ChartDataPoint {
  timestamp: string;
  'Total Market Cap': number;
  [key: string]: string | number;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
  }>;
  label?: string;
  chartData?: ChartDataPoint[];
  timeRange?: TimeRange;
}

function formatChangePercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function ChartTooltip({ active, payload, label, chartData, timeRange }: ChartTooltipProps) {
  if (!active || !payload?.length || !chartData) return null;

  const currentValue = payload[0]?.value || 0;
  const currentIndex = chartData.findIndex((d) => d.timestamp === label);

  // Get sparkline data (last 14 points up to and including current point)
  const sparklineStart = Math.max(0, currentIndex - 13);
  const sparklineData = chartData.slice(sparklineStart, currentIndex + 1).map((d) => ({
    value: d['Total Market Cap'],
  }));

  // Calculate change from start of visible period
  const startValue = chartData[0]?.['Total Market Cap'] || 0;
  const changeFromStart = startValue > 0 ? ((currentValue - startValue) / startValue) * 100 : 0;

  const getTrendIcon = (change: number) => {
    if (change > 0.5) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < -0.5) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0.5) return 'text-green-600';
    if (change < -0.5) return 'text-red-600';
    return 'text-gray-500';
  };

  const periodLabel = timeRange === '7d' ? '7d' : timeRange === '30d' ? '30d' : timeRange === '1y' ? '1y' : 'all time';

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[200px]">
      {/* Date Header */}
      <p className="text-xs text-gray-500 mb-2">
        {new Date(label || '').toLocaleDateString(undefined, {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </p>

      {/* Main Value */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-600">Total Market Cap</span>
        <span className="text-base font-semibold text-gray-900">
          {formatCurrencyShort(currentValue)}
        </span>
      </div>

      {/* Mini Sparkline - hide for 'max' since it's not meaningful */}
      {timeRange !== 'max' && sparklineData.length > 1 && (
        <div className="mb-3 border-t border-gray-100 pt-2">
          <div className="h-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={changeFromStart >= 0 ? '#22c55e' : '#ef4444'}
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Change from Period Start - hide for 'max' since it's not meaningful */}
      {timeRange !== 'max' && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">Change ({periodLabel})</span>
          <div className="flex items-center gap-1">
            {getTrendIcon(changeFromStart)}
            <span className={`text-sm font-medium ${getChangeColor(changeFromStart)}`}>
              {formatChangePercent(changeFromStart)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

interface MarketCapChartProps {
  showBreakdown?: boolean;
}

export function MarketCapChart({ showBreakdown = true }: MarketCapChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('1y');
  const { data, isLoading, error, refetch } = useMarketCapChart(timeRange);

  if (isLoading) {
    return <SkeletonChart height={300} />;
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Failed to load chart data</p>
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

  const chartData: ChartDataPoint[] = data.map((point) => ({
    timestamp: point.timestamp,
    'Total Market Cap': point.totalMarketCap,
    ...(showBreakdown && point.breakdown
      ? Object.fromEntries(
          point.breakdown.map((b) => [b.symbol, b.marketCap])
        )
      : {}),
  }));

  const colors = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#6b7280'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Market Cap Over Time
          </h2>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            Powered by
            <a
              href="https://defillama.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              DefiLlama
            </a>
          </span>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {(Object.keys(timeRangeLabels) as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {timeRangeLabels[range]}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        <div className="h-[460px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                {colors.map((color, index) => (
                  <linearGradient
                    key={index}
                    id={`gradient-${index}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.05} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(val) => formatDate(val, timeRange)}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={formatCurrencyShort}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip content={<ChartTooltip chartData={chartData} timeRange={timeRange} />} />
              {showBreakdown && data[0]?.breakdown ? (
                <>
                  <Legend />
                  {data[0].breakdown.map((b, index) => (
                    <Area
                      key={b.symbol}
                      type="monotone"
                      dataKey={b.symbol}
                      stackId="1"
                      stroke={colors[index]}
                      fill={`url(#gradient-${index})`}
                      strokeWidth={2}
                    />
                  ))}
                </>
              ) : (
                <Area
                  type="monotone"
                  dataKey="Total Market Cap"
                  stroke="#0ea5e9"
                  fill="url(#gradient-0)"
                  strokeWidth={2}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
