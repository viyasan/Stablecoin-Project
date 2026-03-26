import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useStablecoinPrices } from '../../../api';

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number; payload: { date: string; price: number; deviation: number } }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload;

  return (
    <div className="bg-pro-elevated border border-pro-border rounded px-3 py-2">
      <p className="text-[10px] font-mono text-pro-text-muted">
        {formatDate(point.date)}
      </p>
      <p className="text-xs font-mono text-pro-text font-bold">
        ${point.price.toFixed(4)}
      </p>
      <p className="text-xs font-mono text-pro-text-secondary">
        {point.deviation >= 0 ? '+' : ''}
        {point.deviation.toFixed(4)}%
      </p>
    </div>
  );
}

export function ProPriceHistoryChart({ geckoId }: { geckoId: string }) {
  const { data, isLoading } = useStablecoinPrices(90);

  if (isLoading || !data) {
    return (
      <div className="bg-pro-surface border border-pro-border rounded-lg p-4">
        <div className="h-3 w-28 bg-pro-elevated rounded animate-pulse mb-3" />
        <div className="h-[250px] bg-pro-elevated rounded animate-pulse" />
      </div>
    );
  }

  const coinPrices = data.get(geckoId);

  if (!coinPrices || coinPrices.length === 0) {
    return (
      <div className="bg-pro-surface border border-pro-border rounded-lg p-4">
        <p className="text-xs font-mono uppercase tracking-wider text-pro-text-muted mb-3">
          Peg History (90d)
        </p>
        <div className="h-[250px] flex items-center justify-center">
          <p className="text-pro-text-muted text-sm">No price history available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pro-surface border border-pro-border rounded-lg p-4">
      <p className="text-xs font-mono uppercase tracking-wider text-pro-text-muted mb-3">
        Peg History (90d)
      </p>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={coinPrices}>
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 10, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v.toFixed(2)}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="#353A48" strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="deviation"
            stroke="#D4A437"
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
