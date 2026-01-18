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
import { useChainBreakdown } from "../../api";
import { Spinner } from "../common";

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

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      totalCirculating: number;
      percentage: number;
    };
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
      <p className="text-sm font-semibold text-gray-900">{data.name}</p>
      <p className="text-sm text-gray-600">
        {formatCurrency(data.totalCirculating)}
      </p>
      <p className="text-sm text-gray-500">
        {data.percentage.toFixed(2)}% of total
      </p>
    </div>
  );
}

export function ChainBreakdownChart() {
  const { data: chains, isLoading, error, refetch } = useChainBreakdown();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !chains) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Failed to load chain data</p>
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

  // Calculate total and get top 10 chains
  const totalCirculating = chains.reduce(
    (sum, chain) => sum + chain.totalCirculating,
    0
  );
  const topChains = chains.slice(0, 10);

  // Prepare chart data with percentages
  const chartData = topChains.map((chain) => ({
    name: chain.name,
    totalCirculating: chain.totalCirculating,
    percentage: (chain.totalCirculating / totalCirculating) * 100,
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Stablecoin Supply by Chain
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Top 10 chains by stablecoin supply
          </p>
          <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
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
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Supply</p>
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(totalCirculating)}
          </p>
        </div>
      </div>
      <div className="p-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                horizontal={true}
                vertical={false}
              />
              <XAxis
                type="number"
                tickFormatter={formatCurrencyShort}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={{ stroke: "#e5e7eb" }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: "#374151", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={75}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#f3f4f6" }}
              />
              <Bar
                dataKey="totalCirculating"
                radius={[0, 4, 4, 0]}
                barSize={28}
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
      </div>
    </div>
  );
}
