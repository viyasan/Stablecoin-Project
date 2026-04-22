import { useMemo } from 'react';
import { TrendingUp, Landmark, ShieldCheck, Info } from 'lucide-react';
import type { ReserveSnapshot } from '../../data/reserveHistory';
import { formatBillions } from '../../utils/formatters';

interface ReserveInsightsPanelProps {
  snapshots: ReserveSnapshot[];
  symbol: string;
}

export function ReserveInsightsPanel({ snapshots, symbol }: ReserveInsightsPanelProps) {
  const latest = snapshots[snapshots.length - 1];

  const { treasuryPct, reserveChange } = useMemo(() => {
    if (!latest) return { treasuryPct: '0', reserveChange: null };
    const prev = snapshots.length > 1 ? snapshots[snapshots.length - 2] : null;
    return {
      treasuryPct: latest.totalReserves > 0
        ? ((latest.treasuryHoldings / latest.totalReserves) * 100).toFixed(1)
        : '0',
      reserveChange: prev ? latest.totalReserves - prev.totalReserves : null,
    };
  }, [snapshots, latest]);

  if (!latest) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-chrome-200 h-full p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-gold-500" />
          <h2 className="text-lg font-semibold text-chrome-900">Key Insights</h2>
        </div>
        <div className="flex flex-col items-center justify-center text-center py-8 text-chrome-400">
          <Info className="w-10 h-10 mb-3 opacity-30" />
          <p className="text-sm">No data available for {symbol}</p>
          <p className="text-xs mt-1">
            Insights like backing ratio, treasury exposure, and period-over-period changes will appear here once reports are added.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-chrome-200 h-full flex flex-col">
      <div className="px-6 py-4 border-b border-chrome-100">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gold-500" />
          <h2 className="text-lg font-semibold text-chrome-900">Key Insights</h2>
        </div>
        <p className="text-xs text-chrome-500 mt-1">{symbol} — {latest.reportPeriod}</p>
      </div>

      <div className="px-6 py-4 flex-1 space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-chrome-400" />
            <span className="text-xs font-medium text-chrome-500 uppercase tracking-wide">Backing Ratio</span>
          </div>
          <p className={`text-2xl font-bold font-mono-numbers ${
            latest.backingRatio >= 1 ? 'text-status-positive' : 'text-status-negative'
          }`}>
            {(latest.backingRatio * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-chrome-400 mt-0.5">
            {latest.backingRatio >= 1
              ? 'Reserves exceed circulating supply'
              : 'Reserves below circulating supply'}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Landmark className="w-4 h-4 text-chrome-400" />
            <span className="text-xs font-medium text-chrome-500 uppercase tracking-wide">Treasury Exposure</span>
          </div>
          <p className="text-2xl font-bold font-mono-numbers text-chrome-900">
            {treasuryPct}%
          </p>
          <p className="text-xs text-chrome-400 mt-0.5">
            {formatBillions(latest.treasuryHoldings)} in US Treasuries
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-chrome-400" />
            <span className="text-xs font-medium text-chrome-500 uppercase tracking-wide">Period Change</span>
          </div>
          {reserveChange !== null ? (
            <>
              <p className={`text-2xl font-bold font-mono-numbers ${
                reserveChange >= 0 ? 'text-status-positive' : 'text-status-negative'
              }`}>
                {reserveChange >= 0 ? '+' : ''}{formatBillions(reserveChange)}
              </p>
              <p className="text-xs text-chrome-400 mt-0.5">vs. previous report</p>
            </>
          ) : (
            <div className="p-3 bg-chrome-50 rounded-lg">
              <p className="text-xs text-chrome-400">
                Need 2+ snapshots to show period-over-period changes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
