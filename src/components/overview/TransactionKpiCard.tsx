import { useState } from 'react';

// Static data from Visa Onchain Analytics
// Source: https://visaonchainanalytics.com/
// Last updated: January 2026

type TimePeriod = '12M' | '3M' | 'All';

interface VisaMetrics {
  adjustedTransactionVolume: string;
  adjustedTransactionCount: string;
  totalActiveAddresses: string;
  label: string;
}

const VISA_METRICS: Record<TimePeriod, VisaMetrics> = {
  '12M': {
    adjustedTransactionVolume: '$10.4T',
    adjustedTransactionCount: '2.1B',
    totalActiveAddresses: '316.0M',
    label: 'Last 12 Months',
  },
  '3M': {
    adjustedTransactionVolume: '$1.9T',
    adjustedTransactionCount: '352.8M',
    totalActiveAddresses: '116.8M',
    label: 'Last 3 Months',
  },
  'All': {
    adjustedTransactionVolume: '$29.2T',
    adjustedTransactionCount: '5.4B',
    totalActiveAddresses: '722.6M',
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
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  );
}

export function TransactionKpiCard() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('All');
  const metrics = VISA_METRICS[timePeriod];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Transaction Activity
          </h2>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            Powered by
            <a
              href="https://visaonchainanalytics.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Visa Onchain Analytics
            </a>
          </span>
        </div>

        {/* Time Period Toggle */}
        <div className="flex gap-2">
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
        </div>
      </div>
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
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
