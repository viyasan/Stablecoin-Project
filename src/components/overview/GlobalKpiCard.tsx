import { useMarketSummary } from '../../api';
import { Spinner } from '../common';

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
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  return date.toLocaleDateString();
}

interface KpiItemProps {
  label: string;
  value: string;
  change?: number;
  subtext?: string;
}

function KpiItem({ label, value, change, subtext }: KpiItemProps) {
  return (
    <div className="text-center px-4 py-2">
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-2xl lg:text-3xl font-bold text-gray-900">{value}</p>
      {change !== undefined && (
        <p
          className={`text-sm font-medium mt-1 ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {formatPercent(change)}
        </p>
      )}
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}

export function GlobalKpiCard() {
  const { data, isLoading, error, refetch } = useMarketSummary();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
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
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          Global Stablecoin Market
        </h2>
      </div>
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          <KpiItem
            label="Total Market Cap"
            value={formatCurrency(data.totalMarketCap)}
            change={data.change24h}
            subtext="24h change"
          />
          <KpiItem
            label="7D Change"
            value={formatPercent(data.change7d)}
            change={data.change7d}
          />
          <KpiItem
            label="30D Change"
            value={formatPercent(data.change30d)}
            change={data.change30d}
          />
          <KpiItem
            label="Tracked Assets"
            value={data.trackedStablecoins.toString()}
          />
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <span>Last updated: {formatTimeAgo(data.lastUpdated)}</span>
          <span>Source: {data.dataSource}</span>
        </div>
      </div>
    </div>
  );
}
