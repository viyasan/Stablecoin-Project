import { useState } from 'react';

// Static data from Visa Onchain Analytics Dashboard
// Source: https://visaonchainanalytics.com/
// Data provided by Allium Labs
// Last updated: January 2026
//
// To update these values:
// 1. Visit https://visaonchainanalytics.com/transactions
// 2. Select the appropriate time period (All, 12M, or 3M)
// 3. Copy the Adjusted Transaction Volume, Adjusted Transaction Count values
// 4. Visit https://visaonchainanalytics.com/ for Active Addresses

type TimePeriod = '12M' | '3M' | 'All';

interface AlliumMetrics {
  adjustedTransactionVolume: string;
  adjustedTransactionCount: string;
  totalActiveAddresses: string;
  label: string;
}

const VISA_METRICS: Record<TimePeriod, AlliumMetrics> = {
  '12M': {
    adjustedTransactionVolume: '$11.5T',
    adjustedTransactionCount: '2.3B',
    totalActiveAddresses: '361.4M',
    label: 'Last 12 Months',
  },
  '3M': {
    adjustedTransactionVolume: '$3.2T',
    adjustedTransactionCount: '612.5M',
    totalActiveAddresses: '142.8M',
    label: 'Last 3 Months',
  },
  'All': {
    adjustedTransactionVolume: '$57.8T',
    adjustedTransactionCount: '12.7B',
    totalActiveAddresses: '721.3M',
    label: 'Since 2019',
  },
};

interface KpiItemProps {
  label: string;
  value: string;
  subtext?: string;
  tooltip?: string;
}

function KpiItem({ label, value, subtext, tooltip }: KpiItemProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-4 group relative">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2 text-center">{label}</p>
      <p className="text-3xl lg:text-4xl font-bold font-mono-numbers text-gray-900 text-center">{value}</p>
      {subtext && (
        <p className="text-sm text-gray-400 mt-3 text-center">
          {subtext}
          {tooltip && (
            <span className="ml-1 text-xs text-gray-300 cursor-help opacity-0 group-hover:opacity-100 transition-opacity relative inline-block">
              <span className="peer">ⓘ</span>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap opacity-0 peer-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {tooltip}
              </span>
            </span>
          )}
        </p>
      )}
    </div>
  );
}

export function TransactionKpiCard() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('3M');
  const metrics = VISA_METRICS[timePeriod];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Stablecoin Transaction Activity
        </h2>

        {/* Time Period Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setTimePeriod('3M')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              timePeriod === '3M'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            3 Months
          </button>
          <button
            onClick={() => setTimePeriod('12M')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              timePeriod === '12M'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            12 Months
          </button>
          <button
            onClick={() => setTimePeriod('All')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              timePeriod === 'All'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All-time
          </button>
        </div>
      </div>
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 items-start">
          <KpiItem
            label="Adjusted Transaction Volume"
            value={metrics.adjustedTransactionVolume}
            subtext={metrics.label}
            tooltip="Stablecoin transaction volume filtered for bot activity and wash trading"
          />
          <KpiItem
            label="Adjusted Transaction Count"
            value={metrics.adjustedTransactionCount}
            subtext={metrics.label}
            tooltip="Number of stablecoin transactions filtered for bot activity"
          />
          <KpiItem
            label="Total Active Addresses"
            value={metrics.totalActiveAddresses}
            subtext={metrics.label}
            tooltip="Unique addresses that sent or received stablecoins"
          />
        </div>
      </div>
    </div>
  );
}
