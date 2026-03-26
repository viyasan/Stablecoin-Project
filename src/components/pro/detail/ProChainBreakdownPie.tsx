import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ChainBreakdownEntry } from '../../../types';

const COLORS = [
  '#D4A437',
  '#E2B050',
  '#CD7F32',
  '#4A9D6E',
  '#6B7280',
  '#9CA3AF',
  '#B8922E',
  '#C0524E',
];

function formatCompactCurrency(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-pro-elevated border border-pro-border rounded px-3 py-2">
      <p className="text-xs font-mono text-pro-text font-bold">
        {payload[0].name}
      </p>
      <p className="text-xs font-mono text-pro-text-secondary">
        {formatCompactCurrency(payload[0].value)}
      </p>
    </div>
  );
}

function renderLabel(props: {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  percent: number;
  chain: string;
}) {
  const { cx, cy, midAngle, outerRadius, percent, chain } = props;
  if (percent < 0.05) return null;

  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#9CA3AF"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={11}
      fontFamily="monospace"
    >
      {chain} {(percent * 100).toFixed(1)}%
    </text>
  );
}

export function ProChainBreakdownPie({ chainBreakdown }: { chainBreakdown: ChainBreakdownEntry[] }) {
  const totalAmount = chainBreakdown.reduce((sum, entry) => sum + entry.amount, 0);

  // Map to plain objects for Recharts compatibility (needs index signature)
  const chartData = chainBreakdown.map((entry) => ({
    chain: entry.chain,
    amount: entry.amount,
  }));

  if (!chainBreakdown.length || chainBreakdown.length <= 1) {
    return (
      <div className="bg-pro-surface border border-pro-border rounded-lg p-4">
        <p className="text-xs font-mono uppercase tracking-wider text-pro-text-muted mb-3">
          Chain Distribution
        </p>
        <div className="h-[250px] flex items-center justify-center">
          <p className="text-pro-text-muted text-sm">
            {chainBreakdown.length === 1
              ? `100% on ${chainBreakdown[0].chain}`
              : 'No chain distribution data'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pro-surface border border-pro-border rounded-lg p-4">
      <p className="text-xs font-mono uppercase tracking-wider text-pro-text-muted mb-3">
        Chain Distribution
      </p>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="amount"
            nameKey="chain"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            label={renderLabel as any}
          >
            {chartData.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {chainBreakdown.map((entry, index) => {
          const pct = (entry.amount / totalAmount) * 100;
          return (
            <div key={entry.chain} className="flex items-center gap-2 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-pro-text-secondary font-mono truncate">
                {entry.chain}
              </span>
              <span className="text-pro-text-muted font-mono ml-auto">
                {pct.toFixed(1)}%
              </span>
              <span className="text-pro-text-muted font-mono">
                {formatCompactCurrency(entry.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
