import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Layers } from "lucide-react";
import { useChainBreakdown } from "../../api";
import { SkeletonBarChart } from "../common";

// Chain colors - distinct colors for each chain
const CHAIN_COLORS: Record<string, string> = {
  Ethereum: "#627EEA",
  Tron: "#FF0013",
  BSC: "#F0B90B",
  Solana: "#9945FF",
  Arbitrum: "#28A0F0",
  Hyperliquid: "#00D395",
  Base: "#0052FF",
  Polygon: "#8247E5",
  Avalanche: "#E84142",
  "OP Mainnet": "#FF0420",
  Aptos: "#66CCFF",
  Sui: "#4DA2FF",
  TON: "#0098EA",
  Near: "#00C08B",
  Fantom: "#1969FF",
};

const FALLBACK_COLORS = [
  "#6366F1",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#84CC16",
  "#06B6D4",
];

function getColorForChain(chain: string, index: number): string {
  if (CHAIN_COLORS[chain]) {
    return CHAIN_COLORS[chain];
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

function formatCurrencyShort(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(1)}T`;
  }
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(0)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(0)}M`;
  }
  return `$${(value / 1_000).toFixed(0)}K`;
}

interface ChartDataItem {
  name: string;
  totalCirculating: number;
  percentage: number;
  rank: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataItem;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  const chainColor = getColorForChain(data.name, data.rank - 1);

  return (
    <div className="bg-white border border-chrome-200 rounded-lg shadow-lg p-3 min-w-[180px]">
      {/* Header with chain name and rank badge */}
      <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-chrome-100">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: chainColor }}
          />
          <span className="text-sm font-semibold text-chrome-900">{data.name}</span>
        </div>
        <span className="text-xs font-medium text-chrome-400 bg-chrome-100 px-1.5 py-0.5 rounded">
          #{data.rank}
        </span>
      </div>

      {/* Supply */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-chrome-500">Total Supply</span>
        <span className="text-sm font-semibold text-chrome-900">
          {formatCurrency(data.totalCirculating)}
        </span>
      </div>

      {/* Market Share */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-chrome-500">Share</span>
        <span className="text-sm font-medium text-chrome-700">
          {data.percentage.toFixed(2)}%
        </span>
      </div>

      {/* Visual share bar */}
      <div className="pt-2 border-t border-chrome-100">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-chrome-400" />
          <div className="flex-1 bg-chrome-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(data.percentage, 100)}%`,
                backgroundColor: chainColor,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChainBreakdownChart() {
  const { data: chains, isLoading, error, refetch } = useChainBreakdown();

  if (isLoading) {
    return <SkeletonBarChart />;
  }

  if (error || !chains) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-chrome-500 mb-4">Failed to load chain data</p>
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

  // Calculate total and get top 10 chains
  const totalCirculating = chains.reduce(
    (sum, chain) => sum + chain.totalCirculating,
    0
  );
  const topChains = chains.slice(0, 10);

  // Prepare chart data with percentages and rank
  const chartData: ChartDataItem[] = topChains.map((chain, index) => ({
    name: chain.name,
    totalCirculating: chain.totalCirculating,
    percentage: (chain.totalCirculating / totalCirculating) * 100,
    rank: index + 1,
  }));

  return (
      <div className="bg-white rounded-lg shadow-sm border border-chrome-200">
        <div className="px-4 sm:px-6 py-4 border-b border-chrome-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-center sm:text-left">
            <h2 className="text-base sm:text-lg font-semibold text-chrome-900">
              Stablecoin Supply by Chain
            </h2>
          <p className="text-xs sm:text-sm text-chrome-500 mt-1">
            Top 10 chains by stablecoin supply
          </p>
        </div>
        <div className="text-center sm:text-right">
          <p className="text-xs sm:text-sm text-chrome-500">Total Supply</p>
          <p className="text-base sm:text-lg font-bold text-chrome-900">
            {formatCurrency(totalCirculating)}
          </p>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {/* Mobile: percentage bar list */}
        <div className="sm:hidden space-y-3">
          {chartData.map((entry, index) => (
            <div key={entry.name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getColorForChain(entry.name, index) }}
                  />
                  <span className="text-sm font-medium text-chrome-800">{entry.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-chrome-500">{formatCurrency(entry.totalCirculating)}</span>
                  <span className="text-sm font-semibold text-chrome-900 w-14 text-right">{entry.percentage.toFixed(1)}%</span>
                </div>
              </div>
              <div className="h-2 bg-chrome-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(entry.percentage, 1)}%`,
                    backgroundColor: getColorForChain(entry.name, index),
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: bar chart */}
        <div className="hidden sm:block h-[350px] lg:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 60, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#DEE2E6"
                horizontal={true}
                vertical={false}
              />
              <XAxis
                type="number"
                tickFormatter={formatCurrencyShort}
                tick={{ fontSize: 12, fill: "#6C757D" }}
                axisLine={{ stroke: "#DEE2E6" }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: "#343A40", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={75}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#E9ECEF" }}
              />
              <Bar
                dataKey="totalCirculating"
                radius={[0, 4, 4, 0]}
                barSize={28}
                animationDuration={600}
                animationBegin={0}
                animationEasing="ease-out"
                isAnimationActive={true}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getColorForChain(entry.name, index)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 pt-4 border-t border-chrome-100 text-xs text-chrome-400 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-status-positive animate-pulse flex-shrink-0" />
          <span>Data refreshed just now</span>
        </div>
      </div>
    </div>
  );
}
