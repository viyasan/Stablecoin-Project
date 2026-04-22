import { useMemo } from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import type { ReserveSnapshot } from '../../data/reserveHistory';
import { formatBillions, formatRatio } from '../../utils/formatters';

interface ReserveSnapshotTableProps {
  snapshots: ReserveSnapshot[];
  symbol: string;
}

export function ReserveSnapshotTable({ snapshots, symbol }: ReserveSnapshotTableProps) {
  // descending: newest row first, so sorted[i+1] is the prior report
  const sorted = useMemo(
    () => [...snapshots].sort((a, b) => b.date.localeCompare(a.date)),
    [snapshots]
  );

  if (snapshots.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-chrome-200 p-8 text-center">
        <p className="text-chrome-400 text-sm">
          No reserve snapshots available for {symbol} yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-chrome-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-chrome-100">
        <h2 className="text-lg font-semibold text-chrome-900">Snapshot History — {symbol}</h2>
        <p className="text-xs text-chrome-500 mt-1">All attestation reports on record</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-chrome-100 bg-chrome-50">
              <th className="px-6 py-3 text-left font-medium text-chrome-500 uppercase tracking-wider text-xs">Date</th>
              <th className="px-6 py-3 text-right font-medium text-chrome-500 uppercase tracking-wider text-xs">Total Reserves</th>
              <th className="px-6 py-3 text-right font-medium text-chrome-500 uppercase tracking-wider text-xs">Treasury Holdings</th>
              <th className="px-6 py-3 text-right font-medium text-chrome-500 uppercase tracking-wider text-xs">Backing Ratio</th>
              <th className="px-6 py-3 text-center font-medium text-chrome-500 uppercase tracking-wider text-xs">Source</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((snap, i) => {
              const prev = sorted[i + 1];
              const reserveChange = prev ? snap.totalReserves - prev.totalReserves : null;

              return (
                <tr key={snap.date} className="border-b border-chrome-50 hover:bg-chrome-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-chrome-800">{snap.reportPeriod}</td>
                  <td className="px-6 py-4 text-right font-mono-numbers text-chrome-800 flex items-center justify-end gap-2">
                    {formatBillions(snap.totalReserves)}
                    {reserveChange !== null && (
                      <span className={`text-xs ${reserveChange >= 0 ? 'text-status-positive' : 'text-status-negative'}`}>
                        <ArrowUpRight className={`w-3 h-3 inline ${reserveChange < 0 ? 'rotate-90' : ''}`} />
                        {formatBillions(Math.abs(reserveChange))}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-mono-numbers text-chrome-800">
                    {formatBillions(snap.treasuryHoldings)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-mono-numbers font-semibold ${
                      snap.backingRatio >= 1 ? 'text-status-positive' : 'text-status-negative'
                    }`}>
                      {formatRatio(snap.backingRatio)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <a
                      href={snap.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-chrome-400 hover:text-gold-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
