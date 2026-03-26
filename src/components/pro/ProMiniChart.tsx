import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useProData } from './ProDataProvider';

function formatCompactCurrency(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

function formatDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number; payload: { timestamp: string } }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-pro-elevated border border-pro-border rounded px-3 py-2">
      <p className="text-[10px] font-mono text-pro-text-muted">
        {formatDate(payload[0].payload.timestamp)}
      </p>
      <p className="text-xs font-mono text-pro-text font-bold">
        {formatCompactCurrency(payload[0].value)}
      </p>
    </div>
  );
}

export function ProMiniChart() {
  const { chart30d } = useProData();
  const { data, isLoading } = chart30d;

  if (isLoading || !data) {
    return (
      <div className="bg-pro-surface border border-pro-border rounded-lg p-4">
        <div className="h-3 w-28 bg-pro-elevated rounded animate-pulse mb-3" />
        <div className="h-[180px] bg-pro-elevated rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-pro-surface border border-pro-border rounded-lg p-4">
      <p className="text-xs font-mono uppercase tracking-wider text-pro-text-muted mb-3">
        Market Cap (30d)
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4A437" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#D4A437" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatDate}
            tick={{ fontSize: 10, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="totalMarketCap"
            stroke="#D4A437"
            strokeWidth={1.5}
            fill="url(#goldGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
