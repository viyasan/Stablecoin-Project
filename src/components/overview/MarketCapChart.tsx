import { useState } from 'react';
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
import { SkeletonChart, FadeInSlide } from '../common';

type TimeRange = '30d' | '1y' | 'max';

const timeRangeLabels: Record<TimeRange, string> = {
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
  if (range === '30d') {
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  }
  if (range === 'max') {
    return date.getFullYear().toString();
  }
  // 1Y - just show month
  return date.toLocaleDateString(undefined, {
    month: 'short',
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
    if (change > 0.5) return <TrendingUp className="w-4 h-4 text-status-positive" />;
    if (change < -0.5) return <TrendingDown className="w-4 h-4 text-status-negative" />;
    return <Minus className="w-4 h-4 text-chrome-400" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0.5) return 'text-status-positive';
    if (change < -0.5) return 'text-status-negative';
    return 'text-chrome-500';
  };

  const periodLabel = timeRange === '30d' ? '30d' : timeRange === '1y' ? '1y' : 'all time';

  return (
    <div className="bg-white border border-chrome-200 rounded-lg shadow-lg p-3 min-w-[200px]">
      {/* Date Header */}
      <p className="text-xs text-chrome-500 mb-2">
        {new Date(label || '').toLocaleDateString(undefined, {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </p>

      {/* Main Value */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-chrome-600">Total Market Cap</span>
        <span className="text-base font-semibold text-chrome-900">
          {formatCurrencyShort(currentValue)}
        </span>
      </div>

      {/* Mini Sparkline - hide for 'max' since it's not meaningful */}
      {timeRange !== 'max' && sparklineData.length > 1 && (
        <div className="mb-3 border-t border-chrome-100 pt-2">
          <div className="h-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={changeFromStart >= 0 ? '#4A9D6E' : '#C0524E'}
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
        <div className="flex items-center justify-between pt-2 border-t border-chrome-100">
          <span className="text-xs text-chrome-500">Change ({periodLabel})</span>
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
      <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-chrome-500 mb-4">Failed to load chart data</p>
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

  const chartData: ChartDataPoint[] = data.map((point) => ({
    timestamp: point.timestamp,
    'Total Market Cap': point.totalMarketCap,
    ...(showBreakdown && point.breakdown
      ? Object.fromEntries(
          point.breakdown.map((b) => [b.symbol, b.marketCap])
        )
      : {}),
  }));

  const colors = ['#E2B050', '#ADB5BD', '#CD7F32', '#495057'];

  return (
    <FadeInSlide>
      <div className="bg-white rounded-lg shadow-sm border border-chrome-200 h-full flex flex-col">
        <div className="px-6 py-4 border-b border-chrome-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-chrome-900">
            Market Cap Over Time
          </h2>
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
      <div className="p-6 flex-1 flex flex-col">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#DEE2E6" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(val) => formatDate(val, timeRange)}
                tick={{ fontSize: 12, fill: '#6C757D' }}
                axisLine={{ stroke: '#DEE2E6' }}
                tickLine={false}
                interval={timeRange === '30d' ? 6 : timeRange === '1y' ? 30 : 'preserveStartEnd'}
                minTickGap={timeRange === '1y' ? 30 : 50}
              />
              <YAxis
                tickFormatter={formatCurrencyShort}
                tick={{ fontSize: 12, fill: '#6C757D' }}
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
                      animationDuration={800}
                      animationBegin={index * 50}
                      animationEasing="ease-out"
                      isAnimationActive={true}
                    />
                  ))}
                </>
              ) : (
                <Area
                  type="monotone"
                  dataKey="Total Market Cap"
                  stroke="#E2B050"
                  fill="url(#gradient-0)"
                  strokeWidth={2}
                  animationDuration={800}
                  animationBegin={0}
                  animationEasing="ease-out"
                  isAnimationActive={true}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 pt-4 border-t border-chrome-100 text-xs text-chrome-400">
          Data refreshed just now
        </div>
      </div>
    </div>
    </FadeInSlide>
  );
}
