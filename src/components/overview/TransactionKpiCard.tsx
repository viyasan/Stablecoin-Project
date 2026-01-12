import { useStablecoinTransactionMetrics, isDuneConfigured } from '../../api';
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

function formatNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

interface KpiItemProps {
  label: string;
  value: string;
  change?: number;
  subtext?: string;
  tooltip?: string;
}

function KpiItem({ label, value, change, subtext, tooltip }: KpiItemProps) {
  const isPositive = change !== undefined ? change >= 0 : true;
  const colorClass = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <div className="text-center px-4 py-2 group relative">
      <p className="text-sm font-medium text-gray-500 mb-1">
        {label}
        {tooltip && (
          <span className="ml-1 text-gray-400 cursor-help" title={tooltip}>
            ⓘ
          </span>
        )}
      </p>
      <p className="text-2xl lg:text-3xl font-bold text-gray-900">{value}</p>
      {change !== undefined && (
        <p className={`text-sm font-medium mt-1 ${colorClass}`}>
          {formatPercent(change)}
        </p>
      )}
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}

function ConfigurationPrompt() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          Transaction Activity
        </h2>
      </div>
      <div className="px-6 py-8">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-gray-900 font-medium mb-2">Dune API Not Configured</h3>
          <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
            To display transaction volume, transaction count, and active addresses,
            add your Dune API key and query IDs to the environment variables.
          </p>
          <a
            href="https://dune.com/settings/api"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Get a free API key
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export function TransactionKpiCard() {
  const isConfigured = isDuneConfigured();
  const { data, isLoading, error, refetch } = useStablecoinTransactionMetrics();

  // Show configuration prompt if API key not set
  if (!isConfigured) {
    return <ConfigurationPrompt />;
  }

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
          <p className="text-gray-500 mb-2">Failed to load transaction data</p>
          <p className="text-sm text-gray-400 mb-4">{error?.message}</p>
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
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Transaction Activity
        </h2>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          Powered by
          <a
            href="https://dune.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Dune
          </a>
        </span>
      </div>
      <div className="px-6 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
          <KpiItem
            label="Adj. Transfer Volume"
            value={formatCurrency(data.adjustedTransferVolume)}
            change={data.adjustedTransferVolumeChange24h}
            subtext="24h"
            tooltip="Transfer volume filtered for bot activity and wash trading"
          />
          <KpiItem
            label="Transactions"
            value={formatNumber(data.transactionCount)}
            change={data.transactionCountChange24h}
            subtext="24h"
          />
          <KpiItem
            label="Active Addresses"
            value={formatNumber(data.dailyActiveUsers)}
            change={data.dailyActiveUsersChange24h}
            subtext="24h unique"
            tooltip="Unique addresses that sent or received stablecoins"
          />
        </div>
      </div>
    </div>
  );
}
